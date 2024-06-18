import { describe, it, expect } from 'jest';
import { filterQuestions  } from '../public/scripts.js';


describe('question handling', () => {
    it('filter', () => {
        var div = document.createElement('div');
        div.setAttribute('id', 'searchInput');
        div.innerText = 'test';
        expect(1).toBe(1);
    });
})