// DFA states (Q0 to Q107) based ko lang from the proposal - joan
export const Q0 = 'Q0';        // start state
export const Q1 = 'Q1';        // identifiers
export const Q2 = 'Q2';        // +, -, % base
export const Q3 = 'Q3';        // compound assignment (=, +=, -=, etc.)
export const Q4 = 'Q4';        // *
export const Q5 = 'Q5';        // **
export const Q6 = 'Q6';        // /
export const Q7 = 'Q7';        // //
export const Q8 = 'Q8';        // multiplication *
export const Q9 = 'Q9';        // exponent **
export const Q10 = 'Q10';       // arithmetic ops
export const Q11 = 'Q11';       // division /
export const Q12 = 'Q12';       // floor div //
export const Q13 = 'Q13';       // unary plus / increment
export const Q14 = 'Q14';       // ++ at --
export const Q15 = 'Q15';       // unary minus / decrement
export const Q16 = 'Q16';       // < at >
export const Q17 = 'Q17';       // !
export const Q18 = 'Q18';       // relational (==, !=, <=, >=)
export const Q19 = 'Q19';       // =
export const Q19b = 'Q19b';      // <= intermediate
export const Q20 = 'Q20';       // => at <=>
export const Q21 = 'Q21';       // <

// keyword states
export const Q22 = 'Q22';       // 'a'
export const Q23 = 'Q23';       // 'an'
export const Q24 = 'Q24';       // 'and'
export const Q25 = 'Q25';       // 'n'
export const Q26 = 'Q26';       // 'no'
export const Q27 = 'Q27';       // 'not'
export const Q28 = 'Q28';       // 'o'
export const Q29 = 'Q29';       // 'or'
export const Q30 = 'Q30';       // 'd'
export const Q31 = 'Q31';       // 'di'
export const Q32 = 'Q32';       // 'dim'
export const Q34 = 'Q34';       // 'u'
export const Q35 = 'Q35';       // 'un'
export const Q36 = 'Q36';       // 'uni'
export const Q36_TERM = 'Q36_TERM';  // 'unit'
export const Q37 = 'Q37';       // 'p'
export const Q38 = 'Q38';       // 'pu'
export const Q39 = 'Q39';       // 'pur'
export const Q40 = 'Q40';       // 'pure'
export const Q41 = 'Q41';       // 'w'
export const Q42 = 'Q42';       // 'we'
export const Q43 = 'Q43';       // 'wei'
export const Q44 = 'Q44';       // 'weig'
export const Q45 = 'Q45';       // 'weigh'
export const Q46 = 'Q46';       // 'weight'
export const Q47 = 'Q47';       // 'b'
export const Q48 = 'Q48';       // 'bi'
export const Q49 = 'Q49';       // 'bin'
export const Q50 = 'Q50';       // 'bind'
export const Q51 = 'Q51';       // 'f'
export const Q52 = 'Q52';       // 'fl'
export const Q53 = 'Q53';       // 'flo'
export const Q54 = 'Q54';       // 'flow'
export const Q55 = 'Q55';       // 'wh'
export const Q56 = 'Q56';       // 'whe'
export const Q57 = 'Q57';       // 'when'
export const Q58 = 'Q58';       // 's'
export const Q59 = 'Q59';       // 'sn'
export const Q60 = 'Q60';       // 'sna'
export const Q61 = 'Q61';       // 'snap'
export const Q62 = 'Q62';       // 'h'
export const Q63 = 'Q63';       // 'ha'
export const Q64 = 'Q64';       // 'hal'
export const Q65 = 'Q65';       // 'halt'
export const Q66 = 'Q66';       // 'e'
export const Q67 = 'Q67';       // 'em'
export const Q68 = 'Q68';       // 'emi'
export const Q69 = 'Q69';       // 'emit'

// noise words reduction states
export const Q70 = 'Q70';       // 'dime'
export const Q71 = 'Q71';       // 'dimen'
export const Q72 = 'Q72';       // 'dimens'
export const Q73 = 'Q73';       // 'dimensi'
export const Q74 = 'Q74';       // 'dimensio'
export const Q75 = 'Q75';       // 'dimension' -> emit as dim
export const Q76 = 'Q76';       // 'snaps'
export const Q77 = 'Q77';       // 'snapsh'
export const Q78 = 'Q78';       // 'snapsho'
export const Q79 = 'Q79';       // 'snapshot' -> emit as snap
export const Q80 = 'Q80';       // 'bindi'
export const Q81 = 'Q81';       // 'bindin'
export const Q82 = 'Q82';       // 'binding' -> emit as bind
export const Q83 = 'Q83';       // 'whene'
export const Q84 = 'Q84';       // 'whenev'
export const Q85 = 'Q85';       // 'wheneve'
export const Q86 = 'Q86';       // 'whenever' -> emit as when

// comment states
export const Q87 = 'Q87';       // '#'
export const Q88 = 'Q88';       // single-line loop
export const Q89 = 'Q89';       // '#*' multi-line start
export const Q90 = 'Q90';       // multi-line loop
export const Q91 = 'Q91';       // '*' inside multi-line
export const Q90b = 'Q90b';      // '[#' multi-line loop
export const Q91b = 'Q91b';      // '#' inside '[#'

// delimiters
export const Q94 = 'Q94';       // '['
export const Q94b = 'Q94b';      // ']'
export const Q97 = 'Q97';       // '('
export const Q97b = 'Q97b';      // ')'
export const Q99 = 'Q99';       // ','
export const Q102 = 'Q102';      // '{'
export const Q102b = 'Q102b';     // '}'
export const Q103 = 'Q103';      // ':'
export const Q104 = 'Q104';      // '.'
export const Q106 = 'Q106';      // '@'
export const Q107 = 'Q107';      // ';'

// literal states
export const Q108 = 'Q108';      // integer
export const Q109 = 'Q109';      // dot after int
export const Q110 = 'Q110';      // float
export const Q111 = 'Q111';      // string
export const Q111_ESC = 'Q111_ESC';
export const Q112 = 'Q112';      // char
export const Q112_ESC = 'Q112_ESC';

// accepting / reduce states para sa switch
export const ACC_IDENTIFIER = 'ACC_IDENTIFIER';
export const ACC_DIM = 'ACC_DIM';
export const ACC_SNAP = 'ACC_SNAP';
export const ACC_BIND = 'ACC_BIND';
export const ACC_WHEN = 'ACC_WHEN';
export const ACC_KEYWORD = 'ACC_KEYWORD';
export const ACC_INTEGER = 'ACC_INTEGER';
export const ACC_FLOAT = 'ACC_FLOAT';
export const ACC_STRING = 'ACC_STRING';
export const ACC_CHAR = 'ACC_CHAR';
export const ACC_OPERATOR = 'ACC_OPERATOR';
export const ACC_ASSIGN = 'ACC_ASSIGN';
export const ACC_EXP = 'ACC_EXP';
export const ACC_FLOOR_DIV = 'ACC_FLOOR_DIV';
export const ACC_INC_DEC = 'ACC_INC_DEC';
export const ACC_RELATIONAL = 'ACC_RELATIONAL';
export const ACC_LINK = 'ACC_LINK';
export const ACC_DELIMITER = 'ACC_DELIMITER';
export const DISCARD_COMMENT = 'DISCARD_COMMENT';
export const ERR = 'ERR';

// kunin column index base sa char (0 hanggang 47)
export function getTableColumn(ch) {
  switch (ch) {
    case 'a': return 0;
    case 'b': return 1;
    case 'd': return 2;
    case 'e': return 3;
    case 'f': return 4;
    case 'g': return 5;
    case 'h': return 6;
    case 'i': return 7;
    case 'l': return 8;
    case 'm': return 9;
    case 'n': return 10;
    case 'o': return 11;
    case 'p': return 12;
    case 'r': return 13;
    case 's': return 14;
    case 't': return 15;
    case 'u': return 16;
    case 'v': return 17;
    case 'w': return 18;
    case '_': return 20;
    case '+': return 22;
    case '-': return 23;
    case '*': return 24;
    case '/': return 25;
    case '%': return 26;
    case '=': return 27;
    case '<': return 28;
    case '>': return 29;
    case '!': return 30;
    case '[': return 31;
    case ']': return 32;
    case '(': return 33;
    case ')': return 34;
    case ',': return 35;
    case '{': return 36;
    case '}': return 37;
    case ':': return 38;
    case '.': return 39;
    case '@': return 40;
    case ';': return 41;
    case '"': return 42;
    case "'": return 43;
    case '#': return 44;
    case ' ': case '\t': return 45;
    case '\n': case '\r': return 46;
    default:
      if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) return 19;
      if (ch >= '0' && ch <= '9') return 21;
      return 47;
  }
}

function makeRow(defaultVal) {
  const row = new Array(48);
  for (let i = 0; i < 48; i++) {
    row[i] = defaultVal;
  }
  return row;
}

// 2D transition table
export const transitionTable = {};

// Q0 start state setup
const q0 = makeRow(ERR);
q0[0] = Q22;
q0[1] = Q47;
q0[2] = Q30;
q0[3] = Q66;
q0[4] = Q51;
q0[5] = Q1;
q0[6] = Q62;
q0[7] = Q1;
q0[8] = Q1;
q0[9] = Q1;
q0[10] = Q25;
q0[11] = Q28;
q0[12] = Q37;
q0[13] = Q1;
q0[14] = Q58;
q0[15] = Q1;
q0[16] = Q34;
q0[17] = Q1;
q0[18] = Q41;
q0[19] = Q1;
q0[20] = Q1;
q0[21] = Q108;
q0[22] = Q13;
q0[23] = Q15;
q0[24] = Q4;
q0[25] = Q6;
q0[26] = Q2;
q0[27] = Q19;
q0[28] = Q21;
q0[29] = Q16;
q0[30] = Q17;
q0[31] = Q94;
q0[32] = Q94b;
q0[33] = Q97;
q0[34] = Q97b;
q0[35] = Q99;
q0[36] = Q102;
q0[37] = Q102b;
q0[38] = Q103;
q0[39] = Q104;
q0[40] = Q106;
q0[41] = Q107;
q0[42] = Q111;
q0[43] = Q112;
q0[44] = Q87;
q0[45] = Q0;
q0[46] = Q0;
transitionTable[Q0] = q0;

// Q1 identifier loop
const q1 = makeRow(ACC_IDENTIFIER);
for (let c = 0; c <= 21; c++) q1[c] = Q1;
transitionTable[Q1] = q1;

// transitions para sa keywords at identifiers
function setupWordState(state, matchCol, nextMatchState, acceptFallback = ACC_IDENTIFIER) {
  const row = makeRow(acceptFallback);
  for (let c = 0; c <= 21; c++) {
    row[c] = Q1;
  }
  if (matchCol !== null && nextMatchState !== null) {
    row[matchCol] = nextMatchState;
  }
  transitionTable[state] = row;
}

// and
setupWordState(Q22, 10, Q23);
setupWordState(Q23, 2, Q24);
setupWordState(Q24, null, null, ACC_KEYWORD);

// not
setupWordState(Q25, 11, Q26);
setupWordState(Q26, 15, Q27);
setupWordState(Q27, null, null, ACC_KEYWORD);

// or
setupWordState(Q28, 13, Q29);
setupWordState(Q29, null, null, ACC_KEYWORD);

// dim at dimension
setupWordState(Q30, 7, Q31);
setupWordState(Q31, 9, Q32);
setupWordState(Q32, 3, Q70, ACC_DIM);

// unit
setupWordState(Q34, 10, Q35);
setupWordState(Q35, 7, Q36);
setupWordState(Q36, 15, Q36_TERM);
setupWordState(Q36_TERM, null, null, ACC_KEYWORD);

// pure
setupWordState(Q37, 16, Q38);
setupWordState(Q38, 13, Q39);
setupWordState(Q39, 3, Q40);
setupWordState(Q40, null, null, ACC_KEYWORD);

// weight at when
const q41 = makeRow(ACC_IDENTIFIER);
for (let c = 0; c <= 21; c++) q41[c] = Q1;
q41[3] = Q42;
q41[6] = Q55;
transitionTable[Q41] = q41;

// weight
setupWordState(Q42, 7, Q43);
setupWordState(Q43, 5, Q44);
setupWordState(Q44, 6, Q45);
setupWordState(Q45, 15, Q46);
setupWordState(Q46, null, null, ACC_KEYWORD);

// when at whenever
setupWordState(Q55, 3, Q56);
setupWordState(Q56, 10, Q57);
setupWordState(Q57, 3, Q83, ACC_WHEN);

// bind at binding
setupWordState(Q47, 7, Q48);
setupWordState(Q48, 10, Q49);
setupWordState(Q49, 2, Q50);
setupWordState(Q50, 7, Q80, ACC_BIND);

// flow
setupWordState(Q51, 8, Q52);
setupWordState(Q52, 11, Q53);
setupWordState(Q53, 18, Q54);
setupWordState(Q54, null, null, ACC_KEYWORD);

// snap at snapshot
setupWordState(Q58, 10, Q59);
setupWordState(Q59, 0, Q60);
setupWordState(Q60, 12, Q61);
setupWordState(Q61, 14, Q76, ACC_SNAP);

// halt
setupWordState(Q62, 0, Q63);
setupWordState(Q63, 8, Q64);
setupWordState(Q64, 15, Q65);
setupWordState(Q65, null, null, ACC_KEYWORD);

// emit
setupWordState(Q66, 9, Q67);
setupWordState(Q67, 7, Q68);
setupWordState(Q68, 15, Q69);
setupWordState(Q69, null, null, ACC_KEYWORD);

// noise words reduction states
setupWordState(Q70, 10, Q71);
setupWordState(Q71, 14, Q72);
setupWordState(Q72, 7, Q73);
setupWordState(Q73, 11, Q74);
setupWordState(Q74, 10, Q75);
setupWordState(Q75, null, null, ACC_DIM);

setupWordState(Q76, 6, Q77);
setupWordState(Q77, 11, Q78);
setupWordState(Q78, 15, Q79);
setupWordState(Q79, null, null, ACC_SNAP);

setupWordState(Q80, 10, Q81);
setupWordState(Q81, 5, Q82);
setupWordState(Q82, null, null, ACC_BIND);

setupWordState(Q83, 17, Q84);
setupWordState(Q84, 3, Q85);
setupWordState(Q85, 13, Q86);
setupWordState(Q86, null, null, ACC_WHEN);

// operators at compound assignments
const q2 = makeRow(ACC_OPERATOR);
q2[27] = Q3;
transitionTable[Q2] = q2;

const q3 = makeRow(ACC_ASSIGN);
transitionTable[Q3] = q3;

const q4 = makeRow(ACC_OPERATOR);
q4[24] = Q5;
q4[27] = Q3;
transitionTable[Q4] = q4;

const q5 = makeRow(ACC_EXP);
q5[27] = Q3;
transitionTable[Q5] = q5;

const q6 = makeRow(ACC_OPERATOR);
q6[25] = Q7;
q6[27] = Q3;
transitionTable[Q6] = q6;

const q7 = makeRow(ACC_FLOOR_DIV);
q7[27] = Q3;
transitionTable[Q7] = q7;

transitionTable[Q8] = makeRow(ACC_OPERATOR);
transitionTable[Q9] = makeRow(ACC_EXP);
transitionTable[Q10] = makeRow(ACC_OPERATOR);
transitionTable[Q11] = makeRow(ACC_OPERATOR);
transitionTable[Q12] = makeRow(ACC_FLOOR_DIV);

// increment at decrement
const q13 = makeRow(ACC_OPERATOR);
q13[22] = Q14;
q13[27] = Q3;
transitionTable[Q13] = q13;

transitionTable[Q14] = makeRow(ACC_INC_DEC);

const q15 = makeRow(ACC_OPERATOR);
q15[23] = Q14;
q15[27] = Q3;
transitionTable[Q15] = q15;

// relational at links
const q16 = makeRow(ACC_RELATIONAL);
q16[27] = Q18;
transitionTable[Q16] = q16;

const q17 = makeRow(ACC_OPERATOR);
q17[27] = Q18;
transitionTable[Q17] = q17;

transitionTable[Q18] = makeRow(ACC_RELATIONAL);

const q19 = makeRow(ACC_ASSIGN);
q19[29] = Q20;
q19[27] = Q18;
transitionTable[Q19] = q19;

const q21 = makeRow(ACC_RELATIONAL);
q21[27] = Q19b;
transitionTable[Q21] = q21;

const q19b = makeRow(ACC_RELATIONAL);
q19b[29] = Q20;
transitionTable[Q19b] = q19b;

transitionTable[Q20] = makeRow(ACC_LINK);

// comments handling
const q87 = makeRow(Q88);
q87[24] = Q89;
q87[46] = DISCARD_COMMENT;
transitionTable[Q87] = q87;

const q88 = makeRow(Q88);
q88[46] = DISCARD_COMMENT;
transitionTable[Q88] = q88;

const q89 = makeRow(Q90);
transitionTable[Q89] = q89;

const q90 = makeRow(Q90);
q90[24] = Q91;
transitionTable[Q90] = q90;

const q91 = makeRow(Q90);
q91[24] = Q91;
q91[44] = DISCARD_COMMENT;
transitionTable[Q91] = q91;

// delimiters at bracket comment
const q94 = makeRow(ACC_DELIMITER);
q94[44] = Q90b;
transitionTable[Q94] = q94;
transitionTable[Q94b] = makeRow(ACC_DELIMITER);
transitionTable[Q97] = makeRow(ACC_DELIMITER);
transitionTable[Q97b] = makeRow(ACC_DELIMITER);
transitionTable[Q99] = makeRow(ACC_DELIMITER);
transitionTable[Q102] = makeRow(ACC_DELIMITER);
transitionTable[Q102b] = makeRow(ACC_DELIMITER);
transitionTable[Q103] = makeRow(ACC_DELIMITER);
transitionTable[Q104] = makeRow(ACC_DELIMITER);
transitionTable[Q106] = makeRow(ACC_DELIMITER);
transitionTable[Q107] = makeRow(ACC_DELIMITER);

const q90b = makeRow(Q90b);
q90b[44] = Q91b;
transitionTable[Q90b] = q90b;

const q91b = makeRow(Q90b);
q91b[44] = Q91b;
q91b[32] = DISCARD_COMMENT;
transitionTable[Q91b] = q91b;

// numbers at strings
const q108 = makeRow(ACC_INTEGER);
q108[21] = Q108;
q108[39] = Q109;
transitionTable[Q108] = q108;

const q109 = makeRow(ACC_INTEGER);
q109[21] = Q110;
transitionTable[Q109] = q109;

const q110 = makeRow(ACC_FLOAT);
q110[21] = Q110;
transitionTable[Q110] = q110;

const q111 = makeRow(Q111);
q111[42] = ACC_STRING;
transitionTable[Q111] = q111;

const q112 = makeRow(Q112);
q112[43] = ACC_CHAR;
transitionTable[Q112] = q112;
