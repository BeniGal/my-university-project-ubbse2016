import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import wordnet

from nltk.corpus import conll2000

NPChunker = None

class ChunkParser(nltk.ChunkParserI):
    def __init__(self, train_sents):
        train_data = [[(t,c) for w,t,c in nltk.chunk.tree2conlltags(sent)]
            for sent in train_sents]
        self.tagger = nltk.TrigramTagger(train_data)

    def parse(self, sentence):
        pos_tags = [pos for (word,pos) in sentence]
        tagged_pos_tags = self.tagger.tag(pos_tags)
        chunktags = [chunktag for (pos, chunktag) in tagged_pos_tags]
        conlltags = [(word, pos, chunktag) for ((word,pos),chunktag)
            in zip(sentence, chunktags)]

        return nltk.chunk.conlltags2tree(conlltags)

def printTree (tree, tabs = 0):
    print '\t'*tabs,
    print tree.label()
    for a in tree:
        if type(a) is nltk.Tree:
            printTree(a, tabs + 1)
        else:
            print '\t'*tabs,
            print "%s <- %s" % a

def getWordnetPos(posTag):

    if posTag.startswith('J'):
        return wordnet.ADJ
    elif posTag.startswith('V'):
        return wordnet.VERB
    elif posTag.startswith('N'):
        return wordnet.NOUN
    elif posTag.startswith('R'):
        return wordnet.ADV
    else:
        return None

def demo(sentence):

    print "============================"
    print "Tokens: "
    print "============================"
    tokens = word_tokenize(sentence)

    for i in tokens:
        print i

    print "============================"
    print "Stop words removed: "
    print "============================"
    stop_words = set(stopwords.words("english"))

    filtered = [token for token in tokens if not token in stop_words]

    for i in filtered:
        print i

    print "============================"
    print "Stemming: "
    print "============================"

    porter_stemmer = PorterStemmer()
    stemmed = map(porter_stemmer.stem, filtered)

    for i in stemmed:
        print i

    print "============================"
    print "Part of speach tagging: "
    print "============================"

    # https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
    tagged = nltk.pos_tag(tokens)

    for i in tagged:
        print i

    print "============================"
    print "Chunking: "
    print "============================"

    # Csoportositas
    chunkSubject = r"""SUBJECT: {<.*>+}
                        }<VB.?|IN|DT|MD|TO|RB|WRB|\.>+{"""
    chunkAction = r"""ACTION: {<VB.?><DT>?<NN.?>?}
                        }<\.?>{"""
    chunkDeterminatior = r"""DETERMINATOR: {<WRB|WDT|WP|WP\$>+<VB.?>*} """

    chunkSubjectParser = nltk.RegexpParser(chunkSubject)
    chunkedSubject = chunkSubjectParser.parse(tagged)

    chunkActionParser = nltk.RegexpParser(chunkAction)
    chunkedAction = chunkActionParser.parse(tagged)

    chunkDeterminatiorParser = nltk.RegexpParser(chunkDeterminatior)
    chunkedDeterminator = chunkDeterminatiorParser.parse(tagged)

    printTree(chunkedSubject)
    printTree(chunkedAction)
    printTree(chunkedDeterminator)

    print "============================"
    print "Named entity: "
    print "============================"

    namedEntity = nltk.ne_chunk(tagged)
    printTree(namedEntity)

    print "============================"
    print "Lemmatizer: "
    print "============================"

    lemmatizer = WordNetLemmatizer()

    lemmas = []
    for word, pos in tagged:
        wordnetPos = getWordnetPos(pos)
        if not wordnetPos == None:
            lemmas.append(lemmatizer.lemmatize(word, wordnetPos))

    print lemmas

    print "============================"
    print "NP Chunker: "
    print "============================"

    npChunk = NPChunker.parse(tagged)
    printTree(npChunk)

if __name__ == "__main__":

    test_sents = conll2000.chunked_sents('test.txt', chunk_types=['NP'])
    train_sents = conll2000.chunked_sents('train.txt', chunk_types=['NP'])
    NPChunker = ChunkParser(train_sents)

    examples2 = ["What is the capital of the United States?",
        "Were did James Cook die?",
        "What is the weather in central Europe?"]

    examples = ["Why are the elections so problematic?",
        "Where can i find an ATM?",
        "What is the capital of Romania?",
        "Open a cat video for me.",
        "I want to go clubbing.",
        "Is it raining?",
        "What is wrong with Donald Trump?",
        "Open John Oliver's latest video."]

    for example in examples2:
        print
        print example
        demo(example)
        print
        print
