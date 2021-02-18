import {complete} from './complete';

const categories = {
    'a': ['a1a', 'a1b', 'a2a', 'a2b'],
    'b': ['b1', 'b2']
};

describe("complete", () => {
    test("complete at end of expression", () => {
        test_complete('a == ', 5, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 5]);
        test_complete('b == ', 5, ['b1', 'b2'], [5, 5]);
        test_complete('b ==       ', 5, ['b1', 'b2'], [5, 5]);
        test_complete('', 12, ['a', 'b'], [12, 12]);
        test_complete('  ', 12, ['a', 'b'], [12, 12]);
        test_complete('\t\n', 12, ['a', 'b'], [12, 12]);
        test_complete('    ', 0, ['a', 'b'], [0, 0]);
        test_complete('    ', 1, ['a', 'b'], [1, 1]);
        test_complete('    ', 2, ['a', 'b'], [2, 2]);
        test_complete('b == ', 4, ['b1', 'b2'], [4, 4]);
        test_complete('b ==', 4, ['b1', 'b2'], [4, 4]);
        test_complete('b ==', 9, ['b1', 'b2'], [9, 9]);
        test_complete('b == ', 9, ['b1', 'b2'], [9, 9]);
    });

    test("complete at end of expression, incomplete token", () => {
        // if we complete at the end of the (non-whitespace part of the) expression we get completion suggestions
        // that consider the characters that were entered already
        test_complete('a == a1    ', 7, ['a1a', 'a1b'], [5, 7]);
        test_complete('a == x1    ', 7, [], null);
        // here we get no suggestions, because the 'previous' expression is invalid (we evaluate 'a == a1 x')
        test_complete('a == a1    ', 8, [], null);
    });

    test("complete at end of expression, with previous error", () => {
        // in case the expression contains an error that is found before the position our cursor is at we do not
        // get any suggestions, because without further work they are simply not available! we do *not* want to get
        // suggestions to fix the first error (here a/b instead of xyz)!
        test_complete('xyz == a1 && a == ', 20, [], null);
        // here we get suggestions despite the error (unmatched opening '('). this is because even though the opening
        // parentheses comes first in the expression the error is not detected before the position we are editing is
        // inspected
        test_complete('( a == ', 8, ['a1a', 'a1b', 'a2a', 'a2b'], [8, 8]);
    });

    test("complete at whitespace within expression", () => {
        test_complete('a == a1 && b == b1', 1, ['a'], [0,1]);
        test_complete('a == a1 && b == b1', 4, [], null);
        test_complete('a == a1 && b == b1', 5, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 7]);
        test_complete('a == a1 && b == b1', 7, ['a1a', 'a1b'], [5, 7]);
        test_complete('a == x1a && b == b1', 5, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 8]);
        // no completions when there is a previous error
        test_complete('a == x1a && b == b1', 8, [], null);
    });

    test("complete at token within expression", () => {
        test_complete('a == a1a && b != b1', 0, ['a', 'b'], [0, 1]);
        test_complete('a == a1a && b != b2', 2, ['==', '!='], [2, 4]);
        test_complete('a == a1b && b == b1', 5, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 8]);
        test_complete('a == a2a && b == b2', 6, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 8]);
        test_complete('a == x2b && b == b1 || a == a1a', 5, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 8]);
        // here we filter out some of the options due to the current cursor position
        test_complete('a == a2b && b == b1', 7, ['a2a', 'a2b'], [5, 8]);
        test_complete('a == a2b && b == b1', 8, ['a2b'], [5,8]);
        test_complete('a == a && b == b1', 5, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 6]);
        test_complete('a == a && b == b1', 6, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 6]);
        test_complete('a == a2 && b == b1', 6, ['a1a', 'a1b', 'a2a', 'a2b'], [5, 7]);
        test_complete('a == a2 && b == b1', 7, ['a2a', 'a2b'], [5, 7]);
        // no completions when there is a previous error
        test_complete('a == x2b && b == b1 || a == a1a', 12, [], null);
        test_complete('a == x2b && b == b1 || a == a1a', 17, [], null);
    });

    // todo: similar to end of expression: partial token within expression!?! maybe we could also check the expression
    // and only offer partial completions if there is an error already, otherwise offer 'replace'
});

function test_complete(expression, pos, suggestions, range) {
    const completion = complete(expression, pos, categories)
    try {
        expect(completion.suggestions).toStrictEqual(suggestions);
        expect(completion.range).toStrictEqual(range);
    } catch (e) {
        Error.captureStackTrace(e, test_complete);
        throw e;
    }
}