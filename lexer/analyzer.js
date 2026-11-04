import {
  Tokens,
  KEYWORDS,
  DATA_TYPES,
  NOISE_WORDS,
  createLexeme,
} from './tokens.js';

// character classes base sa Robert Sebesta Chapter 4
export const CharClasses = Object.freeze({
  LETTER:    'LETTER',
  DIGIT:     'DIGIT',
  OPERATOR:  'OPERATOR',
  DELIMITER: 'DELIMITER',
  QUOTE:     'QUOTE',
  UNKNOWN:   'UNKNOWN',
  EOF:       'EOF',
});

// LexicalAnalyzer class gamit ang Method 2 (Programmed State Transition Diagram)
export class LexicalAnalyzer {
  constructor(statement) {
    this.input = statement || '';
    this.length = this.input.length;
    this.index = 0;

    // Sebesta Chapter 4 state variables
    this.nextChar = '';
    this.charClass = CharClasses.EOF;
    this.lexeme = '';

    // line at column tracking
    this.currentLine = 1;
    this.currentCol = 1;
    this.tokenStartLine = 1;
    this.tokenStartCol = 1;

    // Python-style indentation tracking
    this.indentStack = [0];
    this.atLineStart = true;
    this.pendingTokens = [];

    // unang tawag para ma-prime ang nextChar at charClass
    this.getChar();
  }

  // kumuha ng susunod na character at alamin ang character class nito
  getChar() {
    if (this.index < this.length) {
      this.nextChar = this.input.charAt(this.index);
      this.charLine = this.currentLine;
      this.charCol = this.currentCol;
      this.index++;

      // i-update ang line at col counter
      if (this.nextChar === '\n') {
        this.currentLine++;
        this.currentCol = 1;
      } else if (this.nextChar === '\r') {
        if (this.index < this.length && this.input.charAt(this.index) === '\n') {
          // hahayaan ang \n ang mag-increment
        } else {
          this.currentLine++;
          this.currentCol = 1;
        }
      } else if (this.nextChar === '\t') {
        this.currentCol += 4;
      } else {
        this.currentCol++;
      }

      this.charClass = this.classifyChar(this.nextChar);
    } else {
      this.nextChar = '';
      this.charClass = CharClasses.EOF;
      this.charLine = this.currentLine;
      this.charCol = this.currentCol;
    }
    return this.nextChar;
  }

  // tingnan ang susunod na char nang hindi ina-advance ang index
  peekChar(offset = 0) {
    const target = this.index + offset;
    if (target < this.length) {
      return this.input.charAt(target);
    }
    return '';
  }

  // ikategorya ang character sa Sebesta character class
  classifyChar(ch) {
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_') {
      return CharClasses.LETTER;
    }
    if (ch >= '0' && ch <= '9') {
      return CharClasses.DIGIT;
    }
    if (ch === '"' || ch === "'") {
      return CharClasses.QUOTE;
    }
    switch (ch) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '=':
      case '<':
      case '>':
      case '!':
        return CharClasses.OPERATOR;
      case '(':
      case ')':
      case '[':
      case ']':
      case '{':
      case '}':
      case ',':
      case ':':
      case ';':
      case '.':
      case '@':
        return CharClasses.DELIMITER;
      default:
        return CharClasses.UNKNOWN;
    }
  }

  // idugtong ang current char sa active lexeme buffer
  addChar() {
    this.lexeme += this.nextChar;
  }

  // sub-automaton para laktawan ang single-line at multi-line comments
  skipComment() {
    if (this.nextChar === '#') {
      if (this.peekChar() === '*') {
        // Multi-line comment: #* ... *#
        this.getChar(); // consume '#'
        this.getChar(); // consume '*'
        while (this.charClass !== CharClasses.EOF) {
          if (this.nextChar === '*' && this.peekChar() === '#') {
            this.getChar(); // consume '*'
            this.getChar(); // consume '#'
            break;
          }
          this.getChar();
        }
      } else {
        // Single-line comment: # hanggang newline
        while (this.charClass !== CharClasses.EOF && this.nextChar !== '\n') {
          this.getChar();
        }
      }
    } else if (this.nextChar === '[' && this.peekChar() === '#') {
      // Bracket multi-line comment: [# ... #]
      this.getChar(); // consume '['
      this.getChar(); // consume '#'
      while (this.charClass !== CharClasses.EOF) {
        if (this.nextChar === '#' && this.peekChar() === ']') {
          this.getChar(); // consume '#'
          this.getChar(); // consume ']'
          break;
        }
        this.getChar();
      }
    }
  }

  // sub-automaton para sa block scoping indentation sa simula ng bagong linya
  handleLineIndentation() {
    while (this.atLineStart && this.charClass !== CharClasses.EOF) {
      let indentCount = 0;

      // bilangin ang leading spaces at tabs
      while (this.charClass !== CharClasses.EOF && (this.nextChar === ' ' || this.nextChar === '\t')) {
        if (this.nextChar === ' ') indentCount++;
        else if (this.nextChar === '\t') indentCount += 4;
        this.getChar();
      }

      // blank line: laktawan lang at manatiling atLineStart
      if (this.nextChar === '\n' || this.nextChar === '\r') {
        if (this.nextChar === '\r' && this.peekChar() === '\n') {
          this.getChar();
        }
        this.getChar();
        this.atLineStart = true;
        continue;
      }

      // comment-only line: i-skip ang comment at manatiling atLineStart
      if (this.nextChar === '#' || (this.nextChar === '[' && this.peekChar() === '#')) {
        this.skipComment();
        if (this.nextChar === '\n' || this.nextChar === '\r') {
          if (this.nextChar === '\r' && this.peekChar() === '\n') {
            this.getChar();
          }
          this.getChar();
        }
        this.atLineStart = true;
        continue;
      }

      if (this.charClass === CharClasses.EOF) {
        this.atLineStart = false;
        break;
      }

      // may code token sa linyang ito: i-compare ang indent sa stack
      const topIndent = this.indentStack[this.indentStack.length - 1];
      if (indentCount > topIndent) {
        this.indentStack.push(indentCount);
        this.pendingTokens.push(createLexeme(Tokens.INDENT, 'INDENT', this.charLine, 1));
      } else if (indentCount < topIndent) {
        while (this.indentStack.length > 1 && this.indentStack[this.indentStack.length - 1] > indentCount) {
          this.indentStack.pop();
          this.pendingTokens.push(createLexeme(Tokens.DEDENT, 'DEDENT', this.charLine, 1));
        }
      }

      this.atLineStart = false;
      break;
    }
  }

  // laktawan ang non-significant whitespaces at comments sa pagitan ng mga tokens
  getNonBlank() {
    while (this.charClass !== CharClasses.EOF) {
      if (this.nextChar === ' ' || this.nextChar === '\t') {
        this.getChar();
      } else if (this.nextChar === '\n' || this.nextChar === '\r') {
        this.atLineStart = true;
        this.getChar();
        this.handleLineIndentation();
        if (this.pendingTokens.length > 0) {
          break;
        }
      } else if (this.nextChar === '#' || (this.nextChar === '[' && this.peekChar() === '#')) {
        this.skipComment();
      } else {
        break;
      }
    }
  }

  // sub-automaton para sa identifiers, keywords, datatypes, at noise words
  identifierAutomaton() {
    this.addChar();
    this.getChar();

    while (this.charClass === CharClasses.LETTER || this.charClass === CharClasses.DIGIT) {
      this.addChar();
      this.getChar();
    }

    const word = this.lexeme;
    let tokenType = Tokens.IDENTIFIER;
    let value = word;

    // O(1) keyword at noise word reduction lookup
    if (NOISE_WORDS[word]) {
      tokenType = Tokens.KEYWORD;
      value = NOISE_WORDS[word];
    } else if (KEYWORDS[word]) {
      tokenType = Tokens.KEYWORD;
    } else if (DATA_TYPES[word]) {
      tokenType = Tokens.DATA_TYPE;
    }

    return createLexeme(tokenType, value, this.tokenStartLine, this.tokenStartCol);
  }

  // sub-automaton para sa numeric literals (integers, floats, at scientific notation)
  numberAutomaton() {
    this.addChar();
    this.getChar();

    while (this.charClass === CharClasses.DIGIT) {
      this.addChar();
      this.getChar();
    }

    let isFloat = false;

    // Fractional part: Trailing dot check
    if (this.nextChar === '.') {
      const charAfterDot = this.peekChar();
      if (charAfterDot >= '0' && charAfterDot <= '9') {
        isFloat = true;
        this.addChar(); // consume '.'
        this.getChar();
        while (this.charClass === CharClasses.DIGIT) {
          this.addChar();
          this.getChar();
        }
      } else {
        // Dot na hindi sinundan ng digit (e.g. 10.weight):
        // Wag i-consume ang '.' para ma-evaluate ito bilang DELIMITER sa susunod na tawag
        return createLexeme(Tokens.INTEGER_LIT, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }
    }

    // Scientific notation: e o E na may optional + o - at kahit isang digit (e.g. 1e-5, 2.5e3, 10E+2)
    if (this.nextChar === 'e' || this.nextChar === 'E') {
      let nextC = this.peekChar(0);
      if (nextC === '+' || nextC === '-') {
        nextC = this.peekChar(1);
      }

      if (nextC >= '0' && nextC <= '9') {
        // Valid scientific notation exponent
        isFloat = true;
        this.addChar(); // consume 'e' o 'E'
        this.getChar();

        if (this.nextChar === '+' || this.nextChar === '-') {
          this.addChar(); // consume sign
          this.getChar();
        }

        while (this.charClass === CharClasses.DIGIT) {
          this.addChar();
          this.getChar();
        }
      }
      // Kung hindi sinusundan ng sign/digit (e.g. 10emit), wag galawin ang 'e'
    }

    return createLexeme(
      isFloat ? Tokens.FLOAT_LIT : Tokens.INTEGER_LIT,
      this.lexeme,
      this.tokenStartLine,
      this.tokenStartCol
    );
  }

  // sub-automaton para sa string at char literals na may escape sequences at triple-quote support
  stringAutomaton() {
    const quoteChar = this.nextChar;
    const isSingleQuote = quoteChar === "'";

    // Check para sa triple quotes: """ o '''
    const isTriple =
      this.peekChar(0) === quoteChar && this.peekChar(1) === quoteChar;

    let isClosed = false;

    if (isTriple) {
      // Consume 3 opening quotes
      this.addChar(); this.getChar();
      this.addChar(); this.getChar();
      this.addChar(); this.getChar();

      while (this.charClass !== CharClasses.EOF) {
        if (this.nextChar === '\\') {
          // Escape sequence sa loob ng triple quotes
          this.addChar();
          this.getChar();
          if (this.charClass !== CharClasses.EOF) {
            this.addChar();
            this.getChar();
          }
        } else if (
          this.nextChar === quoteChar &&
          this.peekChar(0) === quoteChar &&
          this.peekChar(1) === quoteChar
        ) {
          // Natagpuan ang 3 closing quotes
          this.addChar(); this.getChar();
          this.addChar(); this.getChar();
          this.addChar(); this.getChar();
          isClosed = true;
          break;
        } else {
          // Maaaring tumawid sa newlines ang triple quotes
          this.addChar();
          this.getChar();
        }
      }
    } else {
      // Standard single-line string ("...") o char literal ('...')
      this.addChar();
      this.getChar();

      while (this.charClass !== CharClasses.EOF) {
        if (this.nextChar === '\\') {
          this.addChar();
          this.getChar();
          if (this.charClass !== CharClasses.EOF) {
            this.addChar();
            this.getChar();
          }
        } else if (this.nextChar === quoteChar) {
          this.addChar();
          this.getChar();
          isClosed = true;
          break;
        } else if (this.nextChar === '\n' || this.nextChar === '\r') {
          // Error kapag may raw unescaped newline sa loob ng single-line literal
          break;
        } else {
          this.addChar();
          this.getChar();
        }
      }
    }

    if (!isClosed) {
      return createLexeme(Tokens.ERROR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
    }

    return createLexeme(
      Tokens.STRING_LIT,
      this.lexeme,
      this.tokenStartLine,
      this.tokenStartCol
    );
  }

  // sub-automaton para sa operators at delimiters gamit ang deterministic lookahead
  lookup(ch) {
    switch (ch) {
      // arithmetic at compound operators
      case '+': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '+') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.ASSIGN_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      case '-': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '-') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.ASSIGN_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      case '*': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '*') {
          this.addChar();
          this.getChar();
          if (this.nextChar === '=') {
            this.addChar();
            this.getChar();
            return createLexeme(Tokens.ASSIGN_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
          }
          return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.ASSIGN_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      case '/': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '/') {
          this.addChar();
          this.getChar();
          if (this.nextChar === '=') {
            this.addChar();
            this.getChar();
            return createLexeme(Tokens.ASSIGN_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
          }
          return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.ASSIGN_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      case '%': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.ASSIGN_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      case '=': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.RELATIONAL_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        if (this.nextChar === '>') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.LINK_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.ASSIGN_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      case '<': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          if (this.nextChar === '>') {
            this.addChar();
            this.getChar();
            return createLexeme(Tokens.LINK_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
          }
          return createLexeme(Tokens.RELATIONAL_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.RELATIONAL_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      case '>': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.RELATIONAL_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.RELATIONAL_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      case '!': {
        this.addChar();
        this.getChar();
        if (this.nextChar === '=') {
          this.addChar();
          this.getChar();
          return createLexeme(Tokens.RELATIONAL_OP, this.lexeme, this.tokenStartLine, this.tokenStartCol);
        }
        return createLexeme(Tokens.OPERATOR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      // standard delimiters
      case '[':
        if (this.peekChar() === '#') {
          this.skipComment();
          return this.lex();
        }
        // falls through sa unified delimiter block
      case '(':
      case ')':
      case '{':
      case '}':
      case ']':
      case ',':
      case ':':
      case ';':
      case '.':
      case '@': {
        this.addChar();
        this.getChar();
        return createLexeme(Tokens.DELIMITER, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }

      default: {
        this.addChar();
        this.getChar();
        return createLexeme(Tokens.ERROR, this.lexeme, this.tokenStartLine, this.tokenStartCol);
      }
    }
  }

  // main lex() routine mula sa Robert Sebesta Chapter 4
  lex() {
    // kung may nakapilang INDENT o DEDENT tokens, ilabas muna ang mga ito
    if (this.pendingTokens.length > 0) {
      return this.pendingTokens.shift();
    }

    if (this.atLineStart) {
      this.handleLineIndentation();
      if (this.pendingTokens.length > 0) {
        return this.pendingTokens.shift();
      }
    }

    this.getNonBlank();

    if (this.pendingTokens.length > 0) {
      return this.pendingTokens.shift();
    }

    // EOF handling: i-flush ang anumang unclosed indentation levels
    if (this.charClass === CharClasses.EOF) {
      if (this.indentStack.length > 1) {
        this.indentStack.pop();
        return createLexeme(Tokens.DEDENT, 'DEDENT', this.currentLine, 1);
      }
      return null;
    }

    this.lexeme = '';
    this.tokenStartLine = this.charLine;
    this.tokenStartCol = this.charCol;

    // Dispatch sa nararapat na sub-automaton base sa Sebesta character class
    switch (this.charClass) {
      case CharClasses.LETTER:
        return this.identifierAutomaton();

      case CharClasses.DIGIT:
        return this.numberAutomaton();

      case CharClasses.QUOTE:
        return this.stringAutomaton();

      case CharClasses.OPERATOR:
      case CharClasses.DELIMITER:
        return this.lookup(this.nextChar);

      case CharClasses.UNKNOWN:
      default:
        return this.lookup(this.nextChar);
    }
  }
}

// main analyze() driver function
export function analyze(statement) {
  if (!statement || statement.length === 0) {
    return [];
  }

  const lexer = new LexicalAnalyzer(statement);
  const lexemes = [];
  let token = lexer.lex();

  while (token !== null) {
    lexemes.push(token);
    token = lexer.lex();
  }

  return lexemes;
}

export default analyze;
