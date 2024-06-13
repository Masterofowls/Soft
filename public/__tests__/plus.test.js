import {expect, test} from '@jest/globals';
import plus from '../src/tests_for_jest/plus.js';

test('plus', () => {
    expect(plus(1, 2)).toBe(3);
});

test('not plus', () => {
    expect(plus()).toBe();
});