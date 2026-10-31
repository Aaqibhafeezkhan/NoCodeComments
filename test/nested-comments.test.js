import test from 'node:test';
import assert from 'node:assert/strict';
import { stripComments } from '../src/comment-stripper.js';

const profiles = [
  ['rust', '/*', '*/'],
  ['swift', '/*', '*/'],
  ['kotlin', '/*', '*/'],
  ['scala', '/*', '*/'],
  ['dart', '/*', '*/'],
  ['haskell', '{-', '-}'],
  ['julia', '#=', '=#'],
  ['nim', '#[', ']#'],
  ['d', '/+', '+/'],
];

for (const [language, open, close] of profiles) {
  test(`${language} removes nested blocks without losing surrounding code`, () => {
    const input = `before ${open} outer ${open} inner ${open} deepest ${close} inner ${close} outer ${close} after`;
    assert.equal(stripComments(input, language), 'before  after');
  });

  test(`${language} preserves mixed line endings inside nested blocks`, () => {
    const input = `before ${open} outer\r\n${open} inner\r${close}\nouter ${close} after`;
    assert.equal(stripComments(input, language), 'before \r\n\r\n after');
  });

  test(`${language} removes an unterminated outer block through end of input`, () => {
    const input = `before ${open} outer\n${open} inner ${close}\r\nstill outer`;
    assert.equal(stripComments(input, language), 'before \n\r\n');
  });

  test(`${language} preserves nested delimiters inside strings`, () => {
    const input = `"${open} outer ${open} inner ${close} outer ${close}"`;
    assert.equal(stripComments(input, language), input);
  });
}

for (const language of ['javascript', 'c', 'cpp', 'go', 'css']) {
  test(`${language} still strips ordinary block comments and protects strings`, () => {
    const input = '"/* keep */" /* remove\r\nthis */ after';
    assert.equal(stripComments(input, language), '"/* keep */" \r\n after');
  });
}

test('HTML closes a non-nesting comment at its first closing delimiter', () => {
  assert.equal(stripComments('before <!-- outer <!-- inner --> after -->', 'html'), 'before  after -->');
});
