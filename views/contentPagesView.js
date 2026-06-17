function renderSiteHeader() {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/">
          <div class="brand-main">Feiermiete</div>
          <div class="brand-sub">Equipment für Feiern & Events</div>
        </a>

        <nav>
          <a href="/">Home</a>
          <a href="/equipment">Equipment</a>
          <a href="/kueche-mieten">Küche mieten</a>
          <a href="/catering">Catering</a>
          <a href="/services">Services</a>
          <a class="nav-button" href="/anfrage">Anfrage</a>
        </nav>
      </div>
    </header>
  `;
}

function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <div class="wide-inner footer-grid">
        <div>
          <strong>Feiermiete</strong>
          <p>Equipment · Küche · Catering · Eventservice · Berlin & Brandenburg</p>
        </div>

        <div class="footer-contact">
          <span>Anfragen</span>
          <a href="mailto:info@feiermiete.de">info@feiermiete.de</a>
        </div>

        <div class="footer-links">
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="/agb">AGB</a>
        </div>
      </div>
    </footer>
  `;
}

function renderPage({ title, content }) {
  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title} - Feiermiete</title>
        <link rel="stylesheet" href="/public/css/style.css" />
      </head>
      <body>
        ${renderSiteHeader()}
        ${content}
        ${renderSiteFooter()}
      </body>
    </html>
  `;
}

export function renderEquipmentPage({ products = [] }) {
  const productCards = products.map((product) => {
    const price = product.priceCents
      ? (product.priceCents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })
      : "auf Anfrage";

    return `
      <article class="listing-card">
        <div class="listing-image">
          <span>${product.name?.charAt(0) || "F"}</span>
        </div>
        <div class="listing-content">
          <div class="listing-category">${product.category?.name || "Mietartikel"}</div>
          <h3>${product.name}</h3>
          <p>${product.description || "Mietartikel für private Feiern, Firmenveranstaltungen und Events."}</p>
          <div class="listing-meta">
            <strong>Mietpreis</strong>
            <span>ab ${price}</span>
          </div>
          <a href="/anfrage">Artikel anfragen</a>
        </div>
      </article>
    `;
  }).join("");

  return renderPage({
    title: "Equipment mieten",
    content: `
      <main>
        <section class="subpage-hero">
          <div class="wide-inner subpage-hero-grid">
            <div>
              <div class="section-kicker">Mietartikel</div>
              <h1>Equipment mieten für Feiern, Events, Buffets und Caterings.</h1>
              <p>
                Ob private Feier, Firmenveranstaltung, Buffet, Gartenfest oder Catering-Produktion: Auf dieser Seite findest du unser Mietsortiment. Du kannst einzelne Artikel anfragen oder mehrere Produkte zu einem passenden Paket kombinieren lassen.
              </p>
              <div class="hero-actions">
                <a class="button primary" href="/anfrage">Equipment anfragen</a>
                <a class="button secondary" href="#equipment-liste">Sortiment ansehen</a>
              </div>
            </div>

            <div class="subpage-highlight">
              <strong>Für Privat & Firma</strong>
              <span>Geburtstage, Gartenfeiern, Hochzeiten, Sommerfeste, Firmenfeiern, Buffets und Business-Events.</span>
            </div>
          </div>
        </section>

        <section class="subpage-section">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Kategorien</div>
                <h2>Mietartikel nach Kategorien.</h2>
              </div>
              <p>
                Wir bauen das Sortiment Schritt für Schritt aus. Ziel ist eine klare Mietartikel-Übersicht wie ein Shop – aber mit individueller Anfrage statt direkter Onlinezahlung.
              </p>
            </div>

            <div class="category-grid">
              <div><strong>Pavillons & Zelte</strong><span>Wetterschutz, Outdoor-Events, Gartenfeiern</span></div>
              <div><strong>Tische & Sitzmöbel</strong><span>Stehtische, Bierzeltgarnituren, Buffet-Tische</span></div>
              <div><strong>Geschirr & Besteck</strong><span>Teller, Besteck, Schalen, Servierartikel</span></div>
              <div><strong>Buffet & Warmhalten</strong><span>Chafing Dishes, Warmhaltebehälter, Zubehör</span></div>
              <div><strong>Getränke-Equipment</strong><span>Getränkespender, Glühweinbehälter, Ausschank</span></div>
              <div><strong>Küchentechnik</strong><span>Öfen, Wärmegeräte, Arbeitsflächen und Produktionszubehör</span></div>
              <div><strong>Transport & Lagerung</strong><span>Boxen, Behälter, Organisation und Logistik</span></div>
              <div><strong>Komplettpakete</strong><span>Individuell kombiniert nach Anlass, Personenanzahl und Ablauf</span></div>
            </div>
          </div>
        </section>

        <section class="subpage-section">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Ablauf</div>
                <h2>Einfach anfragen statt kompliziert bestellen.</h2>
              </div>
              <p>
                Bei Feiermiete bekommst du kein starres Shopsystem, sondern eine passende Empfehlung.
                So können Mietdauer, Lieferung, Aufbau, Kaution und Kombinationen sauber berücksichtigt werden.
              </p>
            </div>

            <div class="process-grid">
              <div>
                <strong>1. Artikel auswählen</strong>
                <span>Du suchst einzelne Produkte oder beschreibst, was du für deine Feier brauchst.</span>
              </div>
              <div>
                <strong>2. Anfrage senden</strong>
                <span>Teile uns Datum, Ort, Personenanzahl und gewünschte Leistungen mit.</span>
              </div>
              <div>
                <strong>3. Angebot erhalten</strong>
                <span>Wir prüfen Verfügbarkeit, Lieferaufwand, Kaution und mögliche Paketpreise.</span>
              </div>
              <div>
                <strong>4. Lieferung planen</strong>
                <span>Auf Wunsch liefern wir, unterstützen beim Aufbau und holen später wieder ab.</span>
              </div>
            </div>
          </div>
        </section>
        <section class="subpage-section cream" id="equipment-liste">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Sortiment</div>
                <h2>Aktuelle Mietartikel.</h2>
              </div>
              <p>
                Preise, Kautionen und Verfügbarkeit können je nach Menge, Zeitraum, Lieferung und Aufbau variieren.
              </p>
            </div>

            <div class="listing-grid">
              ${productCards || "<p>Noch keine Artikel vorhanden.</p>"}
            </div>
          </div>
        </section>

        <section class="final-cta">
          <div class="wide-inner final-cta-inner">
            <div>
              <div class="section-kicker">Equipment anfragen</div>
              <h2>Du brauchst mehrere Artikel?</h2>
              <p>Schick uns Datum, Ort, Personenanzahl und gewünschte Artikel. Wir stellen dir ein passendes Angebot zusammen.</p>
            </div>
            <a class="button primary" href="/anfrage">Anfrage senden</a>
          </div>
        </section>
      </main>
    `
  });
}

export function renderKitchenPage() {
  return renderPage({
    title: "Produktionsküche mieten",
    content: `
      <main>
        <section class="subpage-hero kitchen-hero">
          <div class="wide-inner subpage-hero-grid">
            <div>
              <div class="section-kicker">Produktionsküche mieten</div>
              <h1>Küche für Stunden oder ganze Tage mieten.</h1>
              <p>
                Du brauchst eine professionelle Küche für Vorbereitung, Produktion, Catering, Food-Startups,
                Pop-up-Konzepte oder größere Veranstaltungen? Bei Feiermiete kannst du eine Produktionsküche
                flexibel anfragen.
              </p>
              <div class="hero-actions">
                <a class="button primary" href="/anfrage">Küche anfragen</a>
                <a class="button secondary" href="#kueche-details">Mehr erfahren</a>
              </div>
            </div>

            <div class="subpage-highlight dark">
              <strong>Flexibel nutzbar</strong>
              <span>Stundenweise, tageweise oder nach individueller Absprache.</span>
            </div>
          </div>
        </section>

        <section class="subpage-section" id="kueche-details">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Für wen geeignet?</div>
                <h2>Professionelle Küche, wenn du mehr Platz brauchst.</h2>
              </div>
              <p>
                Die Küche kann interessant sein, wenn deine eigene Kapazität nicht reicht oder du für ein Event
                sauber vorbereiten, verpacken oder produzieren musst.
              </p>
            </div>

            <div class="info-grid">
              <article>
                <span>01</span>
                <h3>Caterer & Food-Startups</h3>
                <p>Ideal für Produktion, Vorbereitung, Testläufe, Pop-ups oder kurzfristige Engpässe.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Events & Feiern</h3>
                <p>Praktisch, wenn Speisen vorproduziert, verpackt, gekühlt oder organisiert werden müssen.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Meal Prep & größere Mengen</h3>
                <p>Für größere Bestellungen, Firmenversorgung oder wiederkehrende Produktionsfenster.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="subpage-section cream">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Ausstattung</div>
                <h2>Was später aufgelistet werden sollte.</h2>
              </div>
              <p>
                Die genaue Ausstattung müssen wir noch final erfassen. Danach können wir daraus eine starke
                Küchenseite mit echten Details machen.
              </p>
            </div>

            <div class="feature-list">
              <div><strong>Öfen & Wärmegeräte</strong><span>Für Produktion, Regeneration und warme Speisen.</span></div>
              <div><strong>Arbeitsflächen</strong><span>Vorbereitung, Portionierung, Verpackung und Kommissionierung.</span></div>
              <div><strong>Kühlung & Lagerung</strong><span>Nach Verfügbarkeit für Zutaten, fertige Ware oder Eventvorbereitung.</span></div>
              <div><strong>Spül- und Reinigungsbereich</strong><span>Für saubere Abläufe vor, während und nach der Produktion.</span></div>
              <div><strong>Equipment-Zubuchung</strong><span>Bei Bedarf mit Chafing Dishes, Behältern, Transportboxen und Zubehör.</span></div>
              <div><strong>Flexible Zeitfenster</strong><span>Stundenweise, tageweise oder individuell abgestimmt.</span></div>
            </div>
          </div>
        </section>

        <section class="final-cta">
          <div class="wide-inner final-cta-inner">
            <div>
              <div class="section-kicker">Anfrage</div>
              <h2>Du möchtest die Küche nutzen?</h2>
              <p>Schick uns Zeitraum, Zweck und gewünschte Ausstattung. Wir prüfen die Möglichkeit und melden uns.</p>
            </div>
            <a class="button primary" href="/anfrage">Küche anfragen</a>
          </div>
        </section>
      </main>
    `
  });
}

export function renderCateringPage() {
  return renderPage({
    title: "Catering koordinieren",
    content: `
      <main>
        <section class="subpage-hero catering-hero">
          <div class="wide-inner subpage-hero-grid">
            <div>
              <div class="section-kicker">Catering & Eventservice</div>
              <h1>Equipment und Catering aus einer Hand.</h1>
              <p>
                Du brauchst nicht nur Tische, Pavillons oder Geschirr, sondern auch passende Speisen?
                Auf Wunsch koordinieren wir Catering-Lösungen mit passenden Partnern, damit Speisen,
                Equipment, Lieferung und Aufbau zusammenpassen.
              </p>
              <div class="hero-actions">
                <a class="button primary" href="/anfrage">Catering anfragen</a>
                <a class="button secondary" href="/equipment">Equipment ansehen</a>
              </div>
            </div>

            <div class="subpage-highlight">
              <strong>Ein Ansprechpartner</strong>
              <span>Weniger Abstimmung, bessere Planung und ein stimmiger Ablauf.</span>
            </div>
          </div>
        </section>

        <section class="subpage-section">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Möglichkeiten</div>
                <h2>Catering passend zum Anlass.</h2>
              </div>
              <p>
                Feiermiete soll nicht nur ein Mietartikel-Verleih sein. Die Stärke liegt darin, Equipment,
                Küche, Logistik und Catering-Koordination sinnvoll zu verbinden.
              </p>
            </div>

            <div class="info-grid">
              <article>
                <span>01</span>
                <h3>Private Feiern</h3>
                <p>Geburtstage, Gartenfeiern, Hochzeiten, Einschulungen und Familienfeiern.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Firmenveranstaltungen</h3>
                <p>Sommerfeste, Teamevents, Empfänge, Business-Lunches und Buffets.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Buffet & Fingerfood</h3>
                <p>Speisen, Aufbau, Geschirr, Warmhalten und Ablauf können gemeinsam geplant werden.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="subpage-section cream">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Ablauf</div>
                <h2>So wird aus vielen Einzelteilen ein Event.</h2>
              </div>
            </div>

            <div class="process-grid">
              <div><strong>1. Anfrage</strong><span>Du sendest Datum, Ort, Personenanzahl und Wunschleistung.</span></div>
              <div><strong>2. Empfehlung</strong><span>Wir prüfen, welches Equipment und welche Catering-Lösung passt.</span></div>
              <div><strong>3. Angebot</strong><span>Du erhältst ein passendes Angebot mit transparenten Positionen.</span></div>
              <div><strong>4. Umsetzung</strong><span>Lieferung, Aufbau, Speisen und Ablauf werden abgestimmt.</span></div>
            </div>
          </div>
        </section>
      </main>
    `
  });
}

export function renderServicesPage() {
  return renderPage({
    title: "Services",
    content: `
      <main>
        <section class="subpage-hero services-hero">
          <div class="wide-inner subpage-hero-grid">
            <div>
              <div class="section-kicker">Services</div>
              <h1>Lieferung, Aufbau und Eventlogistik.</h1>
              <p>
                Gute Feiern brauchen nicht nur Equipment, sondern einen klaren Ablauf. Wir unterstützen dich
                bei Lieferung, Aufbau, Abholung, Zusammenstellung und auf Wunsch bei der Koordination weiterer Leistungen.
              </p>
              <div class="hero-actions">
                <a class="button primary" href="/anfrage">Service anfragen</a>
                <a class="button secondary" href="/catering">Catering ansehen</a>
              </div>
            </div>

            <div class="subpage-highlight dark">
              <strong>Planbar statt chaotisch</strong>
              <span>Einfacher Ablauf von Anfrage bis Rückgabe.</span>
            </div>
          </div>
        </section>

        <section class="subpage-section">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Leistungen</div>
                <h2>Mehr als nur Vermietung.</h2>
              </div>
              <p>
                Je nach Veranstaltung können Leistungen einzeln oder kombiniert angefragt werden.
              </p>
            </div>

            <div class="feature-list">
              <div><strong>Lieferung</strong><span>Lieferung nach Berlin, Brandenburg und Umgebung nach Absprache.</span></div>
              <div><strong>Aufbau</strong><span>Unterstützung beim Platzieren von Pavillons, Tischen, Buffetstationen und Zubehör.</span></div>
              <div><strong>Abholung</strong><span>Rückholung nach der Veranstaltung im vereinbarten Zeitfenster.</span></div>
              <div><strong>Komplettpakete</strong><span>Zusammenstellung passender Artikel nach Personenanzahl und Anlass.</span></div>
              <div><strong>Catering-Koordination</strong><span>Auf Wunsch Abstimmung mit passenden Catering-Lösungen.</span></div>
              <div><strong>Küchennutzung</strong><span>Produktionsküche für Vorbereitung, Produktion oder Eventabwicklung anfragen.</span></div>
            </div>
          </div>
        </section>

        <section class="final-cta">
          <div class="wide-inner final-cta-inner">
            <div>
              <div class="section-kicker">Anfrage</div>
              <h2>Du planst eine Feier?</h2>
              <p>Schreib uns, was du brauchst. Wir melden uns mit einer passenden Empfehlung und einem Angebot.</p>
            </div>
            <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
          </div>
        </section>
      </main>
    `
  });
}



