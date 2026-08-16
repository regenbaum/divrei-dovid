// Renders an editable content string as paragraphs, splitting on blank
// lines. Used everywhere page copy comes from content/site-content.json,
// so admin edits (plain text, blank line = new paragraph) render correctly
// without needing any HTML from the editor.
export default function RichText({ text }) {
  if (!text) return null
  const paragraphs = text.split(/\n\s*\n/)
  return paragraphs.map((p, i) => <p key={i}>{p}</p>)
}
