import { useState, useCallback, useMemo, useRef } from 'react';
import { analyze } from '@lexer/analyzer.js';
import { Tokens } from '@lexer/tokens.js';
import '../styles/style.css';

// kulay ng bawat token sa table at badges
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
    case Tokens.INDENT:
    case Tokens.DEDENT:
      return '#38bdf8';
    case Tokens.ERROR:
      return '#ff8a7a';
    default:
      return '#ecebe6';
  }
}

// category para sa table badge at filtering
function getTokenCategory(token) {
  switch (token) {
    case Tokens.KEYWORD:
    case Tokens.DATA_TYPE:
      return 'keyword';
    case Tokens.IDENTIFIER:
      return 'identifier';
    case Tokens.INTEGER_LIT:
    case Tokens.FLOAT_LIT:
    case Tokens.STRING_LIT:
    case Tokens.CHAR_LIT:
      return 'literal';
    case Tokens.OPERATOR:
    case Tokens.ASSIGN_OP:
    case Tokens.RELATIONAL_OP:
    case Tokens.LINK_OP:
      return 'operator';
    case Tokens.DELIMITER:
      return 'delimiter';
    case Tokens.INDENT:
    case Tokens.DEDENT:
      return 'indentation';
    case Tokens.ERROR:
      return 'error';
    default:
      return 'unknown';
  }
}

export default function LexerInterface() {
  const [sourceCode, setSourceCode] = useState('');
  const [lexemes, setLexemes] = useState([]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [copyMessage, setCopyMessage] = useState('');

  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  // manual analyze trigger lamang kapag pinindot ang Analyze button o Ctrl+Enter
  const handleAnalyze = useCallback(() => {
    const result = analyze(sourceCode);
    setLexemes(result);
    setIsAnalyzed(true);
  }, [sourceCode]);

  // pag-clear ng editor at pag-reset ng state
  const handleClear = useCallback(() => {
    setSourceCode('');
    setLexemes([]);
    setIsAnalyzed(false);
  }, []);

  // pagbabago sa input: hindi awtomatikong mag-a-analyze
  const handleInputChange = useCallback((e) => {
    setSourceCode(e.target.value);
    setIsAnalyzed(false);
  }, []);

  // file upload: papasok lang ang code sa textarea nang hindi agad nag-aanalyze
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      setSourceCode(text);
      setIsAnalyzed(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // synchronized vertical scrolling sa pagitan ng line gutter at textarea
  const handleScroll = useCallback((e) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  }, []);

  // Ctrl+Enter / Cmd+Enter shortcut pang-analyze
  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyze();
      }
    },
    [handleAnalyze]
  );

  // summary statistics ng tokens
  const stats = useMemo(() => {
    let keywords = 0;
    let identifiers = 0;
    let literals = 0;
    let operators = 0;
    let delimiters = 0;
    let errors = 0;

    for (const lex of lexemes) {
      const cat = getTokenCategory(lex.token);
      if (cat === 'keyword') keywords++;
      else if (cat === 'identifier') identifiers++;
      else if (cat === 'literal') literals++;
      else if (cat === 'operator') operators++;
      else if (cat === 'delimiter' || cat === 'indentation') delimiters++;
      else if (cat === 'error') errors++;
    }

    return {
      total: lexemes.length,
      keywords,
      identifiers,
      literals,
      operators,
      delimiters,
      errors,
    };
  }, [lexemes]);

  // filtered tokens base sa napiling category
  const filteredLexemes = useMemo(() => {
    if (selectedFilter === 'all') return lexemes;
    if (selectedFilter === 'error') return lexemes.filter((l) => l.token === Tokens.ERROR);
    return lexemes.filter((l) => {
      const cat = getTokenCategory(l.token);
      return cat === selectedFilter;
    });
  }, [lexemes, selectedFilter]);

  // pag-copy ng plain text output
  const handleCopy = useCallback(async () => {
    const listToCopy = filteredLexemes.length > 0 ? filteredLexemes : lexemes;
    const plainText = listToCopy
      .map(
        (lex) =>
          `${String(lex.value).padEnd(20)} : ${lex.token.padEnd(15)} [Line ${lex.line}, Col ${lex.col}]`
      )
      .join('\n');
    try {
      await navigator.clipboard.writeText(plainText);
      setCopyMessage('Copied!');
    } catch {
      setCopyMessage('Copy failed — select text manually.');
    }
    setTimeout(() => setCopyMessage(''), 2000);
  }, [filteredLexemes, lexemes]);

  // bilang ng linya para sa gutter
  const lineCount = useMemo(() => {
    if (!sourceCode) return 1;
    return sourceCode.split('\n').length;
  }, [sourceCode]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>ScaleMAXXING</h1>
        <p style={styles.subtitle}>a unit-aware language by PPL - Group 4</p>
      </header>

      {/* Code Editor na may Sticky Synchronized Line Gutter */}
      <div style={styles.editorContainer}>
        <div ref={gutterRef} style={styles.gutter}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} style={styles.gutterLine}>
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={sourceCode}
          onChange={handleInputChange}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder="Type or paste ScaleMAXXING code here, or upload a .txt test file..."
          spellCheck={false}
          style={styles.textarea}
        />
      </div>

      {/* Toolbar Controls */}
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

        {/* Status indicator */}
        <span style={styles.statusIndicator}>
          {!isAnalyzed && sourceCode.trim().length > 0 && (
            <span style={styles.pendingBadge}>Analysis pending — click Analyze</span>
          )}
          {isAnalyzed && (
            <span style={styles.analyzedBadge}>
              {stats.total} token{stats.total !== 1 ? 's' : ''} emitted
            </span>
          )}
        </span>
      </div>

      {/* Token Statistics Badges at Real-Time Filter Pills */}
      {isAnalyzed && lexemes.length > 0 && (
        <div style={styles.statsContainer}>
          <div style={styles.statsHeader}>
            <span style={styles.statsTitle}>Token Breakdown & Filter:</span>
            <span style={styles.filterHint}>Click a pill to filter the results table</span>
          </div>
          <div style={styles.pillGroup}>
            <button
              onClick={() => setSelectedFilter('all')}
              style={{
                ...styles.filterPill,
                ...(selectedFilter === 'all' ? styles.filterPillActive : {}),
              }}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setSelectedFilter('keyword')}
              style={{
                ...styles.filterPill,
                ...(selectedFilter === 'keyword' ? styles.filterPillActive : {}),
                color: '#c39bff',
              }}
            >
              Keywords ({stats.keywords})
            </button>
            <button
              onClick={() => setSelectedFilter('identifier')}
              style={{
                ...styles.filterPill,
                ...(selectedFilter === 'identifier' ? styles.filterPillActive : {}),
                color: '#6fd9a0',
              }}
            >
              Identifiers ({stats.identifiers})
            </button>
            <button
              onClick={() => setSelectedFilter('literal')}
              style={{
                ...styles.filterPill,
                ...(selectedFilter === 'literal' ? styles.filterPillActive : {}),
                color: '#8ebcff',
              }}
            >
              Literals ({stats.literals})
            </button>
            <button
              onClick={() => setSelectedFilter('operator')}
              style={{
                ...styles.filterPill,
                ...(selectedFilter === 'operator' ? styles.filterPillActive : {}),
                color: '#ffb072',
              }}
            >
              Operators ({stats.operators})
            </button>
            <button
              onClick={() => setSelectedFilter('delimiter')}
              style={{
                ...styles.filterPill,
                ...(selectedFilter === 'delimiter' ? styles.filterPillActive : {}),
                color: '#aab2c0',
              }}
            >
              Delimiters ({stats.delimiters})
            </button>
            <button
              onClick={() => setSelectedFilter('error')}
              style={{
                ...styles.filterPill,
                ...(selectedFilter === 'error' ? styles.filterPillActive : {}),
                ...(stats.errors > 0 ? styles.filterPillErrorActive : { color: '#ff8a7a' }),
              }}
            >
              Errors ({stats.errors})
            </button>
          </div>
        </div>
      )}

      {/* Results Table Area */}
      <div style={styles.resultsContainer}>
        {!isAnalyzed ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>
              {sourceCode.trim().length > 0
                ? 'Code entered in editor.'
                : 'No code in editor.'}
            </p>
            <p style={styles.emptySubtitle}>
              {sourceCode.trim().length > 0
                ? 'Click the "Analyze" button above (or press Ctrl+Enter) to generate the token table.'
                : 'Type code, load the sample code, or upload a .txt file, then click Analyze.'}
            </p>
            {sourceCode.trim().length > 0 && (
              <button
                onClick={handleAnalyze}
                style={{ ...styles.button, ...styles.buttonPrimary, marginTop: '12px' }}
              >
                Analyze Now
              </button>
            )}
          </div>
        ) : lexemes.length === 0 ? (
          <p style={styles.muted}>No tokens produced (input was blank or comments only).</p>
        ) : filteredLexemes.length === 0 ? (
          <div style={styles.emptyState}>
            {selectedFilter === 'error' ? (
              <p style={{ color: '#6fd9a0', fontWeight: 600 }}>
                No lexical errors found. All tokens are valid ScaleMAXXING syntax!
              </p>
            ) : (
              <p style={styles.muted}>No tokens found for category: {selectedFilter}</p>
            )}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '40px' }}>#</th>
                <th style={{ ...styles.th, width: '60px' }}>Line</th>
                <th style={{ ...styles.th, width: '60px' }}>Col</th>
                <th style={styles.th}>Lexeme</th>
                <th style={styles.th}>Token</th>
                <th style={styles.th}>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredLexemes.map((lex, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={{ ...styles.td, color: '#9a9890', textAlign: 'center' }}>{i + 1}</td>
                  <td style={{ ...styles.td, color: '#9a9890', textAlign: 'center' }}>{lex.line}</td>
                  <td style={{ ...styles.td, color: '#9a9890', textAlign: 'center' }}>{lex.col}</td>
                  <td style={{ ...styles.td, ...styles.lexemeCell }}>{lex.value}</td>
                  <td style={{ ...styles.td, color: getTokenColor(lex.token) }}>{lex.token}</td>
                  <td style={{ ...styles.td, ...styles.categoryCell }}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: getTokenColor(lex.token) + '20',
                        color: getTokenColor(lex.token),
                      }}
                    >
                      {getTokenCategory(lex.token)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Plain Text Output Drawer */}
      {isAnalyzed && lexemes.length > 0 && (
        <details style={styles.details}>
          <summary style={styles.summary}>
            Plain Text Output ({filteredLexemes.length}{' '}
            {selectedFilter !== 'all' ? `filtered ${selectedFilter}` : ''} token
            {filteredLexemes.length !== 1 ? 's' : ''})
          </summary>
          <div style={styles.plainActions}>
            <button onClick={handleCopy} style={styles.button}>
              Copy Plain Text
            </button>
            {copyMessage && <span style={styles.copyMsg}>{copyMessage}</span>}
          </div>
          <pre style={styles.pre}>
            {filteredLexemes
              .map(
                (lex) =>
                  `${String(lex.value).padEnd(20)} : ${lex.token.padEnd(15)} [Line ${lex.line}, Col ${lex.col}]`
              )
              .join('\n')}
          </pre>
        </details>
      )}
    </div>
  );
}

// inline styles para sa UI
const styles = {
  page: {
    maxWidth: '920px',
    margin: '0 auto',
    padding: '28px 20px 56px',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    color: '#ecebe6',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '28px',
    fontWeight: 700,
    color: '#ecebe6',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '0',
    color: '#9a9890',
  },
  editorContainer: {
    display: 'flex',
    minHeight: '220px',
    maxHeight: '480px',
    border: '1px solid #3a3a36',
    borderRadius: '10px',
    background: '#21211f',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  },
  gutter: {
    padding: '14px 10px',
    background: '#191917',
    borderRight: '1px solid #30302c',
    color: '#5f5e58',
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    textAlign: 'right',
    userSelect: 'none',
    minWidth: '42px',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  gutterLine: {
    height: '20.8px',
  },
  textarea: {
    flex: 1,
    minHeight: '220px',
    maxHeight: '480px',
    padding: '14px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#ecebe6',
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    resize: 'none',
    boxSizing: 'border-box',
    whiteSpace: 'pre',
    overflow: 'auto',
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
    margin: '14px 0 16px',
  },
  button: {
    padding: '8px 14px',
    border: '1px solid #3a3a36',
    borderRadius: '8px',
    background: '#21211f',
    color: '#ecebe6',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'background 0.15s, border-color 0.15s',
  },
  buttonPrimary: {
    background: '#7aa2ff',
    borderColor: '#7aa2ff',
    color: '#0c1017',
    fontWeight: 600,
  },
  statusIndicator: {
    marginLeft: 'auto',
    fontSize: '13px',
  },
  pendingBadge: {
    color: '#ffb072',
    background: '#ffb07218',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid #ffb07240',
    fontWeight: 500,
  },
  analyzedBadge: {
    color: '#6fd9a0',
    background: '#6fd9a018',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid #6fd9a040',
    fontWeight: 500,
  },
  statsContainer: {
    background: '#191917',
    border: '1px solid #3a3a36',
    borderRadius: '10px',
    padding: '12px 14px',
    marginBottom: '16px',
  },
  statsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statsTitle: {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#9a9890',
  },
  filterHint: {
    fontSize: '12px',
    color: '#686761',
  },
  pillGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  filterPill: {
    padding: '5px 10px',
    borderRadius: '6px',
    border: '1px solid #30302c',
    background: '#21211f',
    color: '#c0beba',
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.15s ease',
  },
  filterPillActive: {
    background: '#2d2d2a',
    borderColor: '#7aa2ff',
    boxShadow: '0 0 0 1px #7aa2ff',
  },
  filterPillErrorActive: {
    background: '#ff8a7a25',
    borderColor: '#ff8a7a',
    color: '#ff8a7a',
    fontWeight: 600,
  },
  resultsContainer: {
    border: '1px solid #3a3a36',
    borderRadius: '10px',
    background: '#21211f',
    overflow: 'hidden',
    'overflow-x': 'auto',
    '-webkit-overflow-scrolling': 'touch'
  },
  emptyState: {
    padding: '44px 20px',
    textAlign: 'center',
  },
  emptyTitle: {
    margin: '0 0 6px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ecebe6',
  },
  emptySubtitle: {
    margin: '0',
    fontSize: '13px',
    color: '#9a9890',
  },
  muted: {
    color: '#9a9890',
    textAlign: 'center',
    padding: '40px 0',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    tableLayout: 'fixed',
    borderCollapse: 'collapse',
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    fontSize: '13px',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    borderBottom: '1px solid #3a3a36',
    color: '#9a9890',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#181816',
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
    background: '#1c1c1a',
  },
  lexemeCell: {
    fontWeight: 500,
    color: '#ffffff',
    maxWidth: '240px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  categoryCell: {
    textAlign: 'right',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  details: {
    marginTop: '16px',
    border: '1px solid #3a3a36',
    borderRadius: '10px',
    background: '#191917',
    overflow: 'hidden',
  },
  summary: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px',
    color: '#c0beba',
    userSelect: 'none',
  },
  plainActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderBottom: '1px solid #2a2a28',
    background: '#151514',
  },
  copyMsg: {
    color: '#6fd9a0',
    fontSize: '12px',
    fontWeight: 500,
  },
  pre: {
    margin: 0,
    padding: '14px 16px',
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
    fontSize: '12px',
    lineHeight: '1.5',
    color: '#ecebe6',
    maxHeight: '300px',
    overflow: 'auto',
    background: '#121211',
  },
};