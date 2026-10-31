# Contributing to NoCodeComments

Thanks for considering a contribution.

## Before you start

- Check the [open issues](https://github.com/Aaqibhafeezkhan/NoCodeComments/issues) and the [project roadmap](https://github.com/Aaqibhafeezkhan/NoCodeComments/issues/17).
- For substantial changes, open or comment on an issue first so the scope is agreed before implementation.
- Keep pull requests focused. One issue per pull request is preferred.

## Local setup

No dependency installation or build step is required for the browser application. Serve the repository root with a static server:

```bash
python -m http.server 8000
```

Use Node.js 20 or newer for the test suite:

```bash
npm test
```

## Code and tests

- Follow the existing vanilla JavaScript and ES module style.
- Keep browser functionality dependency-free unless a change clearly justifies a dependency.
- Add regression tests for comment syntax, string/regex protection and malformed input whenever parser behavior changes.
- Do not describe a language profile as fully supported unless its behavior is covered by representative tests.
- Keep the scanner conservative. Do not silently remove code that may not be a comment.
- Do not add telemetry, remote code processing or source-code uploads.

## Pull requests

A useful pull request includes:

1. The problem and intended behavior.
2. A concise description of the implementation.
3. Tests added or updated.
4. Any language limitations or compatibility implications.

Keep changes focused and avoid unrelated formatting or dependency changes.

## Reporting issues

Use the bug report template for reproducible defects and the feature request template for proposed behavior. Include a minimal input example and expected output when reporting parser behavior.
