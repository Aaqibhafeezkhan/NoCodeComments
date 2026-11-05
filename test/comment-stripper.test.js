import test from 'node:test';
import assert from 'node:assert/strict';
import { stripComments } from '../src/comment-stripper.js';

const cases=[
['javascript',`const url = "https://example.com//keep"; // remove\nconst rx = /https?:\\/\\//; /* remove */\nconsole.log("/* keep */");`,`const url = "https://example.com//keep"; \nconst rx = /https?:\\/\\//; \nconsole.log("/* keep */");`],
['python',`value = "# keep" # remove\nprint("https://example.com/#keep")`,`value = "# keep" \nprint("https://example.com/#keep")`],
['sql',`SELECT '-- keep' AS x -- remove\n/* remove */ SELECT 1;`,`SELECT '-- keep' AS x \n SELECT 1;`],
['html',`<div title="<!-- keep -->"><!-- remove -->ok</div>`,`<div title="<!-- keep -->">ok</div>`],
['css',`.x{content:"/* keep */";/* remove */color:red}`,`.x{content:"/* keep */";color:red}`],
['shell',`echo "# keep" # remove\necho "https://x/#keep"`,`echo "# keep" \necho "https://x/#keep"`],
['lua',`local x="--keep" -- remove\n--[[ remove\nline ]]local y=1`,`local x="--keep" \n\nlocal y=1`],
['haskell',`x = "-- keep" -- remove\n{- remove -}\ny=1`,`x = "-- keep" \n\ny=1`],
['julia',`x="# keep" # remove\n#= remove =#\ny=1`,`x="# keep" \n\ny=1`],
['pascal',`x := '{ keep }'; { remove } y := 1;`,`x := '{ keep }';  y := 1;`],
['csharp',`var x = "https://x//y"; // remove`,`var x = "https://x//y"; `],
['yaml',`url: "https://x/#keep" # remove`,`url: "https://x/#keep" `]
];
for(const [language,input,expected] of cases)test(`${language} strips comments safely`,()=>assert.equal(stripComments(input,language),expected));
test('preserves multiline layout inside removed blocks',()=>assert.equal(stripComments('a=1;/* one\n two */\nb=2;','javascript'),'a=1;\n\nb=2;'));
test('does not strip comment markers inside unknown-language strings',()=>assert.equal(stripComments('text "http://keep" // remove','generic'),'text "http://keep" '));
test('does not alter code when no comments exist',()=>{const code='const value = "https://example.com//keep";';assert.equal(stripComments(code,'javascript'),code);});

test('javascript preserves regex after control-flow parentheses', () => {
  const code = 'if (ready) /https?:\\/\\//.test(url); // remove\nnext();';
  const expected = 'if (ready) /https?:\\/\\//.test(url); \nnext();';

  assert.equal(stripComments(code, 'javascript'), expected);
});

test('javascript preserves regex after return keyword', () => {
  const code = 'function test() { return /https?:\\/\\//.test(url); // remove\n}';
  const expected = 'function test() { return /https?:\\/\\//.test(url); \n}';

  assert.equal(stripComments(code, 'javascript'), expected);
});

test('javascript removes comments after postfix division expressions', () => {
  const code = 'const result = value++ / 2; // remove\nnext();';
  const expected = 'const result = value++ / 2; \nnext();';

  assert.equal(stripComments(code, 'javascript'), expected);
});

test('javascript handles postfix decrement before division', () => {
  const code = 'const result = value-- / 2; // remove\nnext();';
  const expected = 'const result = value-- / 2; \nnext();';

  assert.equal(stripComments(code, 'javascript'), expected);
});

test('javascript handles division after grouped expressions', () => {
  const code = 'const result = (value + 2) / 3; // remove\nnext();';
  const expected = 'const result = (value + 2) / 3; \nnext();';

  assert.equal(stripComments(code, 'javascript'), expected);
});

test('javascript handles division after function calls', () => {
  const code = 'const result = getValue() / 2; // remove\nnext();';
  const expected = 'const result = getValue() / 2; \nnext();';

  assert.equal(stripComments(code, 'javascript'), expected);
});

test('javascript preserves regex inside a block after control flow', () => {
  const code = 'if (ready) { /https?:\\/\\//.test(url); // remove\n}';
  const expected = 'if (ready) { /https?:\\/\\//.test(url); \n}';

  assert.equal(stripComments(code, 'javascript'), expected);
});

test('javascript treats object if method calls as division', () => {
  const code = 'const result = obj.if(ready) / 2; // remove\nnext();';
  const expected = 'const result = obj.if(ready) / 2; \nnext();';

  assert.equal(stripComments(code, 'javascript'), expected);
});

test('javascript treats optional chaining if calls as division', () => {
  const code = 'const result = obj?.if(ready) / 2; // remove\nnext();';
  const expected = 'const result = obj?.if(ready) / 2; \nnext();';

  assert.equal(stripComments(code, 'javascript'), expected);
});
