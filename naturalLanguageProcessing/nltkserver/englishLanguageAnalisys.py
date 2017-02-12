from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk import RegexpParser, pos_tag, Tree
import uuid

from languageAnalisys import AbstractLanguageAnalysis

class EnglishLanguageAnalisys(AbstractLanguageAnalysis):


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

    stop = set(stopwords.words('english'))

    def __init__(self):
        self.chunkGeneralParser = RegexpParser(self.generalRegexp)
        self.chunkAdvancedParser = RegexpParser(self.advancedRegexp)

    def __get_tagged_tree(self, tree, label, tagged=False):
        results = []

        if tree.label() == label:
            tagged = True

        for a in tree:
            if type(a) is Tree:
                results += self.__get_tagged_tree(a, label, tagged)
            elif tagged:
                results.append(a[0])
        return results

    def __list_tree(self, tree, cid=0):
        results = []

        my = {}
        my['uuid'] = cid
        my['type'] = tree.label()
        my['elements'] = []
        my['content'] = []
        for a in tree:
            if type(a) is Tree:
                uid = str(uuid.uuid4())
                my['elements'] += [uid]
                result, content = self.__list_tree(a, uid)
                my['content'] += content
                results += result
            else:
                my['content'].append(a[0])

        if len(my['elements']) == 0:
            my['elements'] = None
        if len(my['content']) == 0:
            my['content'] = None

        results += [my]

        return results, my['content']

    def tag(self, sentence):
        tokens = word_tokenize(sentence)
        final = [w for w in tokens if not w in EnglishLanguageAnalisys.stop]
        return pos_tag(final)

    def chunk_general(self, tags):
        chunked = self.chunkGeneralParser.parse(tags)
        final = self.chunkAdvancedParser.parse(chunked)
        return self.__list_tree(final)



