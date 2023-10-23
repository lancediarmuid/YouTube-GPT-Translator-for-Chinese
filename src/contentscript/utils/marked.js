function marked(md) {
  const rules = [
    { regex: /\*\*(.+?)\*\*/g, replacement: '<strong>$1</strong>' }, // bold
    { regex: /\*(.+?)\*/g, replacement: '<em>$1</em>' }, // italic
    { regex: /_(.+?)_/g, replacement: '<em>$1</em>' }, // italic
    { regex: /\[(.*?)\]\((.*?)\)/g, replacement: '<a href="$2">$1</a>' }, // link
    { regex: /\n/g, replacement: '<div style="margin-bottom:10px"/>' }, // line break
  ];

  let html = md;
  for (const rule of rules) {
    html = html.replace(rule.regex, rule.replacement);
  }

  return html;
}

export default marked;
