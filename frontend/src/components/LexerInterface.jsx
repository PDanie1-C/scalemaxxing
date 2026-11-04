import { useState, useCallback } from 'react';
import { analyze } from '@lexer/analyzer.js';
import { Tokens } from '@lexer/tokens.js';
import '../styles/style.css';

// default code sa editor
const SAMPLE_CODE = `# variable declarations
dim mass x = 10
dim span y = 3.14
dim rune name = "Alice"

# function declaration
unit mass add(mass a, mass b):
    pure a + b

# conditionals at noise words
snap (x > 5):
    weight "x is greater than 5"
show (x == 5):
    weight "x is equal to 5"
when:
    weight "x is less than 5"

# multi-line comment test
#* comment block ito
   na ma-didiscard lang *#

dim mass result = add(x, 20)
weight result

# bidirectional at flow link
bind c <=> a + b
flow speed => dist / time

# loops at compound assignments
orbit (dim mass i = 0; i <= 10; i += 1):
    snap (i != 5):
        weight i
    when:
        eject

# noise word reduction: dimension -> dim, snapshot -> snap, whenever -> when
dimension mass z = 42
snapshot (z > 0):
    weight z
whenever (z == 42):
    halt
emit`;

// kulay ng bawat token sa table

function getTokenColor(token) {
  switch (token) {
    case Tokens.KEYWORD:
      return '#c39bff';
    case Tokens.DATA_TYPE:
      return '#ff9ed0';
    case Tokens.IDENTIFIER:
      return '#6fd9a0';
    case Tokens.INTEGER_LIT:
    case Tokens.FLOAT_LIT:
    case Tokens.STRING_LIT:
    case Tokens.CHAR_LIT:
      return '#8ebcff';
    case Tokens.OPERATOR:
    case Tokens.ASSIGN_OP:
    case Tokens.RELATIONAL_OP:
    case Tokens.LINK_OP:
      return '#ffb072';
    case Tokens.DELIMITER:
      return '#aab2c0';
    case Tokens.ERROR:
      return '#ff8a7a';
    default:
      return '#ecebe6';
  }
}

function getTokenCategory(token) {
  switch (token) {
    case Tokens.KEYWORD: return 'keyword';
    case Tokens.DATA_TYPE: return 'datatype';
    case Tokens.IDENTIFIER: return 'identifier';
    case Tokens.INTEGER_LIT:
    case Tokens.FLOAT_LIT:
    case Tokens.STRING_LIT:
    case Tokens.CHAR_LIT: return 'literal';
    case Tokens.OPERATOR:
    case Tokens.ASSIGN_OP:
    case Tokens.RELATIONAL_OP:
    case Tokens.LINK_OP: return 'operator';
    case Tokens.DELIMITER: return 'delimiter';
    case Tokens.ERROR: return 'error';
    default: return 'unknown';
  }
}

// main UI component para sa lexer
export default function LexerInterface() {
  const [sourceCode, setSourceCode] = useState(SAMPLE_CODE);
  const [lexemes, setLexemes] = useState(() => analyze(SAMPLE_CODE));
  const [copyMessage, setCopyMessage] = useState('');

  const handleAnalyze = useCallback(() => {
    const result = analyze(sourceCode);
    setLexemes(result);
  }, [sourceCode]);

  const handleClear = useCallback(() => {
    setSourceCode('');
    setLexemes([]);
  }, []);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSourceCode(value);
    setLexemes(analyze(value));
  }, []);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      setSourceCode(text);
      setLexemes(analyze(text));
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleCopy = useCallback(async () => {
    const plainText = lexemes
      .map((lex) => `${lex.value.padEnd(25)} : ${lex.token}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(plainText);
      setCopyMessage('Copied!');
    } catch {
      setCopyMessage('Copy failed — select text manually.');
    }
    setTimeout(() => setCopyMessage(''), 2000);
  }, [lexemes]);

  const totalTokens = lexemes.length;
  const errorCount = lexemes.filter((l) => l.token === Tokens.ERROR).length;

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title} class="shrikhand-title">ScaleMAXXING</h1>
        <p style={styles.subtitle}>a unit-aware language by PPL - Group 4</p>
      </header>

      {/* Source Input */}
      <div class="container-flex">
        <div>
          <textarea
            value={sourceCode}
            onChange={handleInputChange}
            placeholder="Enter ScaleMAXXING code here..."
            spellCheck={false}
            style={styles.textarea}
          />

          {/* Toolbar */}
          <div style={styles.toolbar}>
            <button onClick={handleAnalyze} style={{ ...styles.button, ...styles.buttonPrimary }}>
              Analyze
            </button>
            <label style={styles.button}>
              Upload .txt
              <input
                type="file"
                accept=".txt,.smx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
            <button onClick={handleClear} style={styles.button}>
              Clear
            </button>
            <span style={styles.stats}>
              {totalTokens > 0 && `${totalTokens} token${totalTokens !== 1 ? 's' : ''}${errorCount > 0 ? `, ${errorCount} error${errorCount !== 1 ? 's' : ''}` : ''}`}
            </span>
          </div>
        </div>
        
        {/* Results Table */}
        <div>
          <div style={styles.resultsContainer}>
            {lexemes.length === 0 ? (
              <p style={styles.muted}>No tokens yet. Enter ScaleMAXXING code above.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: '50px' }}>#</th>
                    <th style={styles.th}>Line</th>
                    <th style={styles.th}>Col</th>
                    <th style={styles.th}>Lexeme</th>
                    <th style={styles.th}>Token</th>
                    <th style={styles.th}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {lexemes.map((lex, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={{ ...styles.td, color: '#9a9890', textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ ...styles.td, color: '#9a9890', textAlign: 'center' }}>{lex.line}</td>
                      <td style={{ ...styles.td, color: '#9a9890', textAlign: 'center' }}>{lex.col}</td>
                      <td style={{ ...styles.td, ...styles.lexemeCell }}>
                        {lex.value}
                      </td>
                      <td style={{ ...styles.td, color: getTokenColor(lex.token) }}>
                        {lex.token}
                      </td>
                      <td style={{ ...styles.td, ...styles.categoryCell }}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: getTokenColor(lex.token) + '20',
                          color: getTokenColor(lex.token),
                        }}>
                          {getTokenCategory(lex.token)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Plain Text Output */}
          {lexemes.length > 0 && (
            <details style={styles.details}>
              <summary style={styles.summary}>Plain Text Output</summary>
              <div style={styles.plainActions}>
                <button onClick={handleCopy} style={styles.button}>
                  Copy
                </button>
                {copyMessage && <span style={styles.copyMsg}>{copyMessage}</span>}
              </div>
              <pre style={styles.pre}>
                {lexemes.map((lex) => `${lex.value.padEnd(16)} : ${lex.token.padEnd(16)} [Line ${lex.line}, Col ${lex.col}]`).join('\n')}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

// inline styles para sa UI
const styles = {
  page: {
    display: 'flex',
    'flex-direction': 'column',
    maxWidth: '100vw',
    margin: '0 auto',
    padding: '1.5rem 2rem',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    color: '#ecebe6',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
  },
  titleIcon: {
    fontSize: '28px',
  },
  subtitle: {
    color: '#9a9890',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '1rem',
    resize: 'vertical',
    border: '1px solid #3a3a36',
    borderRadius: '10px',
    background: '#21211f',
    color: '#ecebe6',
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    lineHeight: '1.5',
    outline: 'none',
    boxSizing: 'border-box',
    'scrollbar-width': 'thin'
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
    marginTop: '0.75rem',
  },
  button: {
    padding: '8px 14px',
    border: '1px solid #3a3a36',
    borderRadius: '8px',
    background: '#21211f',
    color: '#ecebe6',
    fontFamily: 'inherit',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  buttonPrimary: {
    background: '#7aa2ff',
    borderColor: '#7aa2ff',
    color: '#101010',
    fontWeight: 600,
  },
  stats: {
    marginLeft: 'auto',
    color: '#9a9890',
    fontSize: '13px',
  },
  muted: {
    color: '#9a9890',
    textAlign: 'center',
    padding: '40px 0',
  },
  resultsContainer: {
    border: '1px solid #3a3a36',
    borderRadius: '10px',
    background: '#21211f',
    overflow: 'hidden',
    'overflow-x': 'auto',
    '-webkit-overflow-scrolling': 'touch'
  },
  table: {
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    fontSize: '14px',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    borderBottom: '1px solid #3a3a36',
    color: '#9a9890',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#1a1a19',
  },
  td: {
    padding: '8px 14px',
    borderBottom: '1px solid #2a2a28',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere'
  },
  trEven: {
    background: '#21211f',
  },
  trOdd: {
    background: '#1d1d1c',
  },
  lexemeCell: {
    color: '#ecebe6',
    fontWeight: 500,
  },
  categoryCell: {
    textAlign: 'right',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  details: {
    marginTop: '16px',
  },
  summary: {
    cursor: 'pointer',
    color: '#9a9890',
    fontSize: '14px',
    padding: '8px 0',
  },
  plainActions: {
    margin: '8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  copyMsg: {
    color: '#6fd9a0',
    fontSize: '13px',
  },
  pre: {
    padding: '14px',
    overflow: 'auto',
    border: '1px solid #3a3a36',
    borderRadius: '10px',
    background: '#1a1a19',
    fontSize: '13px',
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    lineHeight: '1.6',
    color: '#ecebe6',
  },
};

