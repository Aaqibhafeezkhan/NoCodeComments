export const commentEdgeCases = [
  {
    language: 'javascript',
    input: 'const url = "https://example.com//keep"; // remove\nconst rx = /https?:\\/\\//; /* remove */\nconsole.log("/* keep */");',
    expected: 'const url = "https://example.com//keep"; \nconst rx = /https?:\\/\\//; \nconsole.log("/* keep */");'
  },
  {
    language: 'python',
    input: 'value = "# keep" # remove\nprint("https://example.com/#keep")',
    expected: 'value = "# keep" \nprint("https://example.com/#keep")'
  },
  {
    language: 'sql',
    input: "SELECT '-- keep' AS x -- remove\n/* remove */ SELECT 1;",
    expected: "SELECT '-- keep' AS x \n SELECT 1;"
  },
  {
    language: 'html',
    input: '<div title="<!-- keep -->"><!-- remove -->ok</div>',
    expected: '<div title="<!-- keep -->">ok</div>'
  },
  {
    language: 'css',
    input: '.x{content:"/* keep */";/* remove */color:red}',
    expected: '.x{content:"/* keep */";color:red}'
  },
  {
    language: 'shell',
    input: 'echo "# keep" # remove\necho "https://x/#keep"',
    expected: 'echo "# keep" \necho "https://x/#keep"'
  },
  {
    language: 'lua',
    input: 'local x="--keep" -- remove\n--[[ remove\nline ]]local y=1',
    expected: 'local x="--keep" \n\nlocal y=1'
  },
  {
    language: 'haskell',
    input: 'x = "-- keep" -- remove\n{- remove -}\ny=1',
    expected: 'x = "-- keep" \n\ny=1'
  },
  {
    language: 'julia',
    input: 'x="# keep" # remove\n#= remove =#\ny=1',
    expected: 'x="# keep" \n\ny=1'
  },
  {
    language: 'pascal',
    input: "x := '{ keep }'; { remove } y := 1;",
    expected: "x := '{ keep }';  y := 1;"
  },
  {
    language: 'csharp',
    input: 'var x = "https://x//y"; // remove',
    expected: 'var x = "https://x//y"; '
  },
  {
    language: 'yaml',
    input: 'url: "https://x/#keep" # remove',
    expected: 'url: "https://x/#keep" '
  }
];
