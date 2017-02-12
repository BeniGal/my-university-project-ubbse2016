import englishLanguageAnalisys


def select_language(language):
    """
    Select the language to be used.
    :param language: <string> language code
    :return: <AbstractLanguageAnalysis> corresponding language analyser
    """

    if language == "en":
        return englishLanguageAnalisys.EnglishLanguageAnalisys()
    else:
        raise NotImplementedError("The analyser for the language {} is not supported!" .format(language))
