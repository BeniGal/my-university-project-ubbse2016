class AbstractLanguageAnalysis(object):
    """
    Abstract class used as a base class for language analysis functions.
    """

    def tag(self, sentence):
        raise NotImplementedError("\"AbstractLagnuageAnalysis.tag\" needs to be implemented.")

    def chunk_general(self, tags):
        raise NotImplementedError("\"AbstractLanguageAnalysis.chunk_general\" needs to be implemented.")