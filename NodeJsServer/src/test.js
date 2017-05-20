var assert = require('chai').assert;
var googleApi = require('./googleApi');
var nltkApi = require('./nltkApi');

describe('Google API', function () {
    describe('#firstToLowerCase() good', function () {
        it('should return string with lower case first char', function () {
            var str = googleApi.firstToLowerCase('Test');

            assert.equal(str, 'test');
        });
    });

    describe('#firstToLowerCase() bad', function () {
        it('should fail because of lower case', function () {
            var str = googleApi.firstToLowerCase('Test');

            assert.notEqual(str, 'Test');
        });
    });

    describe('#filterResponse() good', function () {
        it('should filter response', function () {
            var test = 'This is a test, ...';
            var expected = 'This is a test';
            var actual = googleApi.filter(test);

            assert.equal(actual, expected);
        });
    });

    describe('#filterResponse() bad', function () {
        it('should be \"I don\'t know\"', function () {
            var test = '';
            var expected = 'I don\'t know';
            var actual = googleApi.filter(test);

            assert.equal(actual, expected);
        });
    });

    describe('#filterResponse() good', function () {
        it('should fail filter', function () {
            var test = 'This is a, ...test, ...';
            var expected = 'This is a test';
            var actual = googleApi.filter(test);

            assert.notEqual(actual, expected);
        });
    });
});

describe('Nltk API', function () {
    describe('#questionTypeFilter() good', function () {
        it('should return question type term', function () {
            var questionWhat = "what";
            var questionWhere = "where";
            var questionWho = "who";
            var questionWhy = "why";
            var questionWhen = "when";

            var termWhat = nltkApi.questionTypeFilter(questionWhat);
            var termWhere = nltkApi.questionTypeFilter(questionWhere);
            var termWho = nltkApi.questionTypeFilter(questionWho);
            var termWhy = nltkApi.questionTypeFilter(questionWhy);
            var termWhen = nltkApi.questionTypeFilter(questionWhen);

            assert.equal(termWhat, "definition");
            assert.equal(termWhere, "location");
            assert.equal(termWho, "person");
            assert.equal(termWhy, "reason");
            assert.equal(termWhen, "date");
        });
    });

    describe('#questionTypeFilter() good', function () {
        it('should return undefined', function () {
            var question = "WAS IST DAS";
            var term = nltkApi.questionTypeFilter(question);

            assert.isUndefined(term);
        });
    });

    describe('#searchByUUID() good', function () {
        it('should return correct element', function () {
            var testData = {
                question: 'What is the capital of Romania?',
                components:
                [{
                    uuid: '54e6f985-0327-4eb6-bdd4-497f23a231cb',
                    content: 'What',
                    elements: null,
                    type: [Object]
                },
                {
                    uuid: '222cbe81-5cf3-430e-8f86-9a7d3d9ab3a8',
                    content: 'capital Romania',
                    elements: null,
                    type: [Object]
                },
                {
                    uuid: 0,
                    content: 'What capital Romania ?',
                    elements: [Object],
                    type: 'Root'
                }]
            }
            var testUUId = '222cbe81-5cf3-430e-8f86-9a7d3d9ab3a8';
            var expected = {
                uuid: '222cbe81-5cf3-430e-8f86-9a7d3d9ab3a8',
                content: 'capital Romania',
                elements: null,
                type: [Object]
            }

            var actual = nltkApi.searchByUUID(testData, testUUId);

            assert.equal(expected.content, actual.content);
            assert.equal(expected.elements, actual.elements);
            assert.equal(expected.uuid, actual.uuid);

        });
    });

    describe('#searchByUUID() good', function () {
        it('should return undefined', function () {
            var testData = {
                question: 'What is the capital of Romania?',
                components:
                [{
                    uuid: '54e6f985-0327-4eb6-bdd4-497f23a231cb',
                    content: 'What',
                    elements: null,
                    type: null
                },
                {
                    uuid: '222cbe81-5cf3-430e-8f86-9a7d3d9ab3a8',
                    content: 'capital Romania',
                    elements: null,
                    type: null
                },
                {
                    uuid: 0,
                    content: 'What capital Romania ?',
                    elements: null,
                    type: 'Root'
                }]
            }
            var testUUId = 'randomuuid';
            var actual = nltkApi.searchByUUID(testData, testUUId);

            assert.isUndefined(actual);
        });
    });

    describe('#contains() good', function () {
        it('should be false', function () {
            var entry = ['Question', 'Type'];
            var type = 't';

            var result = nltkApi.contains(entry, type);
            assert.isFalse(result);
        });
    });

    describe('#contains() good', function () {
        it('should be true', function () {
            var entry = ['Question', 'Type'];
            var type = 'Type';

            var result = nltkApi.contains(entry, type);
            assert.isTrue(result);
        });
    });
});