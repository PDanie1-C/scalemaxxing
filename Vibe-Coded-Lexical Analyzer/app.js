/**
 * app.js
 *
 * Connects the page to the lexer: reads the text area or an uploaded file,
 * runs Lexer on it, and draws the results. All tokenizing logic lives in
 * lexer.js; this file only deals with the page.
 */

/* --------------------------------------------------------------------------
   Page elements
   -------------------------------------------------------------------------- */

const elements = {
  input: document.getElementById("source-input"),
  analyzeButton: document.getElementById("analyze-button"),
  clearButton: document.getElementById("clear-button"),
  fileInput: document.getElementById("file-input"),
  stats: document.getElementById("stats"),
  results: document.getElementById("results"),
  plainOutput: document.getElementById("plain-output"),
  copyButton: document.getElementById("copy-button"),
  copyMessage: document.getElementById("copy-message"),
};

const SAMPLE_CODE = [
  "int x = 10;",
  "float y = 3.14;",
  'string s = "hello";',
  "if (x >= 5) { print(s, y); }",
  "a@b 1.5.3 'ab'",
].join("\n");


/* --------------------------------------------------------------------------
   Rendering
   -------------------------------------------------------------------------- */

/** Build one table row: the token on the left, its category on the right. */
function createTokenRow(token) {
  const row = document.createElement("tr");

  const textCell = document.createElement("td");
  textCell.className = "token-text";
  textCell.textContent = token.token;

  const typeCell = document.createElement("td");
  typeCell.className = "token-type kind-" + token.kind;
  typeCell.textContent = token.type;

  row.append(textCell, typeCell);
  return row;
}

/** Build the card for one source line, containing a table of its tokens. */
function createLineCard(lineResult) {
  const card = document.createElement("div");
  card.className = "line-card";

  const title = document.createElement("h2");
  title.className = "line-card-title";
  title.textContent = "Line " + lineResult.lineNumber + ": " + lineResult.source;

  const table = document.createElement("table");
  table.className = "token-table";
  lineResult.tokens.forEach((token) => table.appendChild(createTokenRow(token)));

  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  scroll.appendChild(table);

  card.append(title, scroll);
  return card;
}

/** Draw all results and update the summary and plain-text output. */
function renderResults(lineResults) {
  elements.results.textContent = "";

  if (lineResults.length === 0) {
    const message = document.createElement("p");
    message.className = "muted";
    message.textContent = "No tokens yet.";
    elements.results.appendChild(message);
  }

  lineResults.forEach((lineResult) => {
    elements.results.appendChild(createLineCard(lineResult));
  });

  const allTokens = lineResults.flatMap((lineResult) => lineResult.tokens);
  const invalidCount = allTokens.filter((t) => t.kind === "invalid").length;

  elements.stats.textContent = allTokens.length
    ? allTokens.length + " tokens, " + invalidCount + " invalid"
    : "";

  elements.plainOutput.textContent = Lexer.formatPlainText(lineResults);
}


/* --------------------------------------------------------------------------
   Actions
   -------------------------------------------------------------------------- */

function analyze() {
  renderResults(Lexer.tokenizeText(elements.input.value));
}

function clearAll() {
  elements.input.value = "";
  analyze();
}

/** Load a chosen .txt file into the text area and analyze it. */
async function loadFile(file) {
  try {
    elements.input.value = await file.text();
    analyze();
  } catch (error) {
    elements.results.textContent = "Could not read that file.";
  }
}

async function copyPlainOutput() {
  try {
    await navigator.clipboard.writeText(elements.plainOutput.textContent);
    elements.copyMessage.textContent = "Copied.";
  } catch (error) {
    elements.copyMessage.textContent = "Copy was blocked; select the text manually.";
  }
}


/* --------------------------------------------------------------------------
   Events
   -------------------------------------------------------------------------- */

elements.input.addEventListener("input", analyze);
elements.analyzeButton.addEventListener("click", analyze);
elements.clearButton.addEventListener("click", clearAll);
elements.copyButton.addEventListener("click", copyPlainOutput);

elements.fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) loadFile(file);
  event.target.value = "";  // lets the same file be chosen again later
});


/* --------------------------------------------------------------------------
   Start
   -------------------------------------------------------------------------- */

elements.input.value = SAMPLE_CODE;
analyze();
