# Phase 0 — Parser and CLI Baseline

## Scope

Phase 0 defines the contract for the existing transformation engine and documents the boundary between the current browser application and the future CLI work.

## Supported language profiles

| Family | Line markers | Block markers | Protected strings | Special handling |
| --- | --- | --- | --- | --- |
| C / C++ / C# / Java / JS / TS / Go / Rust / Swift / Kotlin / Scala / Dart / Groovy / D / Solidity | `//` | `/* */` | quotes; template strings where supported | JS/TS/related regex literals where enabled |
| PHP | `//`, `#` | `/* */` | quotes | conservative regex literals |
| CSS / SCSS / Less | none | `/* */` | quotes | stylesheet profile |
| HTML / XML / SVG | none | `<!-- -->` | quotes | markup profile |
| Python / R / Shell / PowerShell / YAML / Elixir / Nim | `#` | profile-specific where applicable | quotes | triple strings or PowerShell blocks where applicable |
| Ruby | `#` | `=begin` / `=end` | quotes | block-comment profile |
| Perl | `#` | none | quotes | conservative regex literals |
| SQL | `--` | `/* */` | quotes | SQL profile |
| Lua | `--` | `--[[ ]]` | quotes | nested/triple handling where configured |
| Haskell | `--` | `{- -}` | quotes | nested block comments |
| Julia | `#` | `#= =#` | quotes | nested/triple handling where configured |
| MATLAB | `%` | `%{ %}` | quotes | MATLAB profile |
| Fortran / Erlang / Prolog | language-specific | profile-specific | quotes | explicit language profile |
| Lisp-family | `;` | none | quotes | family profile |
| Pascal | `//` | `{ }`, `(* *)` | quotes | multiple block forms |
| HCL / Terraform | `#`, `//` | `/* */` | quotes | explicit profile |
| JSONC | `//` | `/* */` | double quotes | JSONC profile |
| Visual Basic | `'` | none | double quotes | `REM` keyword comments |
| Batch | `::` | none | double quotes | `REM` keyword comments |
| Assembly | `;`, `#` | none | quotes | explicit profile |
| COBOL | `*>` | none | quotes | explicit profile |
| Generic fallback | `//`, `#`, `--`, `;` | `/* */`, `<!-- -->` | quotes | intentionally conservative |

The authoritative implementation is the language registry in `src/languages.js`; this table describes the Phase 0 contract rather than replacing that registry.

## Transformations

The baseline transformation is `stripComments(code, language)`:

1. Resolve the requested language profile.
2. Preserve configured string and template/triple-string regions.
3. Preserve regex literals for profiles that explicitly enable them when the scanner can conservatively identify their start.
4. Remove configured block comments.
5. Remove configured line comments and keyword-based comments.
6. Preserve line breaks contained in removed block comments.
7. Return the resulting source text without executing or compiling it.

No AST is constructed and no semantic transformation is attempted. The operation is deliberately lexical.

## Current application behavior

The public application is browser-only and static. Users paste/type code or open/drop a file, choose a language or use auto-detection, process the input live, copy the output, swap it back into the input, clear the editor, or download the result. Downloading preserves the original extension when an input filename is available.

The current package contract requires Node.js 20+ and exposes `npm test`, which runs the Node test runner. This package/test contract is suitable for validating the reusable scanner but does not make the application itself a CLI yet.

## Safety assumptions

- Comment markers inside protected string literals are not treated as comments.
- Multiline comment removal retains embedded line breaks so source layout is not unnecessarily collapsed.
- Unknown languages use the generic profile and therefore provide only conservative best-effort stripping.
- Unterminated strings or comments are consumed through the remaining input; the scanner does not guess where malformed constructs end.
- Regex recognition is intentionally conservative and is only enabled for profiles that declare it.
- The tool does not guarantee syntactic validity after transformation because it does not parse or compile the source.
- Auto-detection is heuristic and should not be treated as a language parser. Explicit language selection is the stronger contract.
- Destructive file-system operations are not part of the current browser baseline. The application operates on in-memory text and user-selected files.

## Parser strategy boundaries

The scanner is appropriate for predictable delimiter-based comment syntax with explicitly configured language profiles. It is not a universal grammar engine. Future work must account for languages where comments interact with preprocessing, interpolation, nested lexical states, context-sensitive syntax, or dialect-specific rules.

The following remain outside the Phase 0 guarantee:

- semantic or AST-aware transformations
- compile-time validation
- dialect-complete parsing
- automatic recovery from malformed source
- filesystem traversal and in-place mutation
- a stable command-line interface

These boundaries are intentional. Phase 1 can improve language-specific parsing without conflating the scanner with a full compiler front end; later phases can introduce file workflows, safety controls, and CLI ergonomics independently.

## Phase 0 completion criteria

- Supported language families and their comment transformations are documented.
- Existing browser behavior and the `stripComments` API are documented.
- Safety assumptions are explicit.
- Lexical-scanner boundaries are explicit.
- CLI work is identified as future scope rather than being implied by the current static application.
