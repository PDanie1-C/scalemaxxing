// token types ng ScaleMAXXING
export const Tokens = Object.freeze({
  IDENTIFIER:    'IDENTIFIER',
  KEYWORD:       'KEYWORD',
  DATA_TYPE:     'DATA_TYPE',
  INTEGER_LIT:   'INTEGER_LIT',
  FLOAT_LIT:     'FLOAT_LIT',
  STRING_LIT:    'STRING_LIT',
  CHAR_LIT:      'CHAR_LIT',
  OPERATOR:      'OPERATOR',
  ASSIGN_OP:     'ASSIGN_OP',
  RELATIONAL_OP: 'RELATIONAL_OP',
  LINK_OP:       'LINK_OP',
  DELIMITER:     'DELIMITER',
  ERROR:         'ERROR',
});

// mga keywords lang na tinatanggap sa spec (walang int, float, string)
export const KEYWORDS = Object.freeze({
  dim:       Tokens.KEYWORD,
  unit:      Tokens.KEYWORD,
  pure:      Tokens.KEYWORD,
  weight:    Tokens.KEYWORD,
  snap:      Tokens.KEYWORD,
  show:      Tokens.KEYWORD,
  when:      Tokens.KEYWORD,
  bind:      Tokens.KEYWORD,
  flow:      Tokens.KEYWORD,
  halt:      Tokens.KEYWORD,
  emit:      Tokens.KEYWORD,
  morph:     Tokens.KEYWORD,
  breach:    Tokens.KEYWORD,
  ascend:    Tokens.KEYWORD,
  descend:   Tokens.KEYWORD,
  orbit:     Tokens.KEYWORD,
  eject:     Tokens.KEYWORD,
  flux:      Tokens.KEYWORD,
  null_type: Tokens.KEYWORD,
  warp:      Tokens.KEYWORD,
  shield:    Tokens.KEYWORD,
  fail:      Tokens.KEYWORD,
  core:      Tokens.KEYWORD,
  forge:     Tokens.KEYWORD,
  yeet:      Tokens.KEYWORD,
  cap:       Tokens.KEYWORD,
  lock:      Tokens.KEYWORD,
  and:       Tokens.KEYWORD,
  or:        Tokens.KEYWORD,
  not:       Tokens.KEYWORD,
});

// mga valid datatypes sa ScaleMAXXING
export const DATA_TYPES = Object.freeze({
  mass:   Tokens.DATA_TYPE,
  span:   Tokens.DATA_TYPE,
  signal: Tokens.DATA_TYPE,
  rune:   Tokens.DATA_TYPE,
  stack:  Tokens.DATA_TYPE,
  void:   Tokens.DATA_TYPE,
});

// convert verbose noise words pabalik sa shorthand keywords
export const NOISE_WORDS = Object.freeze({
  dimension: 'dim',
  snapshot:  'snap',
  binding:   'bind',
  whenever:  'when',
});

// helper pang-create ng lexeme object
export function createLexeme(token, value) {
  return { token, value };
}
