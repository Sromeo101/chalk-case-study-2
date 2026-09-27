// Small markdown helper for club posts.
// Supports the handful of bits people actually type on a wall.

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(value) {
  if (/^\s*\/(?!\/)/.test(value) || /^\s*#/.test(value)) return value.trim();
  try {
    const url = new URL(value);
    if (["http:", "https:", "mailto:"].includes(url.protocol)) return value;
  } catch (_) {
    // Unknown relative paths remain plain text.
  }
  return null;
}

function renderMarkdown(src) {
  const text = String(src ?? "");

  return escapeHtml(text)
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, encodedHref) => {
      const href = safeHref(encodedHref.replace(/&amp;/g, "&"));
      return href === null ? match : `<a href="${escapeHtml(href)}">${label}</a>`;
    })
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

module.exports = { renderMarkdown };
