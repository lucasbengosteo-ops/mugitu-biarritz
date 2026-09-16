/**
 * Origine canonique du site. L'apex mugitu-biarritz.fr redirige (307) vers le
 * www : toutes les URL absolues destinées aux moteurs (canonical, Open Graph,
 * JSON-LD, metadataBase) doivent partir d'ici, sinon Google voit des canoniques
 * qui pointent vers une redirection.
 */
export const SITE_URL = "https://www.mugitu-biarritz.fr";
