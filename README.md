# NoCodeComments

[![Tests](https://github.com/Aaqibhafeezkhan/NoCodeComments/actions/workflows/ci.yml/badge.svg)](https://github.com/Aaqibhafeezkhan/NoCodeComments/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Strip source-code comments without damaging the code around them.**

NoCodeComments is a browser-first, privacy-friendly code comment remover. Paste code or open a local file, choose a language or use auto-detection, and get a comment-free result you can copy or download. Processing happens in your browser; source code is not uploaded to a server.

## Features

- Conservative lexical scanning for line and block comments.
- Protects comment-like text inside configured strings, template literals and regex literals.
- Preserves line breaks inside removed multiline comments.
- Explicit language profiles for dozens of language families, plus a conservative generic fallback.
- Language detection from common filenames and source-code patterns.
- Drag-and-drop and local file opening.
- Copy, swap, clear and download actions.
- Optional blank-line collapsing and long-line wrapping.
- Live character, line and byte statistics.
- Light and dark themes.
- Keyboard shortcuts: `Ctrl+Enter` process, `Ctrl+Shift+S` swap, `Ctrl+D` download, `Ctrl+L` clear.
- No account, backend, build step or external service required.

## Try it

Open the [NoCodeComments web app](https://aaqibhafeezkhan.github.io/NoCodeComments/).

To run locally, clone the repository and serve the project directory with any static HTTP server:

```bash
git clone https://github.com/Aaqibhafeezkhan/NoCodeComments.git
cd NoCodeComments
python -m http.server 8000
```

Then open http://localhost:8000.

## Development and tests

Requires Node.js 20 or newer.

```bash
npm test
```

The test suite uses Node's built-in test runner. There is no dependency installation or application build step.

## How it works

The reusable transformation function is `stripComments(code, language)` in [src/comment-stripper.js](src/comment-stripper.js). Language-specific delimiters and protected-string behavior live in [src/languages.js](src/languages.js).

The scanner is lexical, not a full parser or AST transformer. It does not compile, execute or guarantee syntactic validity of transformed code. Language dialects and context-sensitive grammar can require more sophisticated parsing. Unknown languages use a best-effort generic profile; select the language explicitly when accuracy matters.

See [Phase 0 parser baseline](docs/phase-0-parser-cli-baseline.md) for the supported behavior and limitations. The original implementation remains available in [legacy/](legacy/).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), follow the issue templates and include focused regression tests for parser changes. The [project roadmap](https://github.com/Aaqibhafeezkhan/NoCodeComments/issues/17) tracks the ongoing parser, CLI, safety and release phases.

## Security

Please do not publish security vulnerabilities in public issues. See [SECURITY.md](SECURITY.md) for private reporting guidance.

## License

NoCodeComments is licensed under the [MIT License](LICENSE). This applies to original project code and documentation owned by this project; third-party material remains subject to its own terms.
