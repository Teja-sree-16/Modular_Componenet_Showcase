/**
 * A lightweight, high-performance regex-based syntax highlighter for React/JSX templates.
 * Escapes tags, extracts strings and comments first to prevent double-matching,
 * applies syntax regexes, then restores the string tokens wrapped in styling spans.
 */
function highlightCode(code) {
  if (!code) return "";

  // Convert to safe HTML entities to prevent rendering tags as DOM elements
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const strings = [];
  const comments = [];

  // 1. Extract strings (double quotes, single quotes, backticks)
  html = html.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, (match) => {
    const placeholder = `_STR_TOKEN_${strings.length}_`;
    strings.push(match);
    return placeholder;
  });

  // 2. Extract comments (single-line // and multi-line /* */)
  html = html.replace(/(\/\/.*)$/gm, (match) => {
    const placeholder = `_COM_TOKEN_${comments.length}_`;
    comments.push(match);
    return placeholder;
  });

  html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
    const placeholder = `_COM_TOKEN_${comments.length}_`;
    comments.push(match);
    return placeholder;
  });

  // 3. Highlight keywords
  const keywords = [
    "import", "export", "from", "default", "const", "let", "var", "function",
    "return", "async", "await", "try", "catch", "finally", "class", "extends",
    "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
    "new", "typeof", "instanceof", "in", "of", "throw"
  ];
  const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  html = html.replace(keywordRegex, '<span class="hl-keyword">$1</span>');

  // 4. Highlight React hooks
  const hooks = ["useState", "useEffect", "useCallback", "useMemo", "useContext", "useRef", "useReducer", "useNavigate", "useParams", "useLocation"];
  const hookRegex = new RegExp(`\\b(${hooks.join("|")})\\b`, "g");
  html = html.replace(hookRegex, '<span class="hl-hook">$1</span>');

  // 5. Highlight values
  html = html.replace(/\b(true|false|null|undefined)\b/g, '<span class="hl-value">$1</span>');

  // 6. Highlight numbers
  html = html.replace(/\b(\d+)\b/g, '<span class="hl-number">$1</span>');

  // 7. Highlight functions
  html = html.replace(/\b(\w+)(?=\()/g, '<span class="hl-function">$1</span>');

  // 8. Highlight tags and attributes
  html = html.replace(/(&lt;\/?[A-Z][a-zA-Z0-9]*|&lt;\/?[a-z][a-z0-9]*)/g, '<span class="hl-tag">$1</span>');
  html = html.replace(/(\/?&gt;)/g, '<span class="hl-tag">$1</span>');

  // 9. Restore strings & comments
  for (let i = 0; i < comments.length; i++) {
    html = html.split(`_COM_TOKEN_${i}_`).join(`<span class="hl-comment">${comments[i]}</span>`);
  }
  for (let i = 0; i < strings.length; i++) {
    html = html.split(`_STR_TOKEN_${i}_`).join(`<span class="hl-string">${strings[i]}</span>`);
  }

  return html;
}

export function CodeHighlight({ code }) {
  const highlighted = highlightCode(code);
  const lines = highlighted.split("\n");

  return (
    <div className="code-viewer-container">
      <div className="code-viewer-lines">
        {lines.map((_, i) => (
          <span key={i} className="line-number">{i + 1}</span>
        ))}
      </div>
      <pre className="code-viewer-pre">
        <code>
          {lines.map((line, i) => (
            <div
              key={i}
              className="code-line"
              dangerouslySetInnerHTML={{ __html: line || " " }}
            />
          ))}
        </code>
      </pre>
    </div>
  );
}