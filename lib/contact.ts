/**
 * Page Contact. Son hero est clair (fond crème) contrairement aux pages de
 * contenu, d’où ce module dédié plutôt que `ContentPage`.
 *
 * Le corps contient l’annuaire filtrable et le formulaire ; leur logique est
 * rebranchée par `components/site/ContactInteractions.tsx`.
 */
export const CONTACT = {
  eyebrow: `3 avenue Kléber · 64200 Biarritz`,
  title: `Nous<br>contacter`,
  /* Cran de titre (cf. globals.css, --h1-*). `as const` : sans lui
     TypeScript élargit en `string` et le hero refuse la valeur. */
  size: "xl" as const,
  lead: `Pour un rendez-vous, écrivez directement au praticien concerné&nbsp;: c’est la voie la plus rapide. L’adresse générale reste ouverte pour tout le reste.`,
  bodyHtml: `<!-- TROIS VOIES -->
<section style="padding:0 clamp(20px,5vw,64px) clamp(50px,7vw,80px);max-width:1280px;margin:0 auto;">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:clamp(14px,1.8vw,22px);">
    <a href="#annuaire" style="text-decoration:none;display:flex;flex-direction:column;gap:12px;padding:28px;border-radius:var(--r-m);background:#003850;box-shadow:0 6px 26px rgba(60,40,30,.1);transition:transform .22s cubic-bezier(.16,1,.3,1);" class="mg-inline-hover">
      <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:#F3BE79;">Le plus rapide</span>
      <h2 style="margin:0;font-size:var(--h2-s);font-weight:700;letter-spacing:-.01em;color:#fff;">Prendre rendez-vous</h2>
      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.7);">Chaque praticien gère son propre agenda. Doctolib ou contact direct, au choix.</p>
      <span style="margin-top:4px;font-size:13px;font-weight:600;color:#04A49B;">Voir l’annuaire ↓</span>
    </a>
    <a href="#formulaire" style="text-decoration:none;display:flex;flex-direction:column;gap:12px;padding:28px;border-radius:var(--r-m);background:#fff;box-shadow:0 6px 26px rgba(60,40,30,.08);transition:transform .22s cubic-bezier(.16,1,.3,1);" class="mg-inline-hover">
      <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:#04A49B;">Une question</span>
      <h2 style="margin:0;font-size:var(--h2-s);font-weight:700;letter-spacing:-.01em;color:#003850;">Écrire au centre</h2>
      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Mugi Klub, tarifs, remboursements, accès, entreprises et clubs.</p>
      <span style="margin-top:4px;font-size:13px;font-weight:600;color:#04A49B;">Formulaire ↓</span>
    </a>
    <div style="display:flex;flex-direction:column;gap:12px;padding:28px;border-radius:var(--r-m);background:#F5EDE4;">
      <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:rgba(51,51,52,.5);">Pro &amp; presse</span>
      <h2 style="margin:0;font-size:var(--h2-s);font-weight:700;letter-spacing:-.01em;color:#003850;">Rejoindre ou collaborer</h2>
      <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(51,51,52,.65);">Praticien, club, marque ou média&nbsp;: on répond sous 48&nbsp;h ouvrées.</p>
      <a href="mailto:contact@mugitu-biarritz.fr?subject=Partenariat%20Mugitu" style="margin-top:4px;font-size:13px;font-weight:600;text-decoration:none;">contact@mugitu-biarritz.fr ↗</a>
    </div>
  </div>
</section>

<!-- ANNUAIRE -->
<section id="annuaire" style="padding:var(--sect-base) clamp(20px,5vw,64px);background:#fff;">
  <div style="max-width:1280px;margin:0 auto;">
    <div style="margin-bottom:clamp(24px,3vw,36px);">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:#04A49B;">Annuaire</p>
      <h2 style="margin:0 0 12px;font-size:var(--h2-xl);font-weight:700;letter-spacing:-.03em;color:#003850;">Contacter un praticien</h2>
      <p style="margin:0;max-width:520px;font-size:16px;line-height:1.6;color:rgba(51,51,52,.65);">13 praticiens, 8 disciplines. Filtrez, puis réservez ou écrivez en un clic.</p>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 clamp(22px,3vw,32px);">
      <span style="font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;color:rgba(51,51,52,.5);font-weight:600;margin-right:6px;">Filtrer</span>
      <button class="ct-filter" data-cat="all" style="cursor:pointer;font:inherit;padding:9px 18px;border-radius:var(--r-pill);border:1px solid transparent;background:#003850;color:#fff;font-size:13px;font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);">Tous <span style="opacity:.55;font-weight:500;">13</span></button>
      <button class="ct-filter" data-cat="osteo" style="cursor:pointer;font:inherit;padding:9px 18px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.14);background:transparent;color:#003850;font-size:13px;font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);">Ostéopathie <span style="opacity:.45;font-weight:500;">3</span></button>
      <button class="ct-filter" data-cat="kine" style="cursor:pointer;font:inherit;padding:9px 18px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.14);background:transparent;color:#003850;font-size:13px;font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);">Kinésithérapie <span style="opacity:.45;font-weight:500;">4</span></button>
      <button class="ct-filter" data-cat="medecin" style="cursor:pointer;font:inherit;padding:9px 18px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.14);background:transparent;color:#003850;font-size:13px;font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);">Médecine du sport <span style="opacity:.45;font-weight:500;">1</span></button>
      <button class="ct-filter" data-cat="psy" style="cursor:pointer;font:inherit;padding:9px 18px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.14);background:transparent;color:#003850;font-size:13px;font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);">Psychologie <span style="opacity:.45;font-weight:500;">2</span></button>
      <button class="ct-filter" data-cat="nutrition" style="cursor:pointer;font:inherit;padding:9px 18px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.14);background:transparent;color:#003850;font-size:13px;font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);">Nutrition <span style="opacity:.45;font-weight:500;">2</span></button>
      <button class="ct-filter" data-cat="podologie" style="cursor:pointer;font:inherit;padding:9px 18px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.14);background:transparent;color:#003850;font-size:13px;font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);">Podologie <span style="opacity:.45;font-weight:500;">1</span></button>
      <button class="ct-filter" data-cat="prepa" style="cursor:pointer;font:inherit;padding:9px 18px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.14);background:transparent;color:#003850;font-size:13px;font-weight:600;transition:all .22s cubic-bezier(.16,1,.3,1);">Préparation physique <span style="opacity:.45;font-weight:500;">4</span></button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr));gap:clamp(14px,1.8vw,20px);">

      <article class="ct-card" data-cat="osteo" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/lucas-bengoechea.jpg" alt="Lucas Bengoechea" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 25%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Ostéopathe du sport</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Lucas Bengoechea</h3>
          <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:rgba(51,51,52,.6);"><a href="tel:+33636922653" style="text-decoration:none;">06 36 92 26 53</a> · <a href="mailto:lucas@mugitu-biarritz.fr" style="text-decoration:none;word-break:break-all;">lucas@mugitu-biarritz.fr</a> · <a href="https://www.instagram.com/lebaskosteo/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">@lebaskosteo</a></p>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/osteopathe/ahetze/lucas-bengoechea" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Lucas%20Bengoechea" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/lucas-bengoechea" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="medecin" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/basile-carcassonne.jpg" alt="Dr Basile Carcassonne" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 18%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Médecin du sport</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Dr Basile Carcassonne</h3>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/medecin-du-sport/cambo-les-bains/basile-carcassonne?pid=practice-746000" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20le%20Dr%20Basile%20Carcassonne" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/basile-carcassonne" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="kine prepa" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/jb-colombie.jpg" alt="Jean-Baptiste Colombié" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 25%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Kiné du sport</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Jean-Baptiste Colombié</h3>
          <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:rgba(51,51,52,.6);"><a href="mailto:jbc.kine@gmail.com" style="text-decoration:none;word-break:break-all;">jbc.kine@gmail.com</a> · <a href="https://www.instagram.com/jb_colombie/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">@jb_colombie</a></p>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/masseur-kinesitherapeute/biarritz/jean-baptiste-colombie" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Jean-Baptiste%20Colombi%C3%A9" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/jean-baptiste-colombie" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="osteo kine" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/julien-blamont.jpg" alt="Julien Blamont" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 22%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Ostéopathe D.O. · kiné du sport</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Julien Blamont</h3>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/osteopathe/biarritz/julien-blamont" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Julien%20Blamont" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/julien-blamont" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="kine prepa" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/clement-cofourain.jpg" alt="Clément Cofourain" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 18%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Kiné du sport</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Clément Cofourain</h3>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="mailto:contact@mugitu-biarritz.fr?subject=RDV%20avec%20Cl%C3%A9ment%20Cofourain" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Demander un RDV</a>
            <a href="/equipe/clement-cofourain" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="kine" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/baptiste-caparros.webp" alt="Baptiste Caparros" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 22%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Kiné du sport</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Baptiste Caparros</h3>
          <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:rgba(51,51,52,.6);"><a href="https://www.instagram.com/runwithbat/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">@runwithbat</a></p>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/masseur-kinesitherapeute/cambo-les-bains/baptiste-caparros" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Baptiste%20Caparros" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/baptiste-caparros" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="psy" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/marie-boura.jpg" alt="Marie Boura" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 20%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Psychologue du sport</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Marie Boura</h3>
          <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:rgba(51,51,52,.6);"><a href="https://www.instagram.com/mb_psydusport/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">@mb_psydusport</a></p>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/psychologue/anglet/marie-boura" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Marie%20Boura" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/marie-boura" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="psy" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/mailys-bersier.webp" alt="Maïlys Bersier" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 30%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Psychologue · EMDR</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Maïlys Bersier</h3>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/psychologue/anglet/mailys-bersier" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Ma%C3%AFlys%20Bersier" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/mailys-bersier" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="osteo prepa" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/marine-vignaud.png" alt="Marine Vignaud" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 20%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Ostéopathe D.O.</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Marine Vignaud</h3>
          <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:rgba(51,51,52,.6);"><a href="https://www.instagram.com/optimouv.therapie/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">@optimouv.therapie</a></p>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/osteopathe/saint-jean-de-luz/marine-vignaud" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Marine%20Vignaud" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/marine-vignaud" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="prepa" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/hugo-daminato.png" alt="Hugo Daminato" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 20%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Préparateur physique</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Hugo Daminato</h3>
          <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:rgba(51,51,52,.6);"><a href="mailto:hugo.daminato@gmail.com" style="text-decoration:none;word-break:break-all;">hugo.daminato@gmail.com</a></p>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="mailto:hugo.daminato@gmail.com?subject=Pr%C3%A9paration%20physique%20Mugitu" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">hugo.daminato@gmail.com</a>
            <a href="/equipe/hugo-daminato" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="nutrition" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/ihintza-larralde.webp" alt="Ihintza Larralde" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 30%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Diététicienne du sport</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Ihintza Larralde</h3>
          <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:rgba(51,51,52,.6);"><a href="https://www.instagram.com/ihintza.diet/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">@ihintza.diet</a></p>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/dieteticien/cambo-les-bains/ihintza-larralde" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Ihintza%20Larralde" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/ihintza-larralde" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="nutrition" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/johanna-marmiesse.webp" alt="Johanna Marmiesse" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 25%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Diététicienne du sport · visio uniquement</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Johanna Marmiesse</h3>
          <p style="margin:0 0 10px;font-size:12px;line-height:1.6;color:rgba(51,51,52,.6);"><a href="tel:+33608370220" style="text-decoration:none;">06 08 37 02 20</a> · <a href="mailto:johannamarmiesse@gmail.com" style="text-decoration:none;word-break:break-all;">johannamarmiesse@gmail.com</a> · <a href="https://www.instagram.com/ma.psydiet/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">@ma.psydiet</a></p>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://calendly.com/johannamarmiesse/30min" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Réserver ↗</a>
            <a href="/equipe/johanna-marmiesse" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

      <article class="ct-card" data-cat="podologie" style="display:flex;gap:18px;padding:18px;border-radius:var(--r-m);background:#FDF8F4;box-shadow:0 4px 20px rgba(60,40,30,.06);">
        <img src="/ophelie-hubert.webp" alt="Ophélie Hubert" style="width:88px;height:104px;flex:none;border-radius:var(--r-s);object-fit:cover;object-position:center 25%;background:#012A3A;" />
        <div style="min-width:0;display:flex;flex-direction:column;">
          <p style="margin:0 0 3px;font-size:10px;letter-spacing:var(--ls-label);text-transform:uppercase;color:#04A49B;font-weight:600;">Pédicure-podologue</p>
          <h3 style="margin:0 0 8px;font-size:var(--h3-m);font-weight:700;color:#003850;letter-spacing:-.01em;">Ophélie Hubert</h3>
          <div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://www.doctolib.fr/pedicure-podologue/biarritz/ophelie-hubert" target="_blank" rel="noopener noreferrer" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:12px;font-weight:600;">Doctolib ↗</a>
            <a href="mailto:contact@mugitu-biarritz.fr?subject=Message%20pour%20Oph%C3%A9lie%20Hubert" style="text-decoration:none;padding:8px 15px;border-radius:var(--r-pill);border:1px solid rgba(0,56,80,.16);color:#003850;font-size:12px;font-weight:600;">Écrire</a>
            <a href="/equipe/ophelie-hubert" style="text-decoration:none;padding:8px 12px;font-size:12px;font-weight:600;color:rgba(51,51,52,.55);">Fiche</a>
          </div>
        </div>
      </article>

    </div>
    <p id="ct-empty" style="display:none;margin:24px 0 0;font-size:14px;color:rgba(51,51,52,.55);">Aucun praticien dans cette discipline.</p>
  </div>
</section>

<!-- FORMULAIRE -->
<section id="formulaire" style="padding:var(--sect-ample) clamp(20px,5vw,64px);max-width:1280px;margin:0 auto;">
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:clamp(28px,4vw,56px);align-items:start;">
    <div>
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:#04A49B;">Formulaire</p>
      <h2 style="margin:0 0 14px;font-size:var(--h2-xl);font-weight:700;letter-spacing:-.03em;color:#003850;">Une question&nbsp;?</h2>
      <p style="margin:0 0 26px;max-width:420px;font-size:16px;line-height:1.6;color:rgba(51,51,52,.65);">Choisissez le motif&nbsp;: le message part vers la bonne personne, avec un objet clair. Réponse sous 48&nbsp;h ouvrées.</p>
      <div style="display:flex;flex-direction:column;gap:14px;padding:22px;border-radius:var(--r-m);background:#F5EDE4;">
        <div>
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:rgba(51,51,52,.5);">Adresse</p>
          <p style="margin:0;font-size:15px;line-height:1.5;color:#003850;font-weight:600;">3 avenue Kléber<br>64200 Biarritz</p>
        </div>
        <div>
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:rgba(51,51,52,.5);">Téléphone</p>
          <a href="tel:+33636922653" style="font-size:19px;font-weight:700;letter-spacing:-.01em;text-decoration:none;color:#003850;">06 36 92 26 53</a>
        </div>
        <div>
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:rgba(51,51,52,.5);">Horaires d’accueil</p>
          <p style="margin:0;font-size:15px;line-height:1.55;color:#003850;font-weight:600;">Lundi – vendredi&nbsp;: 8h00 – 20h00<br>Samedi&nbsp;: 9h00 – 16h00</p>
        </div>
        <div>
          <p style="margin:0 0 4px;font-size:11px;letter-spacing:var(--ls-label);text-transform:uppercase;font-weight:600;color:rgba(51,51,52,.5);">E-mail général</p>
          <a href="mailto:contact@mugitu-biarritz.fr" style="font-size:15px;font-weight:600;text-decoration:none;">contact@mugitu-biarritz.fr</a>
        </div>
        <a href="https://maps.google.com/?q=3+avenue+Kl%C3%A9ber+64200+Biarritz" target="_blank" rel="noopener noreferrer" style="align-self:flex-start;text-decoration:none;padding:10px 18px;border-radius:var(--r-pill);background:#003850;color:#fff;font-size:13px;font-weight:600;">Itinéraire ↗</a>
      </div>
    </div>

    <form id="ct-form" style="display:flex;flex-direction:column;gap:16px;padding:clamp(22px,3vw,32px);border-radius:var(--r-m);background:#fff;box-shadow:0 6px 26px rgba(60,40,30,.08);">
      <div>
        <label for="ct-motif" style="display:block;font-size:12px;font-weight:600;color:#003850;margin-bottom:6px;">Motif</label>
        <select id="ct-motif" style="width:100%;padding:12px 14px;border-radius:var(--r-s);border:1px solid rgba(0,56,80,.16);background:#FDF8F4;font-size:14px;color:#333334;">
          <option value="rdv">Prendre ou modifier un rendez-vous</option>
          <option value="klub">Mugi Klub · abonnement, planning</option>
          <option value="tarifs">Tarifs et remboursements</option>
          <option value="pro">Club, entreprise, partenariat</option>
          <option value="recrutement">Rejoindre la Mugi Team</option>
          <option value="presse">Presse</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div id="ct-prat-wrap">
        <label for="ct-prat" style="display:block;font-size:12px;font-weight:600;color:#003850;margin-bottom:6px;">Praticien concerné</label>
        <select id="ct-prat" style="width:100%;padding:12px 14px;border-radius:var(--r-s);border:1px solid rgba(0,56,80,.16);background:#FDF8F4;font-size:14px;color:#333334;">
          <option value="">Je ne sais pas encore</option>
          <option value="Lucas Bengoechea">Lucas Bengoechea · ostéopathie</option>
          <option value="Dr Basile Carcassonne">Dr Basile Carcassonne · médecine du sport</option>
          <option value="Jean-Baptiste Colombié">Jean-Baptiste Colombié · kiné</option>
          <option value="Julien Blamont">Julien Blamont · kiné</option>
          <option value="Clément Cofourain">Clément Cofourain · kiné</option>
          <option value="Baptiste Caparros">Baptiste Caparros · kiné</option>
          <option value="Marie Boura">Marie Boura · psychologie</option>
          <option value="Maïlys Bersier">Maïlys Bersier · psychologie</option>
          <option value="Marine Vignaud">Marine Vignaud · ostéopathie</option>
          <option value="Hugo Daminato">Hugo Daminato · préparation physique</option>
          <option value="Ihintza Larralde">Ihintza Larralde · nutrition</option>
          <option value="Johanna Marmiesse">Johanna Marmiesse · nutrition</option>
          <option value="Ophélie Hubert">Ophélie Hubert · podologie</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;">
        <div>
          <label for="ct-nom" style="display:block;font-size:12px;font-weight:600;color:#003850;margin-bottom:6px;">Prénom &amp; nom</label>
          <input id="ct-nom" placeholder="Prénom Nom" style="width:100%;padding:12px 14px;border-radius:var(--r-s);border:1px solid rgba(0,56,80,.16);background:#FDF8F4;font-size:14px;" />
        </div>
        <div>
          <label for="ct-email" style="display:block;font-size:12px;font-weight:600;color:#003850;margin-bottom:6px;">E-mail</label>
          <input id="ct-email" type="email" placeholder="vous@email.com" style="width:100%;padding:12px 14px;border-radius:var(--r-s);border:1px solid rgba(0,56,80,.16);background:#FDF8F4;font-size:14px;" />
        </div>
      </div>
      <div>
        <label for="ct-msg" style="display:block;font-size:12px;font-weight:600;color:#003850;margin-bottom:6px;">Votre message</label>
        <textarea id="ct-msg" rows="5" placeholder="Sport pratiqué, gêne ou objectif, disponibilités…" style="width:100%;padding:12px 14px;border-radius:var(--r-s);border:1px solid rgba(0,56,80,.16);background:#FDF8F4;font-size:14px;line-height:1.5;resize:vertical;"></textarea>
      </div>
      <p id="ct-route" style="margin:0;font-size:12px;line-height:1.5;color:rgba(51,51,52,.55);">Destinataire&nbsp;: contact@mugitu-biarritz.fr</p>
      <button id="ct-send" type="submit" style="cursor:pointer;font:inherit;padding:15px 28px;border:none;border-radius:var(--r-pill);background:#04A49B;color:#fff;font-size:15px;font-weight:600;transition:background .2s ease;" class="mg-inline-hover">Envoyer le message</button>
      <p style="margin:0;font-size:11px;line-height:1.5;color:rgba(51,51,52,.4);">Ne transmettez pas de données de santé sensibles par e-mail. Pour une urgence, appelez le 15.</p>
    </form>
  </div>
</section>`,
};
