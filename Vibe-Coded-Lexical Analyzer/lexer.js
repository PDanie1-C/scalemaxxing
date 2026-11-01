
const Lexer = (() => {

  // Mga Keywords or Reserved Words natin to
  const KEYWORDS = new Map([
    ["if", "keyword"], ["else", "keyword"], ["while", "keyword"],
    ["for", "keyword"], ["return", "keyword"], ["void", "keyword"],
    ["print", "keyword"], ["int", "datatype"], ["float", "datatype"], 
    ["string", "datatype"], ["bool", "datatype"], ["true", "bool_value"], 
    ["false", "bool_value"], ["not", "not_keyword"], ["or", "or_keyword"], 
    ["and", "and_keyword"], ["dim", "keyword"], ["dimension", "keyword"], 
    ["unit", "keyword"], ["pure", "keyword"], ["weight", "keyword"], 
    ["bind", "reserved"], ["binding", "reserved"], ["whenever", "reserved"],
    ["flow", "reserved"], ["when", "reserved"], ["snap", "reserved"], 
    ["snapshot", "reserved"], ["halt", "reserved"], ["emit", "reserved"]
  ]);

  // Mga Operators natin to
  const OPERATORS = new Map([
    ["+", "add_op"], ["-", "sub_op"], ["/", "div_op"], ["*", "mul_op"],
    ["%", "mod_op"], ["=", "asgn_op"], [">", "grtr_op"], ["<", "less_op"],
    ["+=", "add_asgn"], ["-=", "sub_asgn"], ["*=", "mul_asgn"],
    ["/=", "div_asgn"], ["%=", "mod_asgn"], ["**=", "exp_asgn"],
    ["//=", "flr_asgn"], ["**", "exp_op"], ["//", "flr_op"],
    ["++", "inc_op"], ["--", "dec_op"], ["==", "eql_op"], ["!=", "neql_op"],
    ["!", "not_op"], [">=", "grtr_eql"], ["<=", "less_eql"],
    ["<=>", "bi_op"], ["=>", "flw_op"],
  ]);
  const MAX_OPERATOR_LENGTH = 3;

  // Mga Delimiters natin
  const DELIMITERS = new Map([
    [";", "semi_colon"], [",", "comma"], [":", "colon"], [".", "period"], ["@", "at_sign"],
    ["[", "op_sqr"], ["]", "cls_sqr"],
    ["{", "op_brs"], ["}", "cls_brs"],
    ["(", "op_par"], [")", "cls_par"],
  ]);


  const STATE = {
    START: 0,
    STRING: 1,
    CHAR: 2,
    INTEGER: 3,
    FLOAT: 4,
    IDENTIFIER: 5,
    INVALID: 10,
  };

// more broad na mga type ng tokens
// hindi kasama ung mga keywords dahil may specified pa sila
  const STATE_TO_TYPE = {
    [STATE.STRING]: "string_lit",
    [STATE.CHAR]: "char_lit",
    [STATE.INTEGER]: "int_lit",
    [STATE.FLOAT]: "flt_lit",
    [STATE.IDENTIFIER]: "identifier",
    [STATE.INVALID]: "invalid",
  };


// Ito ung nagdedecide kung anong color ng text ng token
  const STATE_TO_KIND = {
    [STATE.STRING]: "literal",
    [STATE.CHAR]: "literal",
    [STATE.INTEGER]: "literal",
    [STATE.FLOAT]: "literal",
    [STATE.IDENTIFIER]: "identifier",
  };

  // pangcheck ng mga characters na accepted, seperate pa ung sa mga delimiters and operators
  const isWhitespace = (ch) => /\s/.test(ch);
  const isDigit = (ch) => /[0-9]/.test(ch);
  const isLetterOrUnderscore = (ch) => /\p{L}/u.test(ch) || ch === "_";

  // kung ano ung category ng token base kung anong state
  function classify(token, state) {
    if (KEYWORDS.has(token)) {
      return { token, type: KEYWORDS.get(token), kind: "keyword" };
    }
    if (OPERATORS.has(token)) {
      return { token, type: OPERATORS.get(token), kind: "operator" };
    }
    if (token.length > 0 && DELIMITERS.has(token[0])) {
      return { token, type: DELIMITERS.get(token[0]), kind: "punctuation" };
    }
    return {
      token,
      type: STATE_TO_TYPE[state] || "",
      kind: STATE_TO_KIND[state] || "invalid",
    };
  }

  // chineck kung gaano kahaba ung operator once na may nakitang isang operator
  function longestOperatorAt(line, index) {
    const longest = Math.min(MAX_OPERATOR_LENGTH, line.length - index);
    for (let length = longest; length >= 1; length--) {
      if (OPERATORS.has(line.substr(index, length))) return length;
    }
    return 1;
  }


  // Ito na talaga ung scanner
  function tokenizeLine(line) {
    const tokens = [];
    const length = line.length;

    let index = 0;            // current index
    let tokenStart = 0;       // anong start index ng current token
    let state = STATE.START;  // kung anong current categorization ng token
    let quotedLength = 0;     // kung gaano kahaba ung string or ch

    // mga kailangan for different type of checking
    let inString = false;
    let inChar = false;
    let isIdentifier = false;
    let isInteger = false;
    let isFloat = false;
    let isInvalid = false;
    let justSawDot = false;

    const hasPendingToken = () => isIdentifier || isInteger || isFloat || isInvalid;

    // Result ng classification of tokens and lexemes
    const emitToken = (end) => {
      tokens.push(classify(line.substring(tokenStart, end), state));
    };

     // Reset dahil ibang type of token na ung binabasa
    const clearFlags = () => {
      inString = inChar = false;
      isIdentifier = isInteger = isFloat = isInvalid = false;
      justSawDot = false;
    };

    // Ibig sabihin nito ay bago ng token ung binabasa
    const resetAfterCurrentChar = () => {
      index++;
      tokenStart = index;
      quotedLength = 0;
      state = STATE.START;
      clearFlags();
    };

    while (index < length) {
      const ch = line[index];

      // Whitespace
      if (isWhitespace(ch) && !inChar && !inString) {
        if (hasPendingToken()) emitToken(index);
        resetAfterCurrentChar();
        continue;
      }

      // Operator
      if (OPERATORS.has(ch) && !inString && !inChar) {
        if (hasPendingToken()) emitToken(index);

        const operatorLength = longestOperatorAt(line, index);
        tokenStart = index;
        emitToken(index + operatorLength);

        index += operatorLength - 1;
        resetAfterCurrentChar();      
        continue;
      }


      // Dahil delimiter ung period, kailangan muna icheck ung current token
      // para malaman kung magiging float if integer or normal na delimiter siya
      if(ch === "."){
        if (isFloat) {
          isInvalid = true;
          state = STATE.INVALID;
          index++;
          continue;
        }

        if (isInteger && !isInvalid && index + 1 < length && isDigit(line[index + 1])) {
          isInteger = false;
          isFloat = true;
          state = STATE.FLOAT;
          index++;
          continue;
        }
      }

      // Delimiter
      if (DELIMITERS.has(ch) && !inString && !inChar) {
        if (hasPendingToken()) emitToken(index);

        tokenStart = index;
        emitToken(index + 1);
        resetAfterCurrentChar();
        continue;
      }

      // Double quote
      if (ch === '"' && !inChar) {
        if (hasPendingToken()) {
          emitToken(index);
          clearFlags();
        }

        // Start ng quote Ex. "
        // Invalid kasi dapat na-close ung string Ex. "Orange"
        if (!inString) {
          tokenStart = index;
          inString = true;
          state = STATE.INVALID;
          index++;
          continue;
        }

        // Close na ung string Ex. "Banana"
        inString = false;
        state = STATE.STRING;
        emitToken(index + 1);
        index++;
        tokenStart = index;
        quotedLength = 0;
        continue;
      }

      // Single quote
      
      if (ch === "'" && !inString) {
        if (hasPendingToken()) {
          emitToken(index);
          clearFlags();
        }


        // ibig sabin ito ung start ng quote Ex. '
        if (!inChar) {
          
          tokenStart = index;
          inChar = true;
          state = STATE.INVALID;
          index++;
          continue;
        }

        // Chineck ung lenght ng ch dapat === 1 lng lagi
        // Close na ung ch Ex. ' '
        inChar = false;
        state = quotedLength === 1 ? STATE.CHAR : STATE.INVALID;
        emitToken(index + 1);
        index++;
        tokenStart = index;
        quotedLength = 0;
        continue;
      }

      // hindi pa close ung string or character Ex. "Apple
      if (inChar || inString) {
        if (ch === "\\" && index + 1 < length) index++;  // skip escaped char
        quotedLength++;
        index++;
        continue;
      }

      // Digit
      if (isDigit(ch)) {
        if (!hasPendingToken()) {
          isInteger = true;
          state = STATE.INTEGER;
        }
        index++;
        continue;
      }

     

      // Letter o underscore
      if (isLetterOrUnderscore(ch)) {
        if (isInteger || isFloat) {
          isInvalid = true;               // e.g. "123abc"
          state = STATE.INVALID;
        }
        if (!isIdentifier && !isInvalid) {
          isIdentifier = true;
          state = STATE.IDENTIFIER;
        }
        index++;
        continue;
      }

      // any other characters na hindi kasama sa valid na alphabet
      if (hasPendingToken()) emitToken(index);
      tokenStart = index;
      state = STATE.INVALID;
      emitToken(index + 1);
      resetAfterCurrentChar();
    }

    // i-print kung may natira pang token na hindi pa nababasa pero na encounter na \n
    if (hasPendingToken() || inString || inChar) {
      emitToken(index);
    }

    return tokens;
  }


  // ito ung seseperate sa buong text para ung pag analyze is line-by-line
  function tokenizeText(text) {
    return text
      .split(/\r?\n/)
      .map((source, i) => ({
        lineNumber: i + 1,
        source,
        tokens: tokenizeLine(source),
      }))
      .filter((row) => row.tokens.length > 0);
  }

  // ito ung results kung gusto makita ung simplified results
  function formatPlainText(rows) {
    return rows
      .map((row) =>
        row.tokens
          .map((t) => t.token.padEnd(20) + ":" + t.type.padStart(20))
          .join("\n") + "\n"
      )
      .join("\n");
  }

  return { tokenizeLine, tokenizeText, formatPlainText };
})();
