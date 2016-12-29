from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import nltk
import json
import uuid

class NltkTreeUtil(object):

    # @staticmethod
    # def printTree (tree, tabs = 0):
    #     print '-'*tabs,
    #     print tree.label()
    #     for a in tree:
    #         if type(a) is nltk.Tree:
    #             NltkTreeUtil.printTree(a, tabs + 1)
    #         else:
    #             print '-'*(tabs+1),
    #             print "%s <- %s" % a

    @staticmethod
    def getTaggedTree(tree, label, tagged=False):
        results = []

        if tree.label() == label:
            tagged = True

        for a in tree:
            if type(a) is nltk.Tree:
                results += NltkTreeUtil.getTaggedTree(a, label, tagged)
            elif tagged:
                results.append(a[0])
        return results

    @staticmethod
    def listTree(tree, cid=0):
        results = []

        my = {}
        my['uuid'] = cid
        my['type'] = tree.label()
        my['elements'] = []
        my['content'] = []
        for a in tree:
            if type(a) is nltk.Tree:
                uid = str(uuid.uuid4())
                my['elements'] += [uid];
                result, content = NltkTreeUtil.listTree(a, uid)
                my['content'] += content
                results += result
            else:
                my['content'].append(a[0])

        if len(my['elements']) == 0:
            my['elements'] = None
        if len(my['content']) == 0:
            ny['content'] = None

        results += [my]

        return results, my['content']

class LanguageAnalisys(object):

    generalRegexp = r"""
        QTP: {<WP|WRB>}
        STRCN: {<DT>? <JJ.*>* <FW|NN|NNS|VBG>* <NNP.?>+}
        STRCN: {<DT>? <JJ.*>* <FW|NN|NNS|VBG>+}
        STRCV: {<VB.*>+ <JJ.*>*}
        STRAD: {<RB.*> <JJ.*>*}
        STRIN: {<IN>}
        STRCC: {<CC>}
        STRCA: {<STRCV> <STRC.+>}
        STRCMN: {<STRCN> <STRCC> <STRCN>}
    """

    advancedRegexp = r"""
        STRREF: {<STRCA> <STRIN> <STRC.+>}
    """

    def __init__(self):
        self.chunkGeneralParser = nltk.RegexpParser(self.generalRegexp)
        self.chunkAdvancedParser = nltk.RegexpParser(self.advancedRegexp)

    def tag(self, sentence):
        return nltk.pos_tag(word_tokenize(sentence))

    def chunkGeneral(self, tags):
        chunked = self.chunkGeneralParser.parse(tags)
        final = self.chunkAdvancedParser.parse(chunked)
        return NltkTreeUtil.listTree(final)

    def printGeneral(self, tags):
        chunked = self.chunkGeneralParser.parse(tags)
        final = self.chunkAdvancedParser.parse(chunked)
        return NltkTreeUtil.printTree(chunked)

languageAnalisys = LanguageAnalisys()

class QuestionParser(object):

    def __init__(self, question):
        self.question = question
        self.parsed = {}

    def typeClarify(self, structure):
        for struct in structure:
            if struct['type'] == 'QTP':
                struct['type'] = ['Question', 'Type']
            elif struct['type'] == 'STRCN':
                struct['type'] = ['Structure','Core','Noun']
            elif struct['type'] == 'STRCV':
                struct['type'] = ['Structure','Core','Verb']
            elif struct['type'] == 'STRCA':
                struct['type'] = ['Structure','Core','Action']
            elif struct['type'] == 'STRIN':
                struct['type'] = ['Structure','Conjunction']
            elif struct['type'] == 'STRCC':
                struct['type'] = ['Structure','Link']
            elif struct['type'] == 'STRCMN':
                struct['type'] = ['Structure','Core','Multiple','Noun']
            elif struct['type'] == 'STRREF':
                struct['type'] = ['Structure','Reference']
            elif struct['type'] == 'STRAD':
                struct['type'] = ['Structure','Additional']
            elif struct['type'] == 'S':
                struct['type'] = 'Root'

        return structure

    def parseQuestion(self):

        # keyword
        tags = languageAnalisys.tag(self.question)
        for tag in tags:
            print(tag)
        self.parsed['question'] = self.question

        components, something = languageAnalisys.chunkGeneral(tags)
        for comp in components:
            x = ""
            for i in comp['content']:
                if len(x) == 0:
                    x += i
                else:
                    x += " " + i
            comp['content'] = x
        components = self.typeClarify(components)
        self.parsed['components'] = components

        return json.dumps(self.parsed)



if __name__ == "__main__":
    with open("tests/sample1.questions") as f:
        content = f.readlines()
    for line in content:
        print("===alahuakbar===")
        print(line)
        questionParser = QuestionParser(line)
        print(questionParser.parseQuestion())
        print("===alahuakbar===")
