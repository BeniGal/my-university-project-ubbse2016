import json
import languagePicker

# For now, only english is supported
languageAnalysis = languagePicker.select_language("en")


class QuestionParser(object):

    def __init__(self, question):
        self.question = question
        self.parsed = {}

    def type_clarify(self, structure):
        for struct in structure:
            if struct['type'] == 'QTP':
                struct['type'] = ['Question', 'Type']
            elif struct['type'] == 'STRCN':
                struct['type'] = ['Structure', 'Core', 'Noun']
            elif struct['type'] == 'STRCV':
                struct['type'] = ['Structure', 'Core', 'Verb']
            elif struct['type'] == 'STRCA':
                struct['type'] = ['Structure', 'Core', 'Action']
            elif struct['type'] == 'STRIN':
                struct['type'] = ['Structure', 'Conjunction']
            elif struct['type'] == 'STRCC':
                struct['type'] = ['Structure', 'Link']
            elif struct['type'] == 'STRCMN':
                struct['type'] = ['Structure', 'Core', 'Multiple', 'Noun']
            elif struct['type'] == 'STRREF':
                struct['type'] = ['Structure', 'Reference']
            elif struct['type'] == 'STRAD':
                struct['type'] = ['Structure', 'Additional']
            elif struct['type'] == 'S':
                struct['type'] = 'Root'

        return structure


    def parse_question(self):

        # keyword
        tags = languageAnalysis.tag(self.question)
        for tag in tags:
            print(tag)
        self.parsed['question'] = self.question

        components, something = languageAnalysis.chunk_general(tags)
        for comp in components:
            x = ""
            for i in comp['content']:
                if len(x) == 0:
                    x += i
                else:
                    x += " " + i
            comp['content'] = x
        components = self.type_clarify(components)
        self.parsed['components'] = components

        return json.dumps(self.parsed)
