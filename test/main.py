import os
import requests
import json
import time

context = {
    "nltk_id": "",
    "node_id": "",
    "total": 0,
    "passed": 0
}

URL = "http://localhost:80/googleSearch"
FILENAME = "tests.json"

def Setup():
    stream = os.popen('docker run --hostname fakanl-nltk --name fakanal-nltk -d fakanal/nltk:1.1')
    context["nltk_id"] = stream.readline()[:-1]

    stream = os.popen('docker run --name fakanal-main -e API_KEY="AIzaSyD6DEq0jhmNqT55KcuWsAG673kIVerJAi8" -e API_CX="017188541386240305514:wqzgsxq14ui" -e NLTK_SERVER="http://fakanal-nltk:80" -d -p 80:8080 --link fakanal-nltk:fakanal-nltk fakanal/main:1.1')
    context["node_id"] = stream.readline()[:-1]


def TearDown():
    os.popen("docker stop fakanal-main")
    os.popen("docker stop fakanal-nltk")

    time.sleep(15)

    os.popen("docker rm fakanal-main")
    os.popen("docker rm fakanal-nltk")


def AskQuestion(question, expectedAnswer):
    json = {
        "question": question
    }
    response = requests.post(url=URL, json=json)
    actualAnswer = response.json()["response"]

    print("Expected: '{}'".format(expectedAnswer))
    print("Got:      '{}'".format(actualAnswer))

    if actualAnswer == expectedAnswer:
        print("OK")
        return True
    else:
        print("FAIL")
        return False


def RunTests():
    with open(FILENAME, "r") as f:
        currentCase = 1
        testCases = json.load(f)
        for testCase in testCases:
            print("Running test case {}" .format(currentCase))
            res = AskQuestion(testCase["question"], testCase["response"])
            context["total"] += 1
            if res:
                context["passed"] += 1
            currentCase += 1
            time.sleep(5)

if __name__ == '__main__':
    Setup()
    print("Waiting for services to start ...")
    time.sleep(30)
    print("Services are up!")

    try:
        print("Running tests ...")
        RunTests()
        print("DONE!")
        print("{} test passed out of {}" .format(context["passed"], context["total"]))
    except Exception as e:
        print(e)
    finally:
        TearDown()

