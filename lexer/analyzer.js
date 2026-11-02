import {
  Tokens,
  KEYWORDS,
  DATA_TYPES,
  NOISE_WORDS,
  createLexeme,
} from './tokens.js';

import {
  transitionTable,
  getTableColumn,
  Q0, Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12,
  Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q19b, Q20, Q21,
  Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29,
  Q30, Q31, Q32, Q34, Q35, Q36, Q36_TERM,
  Q37, Q38, Q39, Q40, Q41, Q42, Q43, Q44, Q45, Q46,
  Q47, Q48, Q49, Q50, Q51, Q52, Q53, Q54,
  Q55, Q56, Q57, Q58, Q59, Q60, Q61, Q62, Q63, Q64, Q65,
  Q66, Q67, Q68, Q69,
  Q70, Q71, Q72, Q73, Q74, Q75,
  Q76, Q77, Q78, Q79,
  Q80, Q81, Q82,
  Q83, Q84, Q85, Q86,
  Q87, Q88, Q89, Q90, Q91, Q90b, Q91b,
  Q94, Q94b, Q97, Q97b, Q99, Q102, Q102b, Q103, Q104, Q106, Q107,
  Q108, Q109, Q110, Q111, Q112,
  ACC_IDENTIFIER,
  ACC_DIM,
  ACC_SNAP,
  ACC_BIND,
  ACC_WHEN,
  ACC_KEYWORD,
  ACC_INTEGER,
  ACC_FLOAT,
  ACC_STRING,
  ACC_CHAR,
  ACC_OPERATOR,
  ACC_ASSIGN,
  ACC_EXP,
  ACC_FLOOR_DIV,
  ACC_INC_DEC,
  ACC_RELATIONAL,
  ACC_LINK,
  ACC_DELIMITER,
  DISCARD_COMMENT,
  ERR,
} from './transitionTable.js';

// icheck kung noise word, keyword, datatype, o ordinary identifier
function classifyWord(word) {
  if (NOISE_WORDS[word]) {
    return createLexeme(Tokens.KEYWORD, NOISE_WORDS[word]);
  }
  if (KEYWORDS[word]) {
    return createLexeme(Tokens.KEYWORD, word);
  }
  if (DATA_TYPES[word]) {
    return createLexeme(Tokens.DATA_TYPE, word);
  }
  return createLexeme(Tokens.IDENTIFIER, word);
}

// main lexer: nag-iiscan ng source code gamit DFA transition table
export function analyze(statement) {
  const lexemes = [];
  if (!statement || statement.length === 0) {
    return lexemes;
  }

  // mag-append ng newline para mag-reduce nang maayos yung huling token sa EOF
  let input = statement;
  const lastChar = input.charAt(input.length - 1);
  if (lastChar !== '\n') {
    input += '\n';
  }

  let currentState = Q0;
  let buffer = '';
  let index = 0;
  const length = input.length;

  while (index < length) {
    const ch = input.charAt(index);
    const column = getTableColumn(ch);
    const nextState = transitionTable[currentState]
      ? transitionTable[currentState][column]
      : ERR;

    switch (nextState) {
      // whitespace lang, reset buffer
      case Q0: {
        buffer = '';
        index++;
        break;
      }

      // direct delimiter tokens
      case Q94b:
      case Q97:
      case Q97b:
      case Q99:
      case Q102:
      case Q102b:
      case Q103:
      case Q104:
      case Q106:
      case Q107: {
        lexemes.push(createLexeme(Tokens.DELIMITER, ch));
        buffer = '';
        currentState = Q0;
        index++;
        break;
      }

      // comment loop
      case Q87:
      case Q88:
      case Q89:
      case Q90:
      case Q91:
      case Q90b:
      case Q91b: {
        buffer += ch;
        currentState = nextState;
        index++;
        break;
      }

      // tapos na comment, discard buffer at wag mag-emit ng token
      case DISCARD_COMMENT: {
        buffer = '';
        currentState = Q0;
        index++;
        break;
      }

      // scanning states, ipon lang ng char sa buffer
      case Q1:
      case Q2:
      case Q3:
      case Q4:
      case Q5:
      case Q6:
      case Q7:
      case Q8:
      case Q9:
      case Q10:
      case Q11:
      case Q12:
      case Q13:
      case Q14:
      case Q15:
      case Q16:
      case Q17:
      case Q18:
      case Q19:
      case Q19b:
      case Q20:
      case Q21:
      case Q22:
      case Q23:
      case Q24:
      case Q25:
      case Q26:
      case Q27:
      case Q28:
      case Q29:
      case Q30:
      case Q31:
      case Q32:
      case Q34:
      case Q35:
      case Q36:
      case Q36_TERM:
      case Q37:
      case Q38:
      case Q39:
      case Q40:
      case Q41:
      case Q42:
      case Q43:
      case Q44:
      case Q45:
      case Q46:
      case Q47:
      case Q48:
      case Q49:
      case Q50:
      case Q51:
      case Q52:
      case Q53:
      case Q54:
      case Q55:
      case Q56:
      case Q57:
      case Q58:
      case Q59:
      case Q60:
      case Q61:
      case Q62:
      case Q63:
      case Q64:
      case Q65:
      case Q66:
      case Q67:
      case Q68:
      case Q69:
      case Q70:
      case Q71:
      case Q72:
      case Q73:
      case Q74:
      case Q75:
      case Q76:
      case Q77:
      case Q78:
      case Q79:
      case Q80:
      case Q81:
      case Q82:
      case Q83:
      case Q84:
      case Q85:
      case Q86:
      case Q94:
      case Q108:
      case Q109:
      case Q110:
      case Q111:
      case Q112: {
        buffer += ch;
        currentState = nextState;
        index++;
        break;
      }

      // reduce actions / emit tokens
      case ACC_IDENTIFIER: {
        const lexeme = classifyWord(buffer);
        lexemes.push(lexeme);
        buffer = '';
        currentState = Q0;
        // wag i-advance index para ma-process ulit yung current char sa Q0
        break;
      }

      case ACC_DIM: {
        lexemes.push(createLexeme(Tokens.KEYWORD, 'dim'));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_SNAP: {
        lexemes.push(createLexeme(Tokens.KEYWORD, 'snap'));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_BIND: {
        lexemes.push(createLexeme(Tokens.KEYWORD, 'bind'));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_WHEN: {
        lexemes.push(createLexeme(Tokens.KEYWORD, 'when'));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_KEYWORD: {
        lexemes.push(createLexeme(Tokens.KEYWORD, buffer));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_INTEGER: {
        lexemes.push(createLexeme(Tokens.INTEGER_LIT, buffer));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_FLOAT: {
        lexemes.push(createLexeme(Tokens.FLOAT_LIT, buffer));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_STRING: {
        buffer += ch;
        lexemes.push(createLexeme(Tokens.STRING_LIT, buffer));
        buffer = '';
        currentState = Q0;
        index++;
        break;
      }

      case ACC_CHAR: {
        buffer += ch;
        lexemes.push(createLexeme(Tokens.CHAR_LIT, buffer));
        buffer = '';
        currentState = Q0;
        index++;
        break;
      }

      case ACC_OPERATOR:
      case ACC_EXP:
      case ACC_FLOOR_DIV:
      case ACC_INC_DEC: {
        lexemes.push(createLexeme(Tokens.OPERATOR, buffer));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_ASSIGN: {
        lexemes.push(createLexeme(Tokens.ASSIGN_OP, buffer));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_RELATIONAL: {
        lexemes.push(createLexeme(Tokens.RELATIONAL_OP, buffer));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_LINK: {
        lexemes.push(createLexeme(Tokens.LINK_OP, buffer));
        buffer = '';
        currentState = Q0;
        break;
      }

      case ACC_DELIMITER: {
        lexemes.push(createLexeme(Tokens.DELIMITER, buffer));
        buffer = '';
        currentState = Q0;
        break;
      }

      // error handling pag unexpected char
      case ERR:
      default: {
        if (buffer.length > 0) {
          lexemes.push(createLexeme(Tokens.ERROR, buffer));
          buffer = '';
        }
        if (ch !== ' ' && ch !== '\t' && ch !== '\n' && ch !== '\r') {
          lexemes.push(createLexeme(Tokens.ERROR, ch));
        }
        currentState = Q0;
        index++;
        break;
      }
    }
  }

  return lexemes;
}

export default analyze;
