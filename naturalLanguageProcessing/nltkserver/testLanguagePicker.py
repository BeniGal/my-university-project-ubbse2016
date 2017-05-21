import unittest
import languagePicker

class TestLanguagePicker(unittest.TestCase):

    def test_select_language_1(self):
        """ Selects english language analyzer """
        ela = languagePicker.select_language("en")
        self.assertTrue(isNotNone(ela))

    def test_select_language_2(self):
        """ Raises error when language isn't implemented """
        with self.assertRaises(NotImplementedError):
            ela = languagePicker.select_language("hu")

def isNotNone(x):
    return x is not None

if __name__ == '__main__':
    unittest.main()
