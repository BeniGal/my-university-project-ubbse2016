### Using the fakanal-nltk module

The python nltk server currently has the following endpoints:

`/` returns a greeting text ( used to check if connection with the server works )

`/nltk/rest` -> restbase ( all api url-s start with this )

`/nltk/rest/command` -> parse command
> Note: Work in progress, might change

Try out with curl:
```sh
curl -X POST --header "Content-Type: application/json" --data '{"question": "What is the capital of Romania?"}' http://127.0.0.1:8080/nltk/rest/command | python3 -mjson.tool
```

Response:
```json
{
    "components": [
        {
            "elements": null,
            "type": "Question Type",
            "content": "What",
            "uuid": "17eb43be-b7ee-4280-b1f7-cd52f96a0ea6"
        },
        {
            "elements": null,
            "type": "Structure Core Verb",
            "content": "is",
            "uuid": "122b74fb-49bc-417b-aeee-ca978c4bf981"
        },
        {
            "elements": null,
            "type": "Structure Core Noun",
            "content": "the capital",
            "uuid": "b8c85a1e-848c-4801-91bf-153842c9c6f4"
        },
        {
            "elements": [
                "122b74fb-49bc-417b-aeee-ca978c4bf981",
                "b8c85a1e-848c-4801-91bf-153842c9c6f4"
            ],
            "type": "Structure Core Action",
            "content": "is the capital",
            "uuid": "e2feaf20-ab27-4c1c-9175-4ff3ce37299a"
        },
        {
            "elements": null,
            "type": "Structure Link",
            "content": "of",
            "uuid": "6b845160-df48-4769-9107-df931c2afda0"
        },
        {
            "elements": null,
            "type": "Structure Core Noun",
            "content": "Romania",
            "uuid": "7cf65514-2a28-489d-8c0a-1f910d8cf7b9"
        },
        {
            "elements": [
                "e2feaf20-ab27-4c1c-9175-4ff3ce37299a",
                "6b845160-df48-4769-9107-df931c2afda0",
                "7cf65514-2a28-489d-8c0a-1f910d8cf7b9"
            ],
            "type": "Structure Relation",
            "content": "is the capital of Romania",
            "uuid": "a96ce71b-8520-4b04-ae26-e17ccc4d7b36"
        },
        {
            "elements": [
                "17eb43be-b7ee-4280-b1f7-cd52f96a0ea6",
                "a96ce71b-8520-4b04-ae26-e17ccc4d7b36"
            ],
            "type": "Root",
            "content": "What is the capital of Romania ?",
            "uuid": 0
        }
    ],
    "question": "What is the capital of Romania?"
}

```
