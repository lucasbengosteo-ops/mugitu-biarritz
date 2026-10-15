const ENTITES: Record<string, string> = {
  "&amp;": "&",
  "&nbsp;": " ",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "’",
  "&rsquo;": "’",
  "&laquo;": "«",
  "&raquo;": "»",
  "&eacute;": "é",
};

/** HTML statique du site → texte brut, espaces normalisés. */
export function sansBalises(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|section|a|span)>/gi, "$& ")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITES[e] ?? " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([:;!?,.])/g, (_m, p: string) => (p === ":" || p === ";" || p === "!" || p === "?" ? ` ${p}` : p))
    .trim();
}

export function slugifier(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
