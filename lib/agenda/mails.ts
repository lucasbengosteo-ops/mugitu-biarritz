import { SITE } from "@/lib/brevo";

/**
 * Les textes des mails de l'agenda.
 *
 * Le sujet et le corps sont figés en base au moment de la mise en file
 * (voir `agenda__mettre_en_file`) : ce fichier ne fait que les habiller.
 * Un retrait accordé supprime le vœu, donc rien ici ne peut relire la
 * ligne d'origine.
 */

export function habiller(sujet: string, corps: string): { html: string; texte: string } {
  const lien = `${SITE}/admin/agenda`;
  const paragraphes = corps
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const texte = [sujet, "", ...paragraphes, "", `L’agenda du cabinet : ${lien}`].join("\n");

  const html = [
    `<p style="font-size:16px;font-weight:600;color:#003850;margin:0 0 12px">${echapper(sujet)}</p>`,
    ...paragraphes.map(
      (p) => `<p style="font-size:15px;line-height:1.6;color:#1d2d33;margin:0 0 10px">${echapper(p)}</p>`,
    ),
    `<p style="font-size:14px;margin:18px 0 0"><a href="${lien}" style="color:#04A49B">Ouvrir l’agenda du cabinet</a></p>`,
  ].join("");

  return { html, texte };
}

function echapper(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
