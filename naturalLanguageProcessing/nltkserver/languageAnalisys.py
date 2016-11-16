from nltk.tokenize import word_tokenize, sent_tokenize
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
        STRCN: {<DT>? <JJ>* <NN>*}
        STRCN: {<NNP.?>+}
        STRCV: {<VB.*>+}
        STRCA: {<STRCV> <STRCN>}
        STRIN: {<IN>}
        STRREL: {<STRC.?> <STRIN> <STRC.?>}
    """

    def __init__(self):
        self.chunkGeneralParser = nltk.RegexpParser(self.generalRegexp)

    def tag(self, sentence):
        return nltk.pos_tag(word_tokenize(sentence))

    def chunkGeneral(self, tags):
        chunked = self.chunkGeneralParser.parse(tags)
        return NltkTreeUtil.listTree(chunked)

    def printGeneral(self, tags):
        chunked = self.chunkGeneralParser.parse(tags)
        return NltkTreeUtil.printTree(chunked)

languageAnalisys = LanguageAnalisys()

class QuestionParser(object):

    def __init__(self, question):
        self.question = question
        self.parsed = {}

    def typeClarify(self, structure):
        for struct in structure:
            if struct['type'] == 'QTP':
                struct['type'] = 'Question Type'
            elif struct['type'] == 'STRCN':
                struct['type'] = 'Structure Core Noun'
            elif struct['type'] == 'STRCV':
                struct['type'] = 'Structure Core Verb'
            elif struct['type'] == 'STRCA':
                struct['type'] = 'Structure Core Action'
            elif struct['type'] == 'STRIN':
                struct['type'] = 'Structure Link'
            elif struct['type'] == 'STRREL':
                struct['type'] = 'Structure Relation'
            elif struct['type'] == 'S':
                struct['type'] = 'Root'

        return structure

    def parseQuestion(self):

        # keyword
        tags = languageAnalisys.tag(self.question)
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
        tag = languageAnalisys.tag(line)
        languageAnalisys.printGeneral(tag)
