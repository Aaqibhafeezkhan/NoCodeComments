import test from 'node:test';
import assert from 'node:assert/strict';
import { stripComments } from '../src/comment-stripper.js';

test('nested block comments are removed for C++ profiles', () => {
  assert.equal(stripComments('a /* outer /* inner */ outer */ b', 'cpp'), 'a  b');
});
test('regex character classes containing comment markers stay intact', () => {
  assert.equal(stripComments('const rx = /[/*]\\//; // remove', 'javascript'), 'const rx = /[/*]\\//; ');
});
test('Visual Basic REM requires a keyword boundary', () => {
  assert.equal(stripComments('REM remove\nREMINDER keep', 'vb'), '\nREMINDER keep');
});
test('Batch REM requires a keyword boundary', () => {
  assert.equal(stripComments('REM remove\nREMOTE keep', 'batch'), '\nREMOTE keep');
});
test('unterminated strings are preserved conservatively', () => {
  assert.equal(stripComments('const value = "http://keep // not a comment', 'javascript'), 'const value = "http://keep // not a comment');
});
