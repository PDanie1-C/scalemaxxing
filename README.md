# ScaleMAXXING Lexical Analyzer

ScaleMAXXING is a unit-aware programming language that ensures physical units like meters, seconds and kilograms are checked at compile time. It also employs bidirectional constraint links, so that corresponding variables update automatically, just like spreadsheet cells. This lexical analyzer takes in ScaleMAXXING source code and segments it into tokens (identifiers, keywords, operators, literals, and symbols), and it returns to print any sequence which does not comply with the rules of the language.

## Folder Structure

```
scalemaxxing/
├── lexer/          # Compiler logic (analyzer.js, tokens.js)
├── frontend/       # Vite + React user interface
├── tests/          # Unit tests for the lexer outputs
├── .gitignore
└── README.md
```

## Features

- Recognizes the ScaleMAXXING keywords (`dim`, `unit`, `pure`, `weight`) and reserved words (`bind`, `flow`, `when`, `snap`, `halt`, `emit`), and treats them as fixed tokens that cannot be used as identifiers.
- Tokenizes assignment operators (`=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`, `//=`), arithmetic operators (`+`, `-`, `*`, `/`, `%`, `**`, `//`), unary operators (`++`, `--`), relational operators (`==`, `!=`, `<`, `>`, `<=`, `>=`), and logical keywords (`and`, `or`, `not`).
- Recognizes the language-specific operators `<=>` (bidirectional link) and `=>` (one-way flow).
- Validates identifiers, which must begin with a letter or underscore, may contain letters, digits, and underscores, and are case-sensitive.
- Skips single-line (`//`) and multi-line (`/* */`) comments, and handles brackets, parentheses, commas, colons, periods, and semicolons as delimiters.

## Test Files

The `tests/` directory contains 6 `.txt` files designed for manual verification via the **Upload .txt** button in the UI.

## Running the Frontend

Navigate to the `frontend/` directory and run the Vite dev server:

```
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to interact with the analyzer and upload the test files. Happy using! :3