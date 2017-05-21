import unittest
import languagePicker

class TestEnglishLanguageAnalisys(unittest.TestCase):

    def test_tag_1(self):
        """ Stop worlds are removed (are) """
        ela = languagePicker.select_language("en")
        tags = ela.tag("Who are You?")

        self.assertEqual(tags[0], ("Who", "WP"))
        self.assertEqual(tags[1], ("You", "PRP"))

    def test_tag_2(self):
        """ Nouns are tagged properly """
        ela = languagePicker.select_language("en")
        tags = ela.tag("president of Romania")

        self.assertEqual(tags[0], ("president", "NN"))
        self.assertEqual(tags[1], ("Romania", "NNP"))

    def test_tag_3(self):
        """ Names are tagged as proper nouns """
        ela = languagePicker.select_language("en")
        tags = ela.tag("Donald Trump")

        self.assertEqual(tags[0], ("Donald", "NNP"))
        self.assertEqual(tags[1], ("Trump", "NNP"))

    def test_tag_4(self):
        """ Adjectives are tagged properly """
        ela = languagePicker.select_language("en")
        tags = ela.tag("second world war")

        self.assertEqual(tags[0], ("second", "JJ"))
        self.assertEqual(tags[1], ("world", "NN"))
        self.assertEqual(tags[2], ("war", "NN"))

    def test_chunk_general_1(self):
        """ Question type is tagged correctly """
        ela = languagePicker.select_language("en")
        tags = [('Who', 'WP'), ('You', 'PRP')]

        res, _ = ela.chunk_general(tags)
        self.assertEqual(len(res), 2)
        self.assertEqual(res[0]["type"], 'QTP')

    def test_chunk_general_2(self):
        """ Regular nouns and proper nouns are merged into one structure """
        ela = languagePicker.select_language("en")
        tags = [("president", "NN"), ("Romania", "NNP")]

        res, _ = ela.chunk_general(tags)
        self.assertEqual(len(res), 2)
        self.assertEqual(len(res[0]["content"]), 2)
        self.assertEqual(res[0]["type"], 'STRCN')

    def test_chunk_general_3(self):
        """ Adjective and multiple nouns are converted into a "Structure Core Noun" """
        ela = languagePicker.select_language("en")
        tags = [("second", "JJ"),("world", "NN"),("war", "NN")]

        res, _ = ela.chunk_general(tags)
        self.assertEqual(len(res), 2)
        self.assertEqual(len(res[0]["content"]), 3)
        self.assertEqual(res[0]["type"], "STRCN")

if __name__ == '__main__':
    unittest.main()
