/**
 * Sous 1024 px, une liste et sa fiche ne tiennent pas côte à côte : la liste
 * s'efface quand la fiche s'ouvre (classe `.ad-md`). La page raccourcit, et
 * l'on resterait au milieu de nulle part : on remonte au début de la fiche.
 * Sur ordinateur, rien ne bouge.
 */
export function montrerFiche(ancre: string): void {
  if (!window.matchMedia("(max-width: 1023.98px)").matches) return;
  window.requestAnimationFrame(() => {
    document.getElementById(ancre)?.scrollIntoView({ block: "start", behavior: "instant" });
  });
}
