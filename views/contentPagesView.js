function renderSiteHeader(active = "") {
  const isActive = (key) => active === key ? "active" : "";

  return `
    <header class="site-header clean-header">
      <div class="header-inner">
        <a class="brand" href="/">
          <div class="brand-main">Feiermiete</div>
          <div class="brand-sub">Equipment für Feiern & Events</div>
        </a>

        <nav>
          <a class="${isActive("home")}" href="/">Home</a>
          <a class="${isActive("equipment")}" href="/equipment">Equipment</a>
          <a class="${isActive("kueche")}" href="/kueche-mieten">Küche mieten</a>
          <a class="${isActive("catering")}" href="/catering">Catering</a>
          <a class="${isActive("services")}" href="/services">Services</a>
          <a class="nav-button ${isActive("anfrage")}" href="/anfrage">Anfrage</a>
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

function renderPage({ title, content, active = "" }) {
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
        ${renderSiteHeader(active)}
        ${content}
        ${renderSiteFooter()}
              <script src="/public/js/cart.js"></script>
      </body>
    </html>
  `;
}

function formatPrice(product) {
  if (!product.priceCents) return "auf Anfrage";
  return (product.priceCents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

export function renderEquipmentPage({ products = [] }) {
  const productCards = products.map((product) => {
    const price = formatPrice(product);

    return `
      <article class="shop-card">
        <div class="shop-card-image">
          <img src="${product.imageUrl || "/public/images/equipment-photo.jpg"}" alt="${product.name}" />
        </div>
        <div class="shop-card-body">
          <div class="shop-card-category">${product.category?.name || "Mietartikel"}</div>
          <h3>${product.name}</h3>
          <p>${product.description || "Mietartikel für Feiern, Firmenveranstaltungen, Buffets und Events."}</p>

          <div class="shop-card-info">
            <div>
              <span>Mietpreis</span>
              <strong>ab ${price}</strong>
            </div>
            <div>
              <span>Verfügbarkeit</span>
              <strong>auf Anfrage</strong>
            </div>
          </div>

          <a href="/anfrage" class="shop-card-button">Artikel anfragen</a>
        </div>
      </article>
    `;
  }).join("");

  return renderPage({
    title: "Equipment mieten", active: "equipment",
    content: `
      <main>
        <section class="visual-hero">
          <div class="wide-inner visual-hero-grid">
            <div>
              <div class="section-kicker">Equipment mieten</div>
              <h1>Mietartikel für Feiern, Events, Buffets und Caterings.</h1>
              <p>
                Ob Gartenfeier, Firmenveranstaltung, Hochzeit, Sommerfest oder Cateringproduktion:
                Feiermiete stellt dir passende Mietartikel und auf Wunsch Lieferung, Aufbau und Abholung zusammen.
              </p>
              <div class="hero-actions">
                <a class="button primary" href="/anfrage">Equipment anfragen</a>
                <a class="button secondary" href="#sortiment">Sortiment ansehen</a>
              </div>
            </div>

            <div class="visual-hero-image">
              <img src="/public/images/equipment-photo.jpg" alt="Event Equipment" />
            </div>
          </div>
        </section>

        <section class="content-band">
          <div class="wide-inner intro-grid">
            <div>
              <div class="section-kicker">Sortiment</div>
              <h2>Alles, was dein Event praktisch macht.</h2>
            </div>
            <p>
              Viele Feiern scheitern nicht am Essen, sondern an den Details: zu wenig Tische,
              kein Wetterschutz, fehlendes Geschirr, keine Warmhaltemöglichkeit oder komplizierte Logistik.
              Genau dafür ist Feiermiete gedacht.
            </p>
          </div>
        </section>

        <section class="subpage-section cream">
          <div class="wide-inner">
            <div class="category-grid premium-categories">
              <div><strong>Pavillons & Zelte</strong><span>Wetterschutz, Outdoor-Events, Gartenfeiern und flexible Flächen.</span></div>
              <div><strong>Tische & Sitzmöbel</strong><span>Stehtische, Bierzeltgarnituren, Buffet-Tische und Ablageflächen.</span></div>
              <div><strong>Geschirr & Besteck</strong><span>Teller, Besteck, Schalen, Gläser und Servierartikel.</span></div>
              <div><strong>Buffet & Warmhalten</strong><span>Chafing Dishes, Warmhaltebehälter, GN-Zubehör und Buffetaufbau.</span></div>
              <div><strong>Getränke-Equipment</strong><span>Getränkespender, Glühweinbehälter, Ausschank und Zubehör.</span></div>
              <div><strong>Küchentechnik</strong><span>Öfen, Wärmegeräte, Arbeitsflächen und Produktionszubehör.</span></div>
              <div><strong>Transport & Lagerung</strong><span>Transportboxen, Behälter, Lagerung und Organisation.</span></div>
              <div><strong>Komplettpakete</strong><span>Individuell kombiniert nach Anlass, Personenanzahl und Ablauf.</span></div>
            </div>
          </div>
        </section>

        <section class="subpage-section" id="sortiment">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Mietshop</div>
                <h2>Aktuelle Mietartikel.</h2>
              </div>
              <p>
                Du kannst einzelne Artikel anfragen oder mehrere Produkte als Paket kombinieren lassen.
                Preise, Lieferkosten, Kaution und Verfügbarkeit werden im Angebot sauber aufgeführt.
              </p>
            </div>

            <div class="shop-grid">
              ${productCards || "<p>Noch keine Artikel vorhanden.</p>"}
            </div>
          </div>
        </section>

        <section class="subpage-section cream">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Ablauf</div>
                <h2>Anfragen statt blind bezahlen.</h2>
              </div>
              <p>
                Bei Mietartikeln müssen Datum, Mietdauer, Standort, Lieferung, Aufbau und Kaution vorher geprüft werden.
                Deshalb bekommst du zuerst ein passendes Angebot.
              </p>
            </div>

            <div class="process-grid">
              <div><strong>1. Bedarf senden</strong><span>Artikel, Datum, Ort und Personenanzahl mitteilen.</span></div>
              <div><strong>2. Prüfung</strong><span>Wir prüfen Verfügbarkeit, Aufwand, Lieferung und Kaution.</span></div>
              <div><strong>3. Angebot</strong><span>Du erhältst ein transparentes Angebot mit allen Positionen.</span></div>
              <div><strong>4. Umsetzung</strong><span>Lieferung, Aufbau und Rückgabe werden abgestimmt.</span></div>
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
    title: "Produktionsküche mieten", active: "kueche",
    content: `
      <main>
        <section class="visual-hero">
          <div class="wide-inner visual-hero-grid">
            <div>
              <div class="section-kicker">Produktionsküche mieten</div>
              <h1>Professionelle Küche für Vorbereitung, Produktion und Events.</h1>
              <p>
                Du brauchst mehr Platz, mehr Struktur oder eine Küche für ein bestimmtes Zeitfenster?
                Die Produktionsküche kann stundenweise oder tageweise angefragt werden.
              </p>
              <div class="hero-actions">
                <a class="button primary" href="/anfrage">Küche anfragen</a>
                <a class="button secondary" href="#ausstattung">Ausstattung ansehen</a>
              </div>
            </div>

            <div class="visual-hero-image">
              <img src="/public/images/kitchen-photo.jpg" alt="Produktionsküche" />
            </div>
          </div>
        </section>

        <section class="content-band">
          <div class="wide-inner intro-grid">
            <div>
              <div class="section-kicker">Nutzung</div>
              <h2>Für Caterer, Food-Startups und Eventvorbereitung.</h2>
            </div>
            <p>
              Die Küche eignet sich für Vorbereitung, Produktion, Portionierung, Verpackung,
              Kommissionierung und größere Mengen. Besonders praktisch ist sie, wenn deine eigene Küche
              zu klein ist oder du für ein Event zusätzliche Kapazität brauchst.
            </p>
          </div>
        </section>

        <section class="subpage-section cream" id="ausstattung">
          <div class="wide-inner">
            <div class="feature-list premium-categories">
              <div><strong>Öfen & Wärmegeräte</strong><span>Für Produktion, Regeneration und warme Speisen.</span></div>
              <div><strong>Arbeitsflächen</strong><span>Vorbereitung, Portionierung, Verpackung und Kommissionierung.</span></div>
              <div><strong>Kühlung & Lagerung</strong><span>Nach Absprache für Zutaten, Ware oder Eventvorbereitung.</span></div>
              <div><strong>Spülbereich</strong><span>Für saubere Abläufe vor, während und nach der Nutzung.</span></div>
              <div><strong>GN-Behälter & Zubehör</strong><span>Praktisches Küchenzubehör kann je nach Bedarf abgestimmt werden.</span></div>
              <div><strong>Flexible Zeitfenster</strong><span>Stundenweise, tageweise oder individuell geplant.</span></div>
              <div><strong>Eventproduktion</strong><span>Ideal für Buffets, Firmenlunch, Pop-ups oder Sonderproduktionen.</span></div>
              <div><strong>Optional mit Equipment</strong><span>Chafing Dishes, Transportboxen und Buffetartikel zubuchbar.</span></div>
            </div>
          </div>
        </section>

        <section class="subpage-section">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Geeignet für</div>
                <h2>Wenn du professionell produzieren musst.</h2>
              </div>
            </div>

            <div class="info-grid">
              <article><span>01</span><h3>Catering-Aufträge</h3><p>Vorbereitung und Produktion für Buffets, Firmenveranstaltungen und größere Bestellungen.</p></article>
              <article><span>02</span><h3>Food-Startups</h3><p>Testproduktionen, Pop-ups, Rezeptentwicklung oder kurzfristige Produktionsfenster.</p></article>
              <article><span>03</span><h3>Produktionsspitzen</h3><p>Wenn deine eigene Kapazität nicht reicht und du zeitweise mehr Küche brauchst.</p></article>
            </div>
          </div>
        </section>

        <section class="final-cta">
          <div class="wide-inner final-cta-inner">
            <div>
              <div class="section-kicker">Küche anfragen</div>
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
    title: "Catering koordinieren", active: "catering",
    content: `
      <main>
        <section class="visual-hero">
          <div class="wide-inner visual-hero-grid">
            <div>
              <div class="section-kicker">Catering</div>
              <h1>Catering, Equipment und Ablauf aus einer Hand denken.</h1>
              <p>
                Du brauchst nicht nur Mietartikel, sondern auch Speisen, Buffetaufbau oder Unterstützung bei der Planung?
                Wir koordinieren auf Wunsch passende Catering-Lösungen passend zu Anlass, Personenanzahl und Budget.
              </p>
              <div class="hero-actions">
                <a class="button primary" href="/anfrage">Catering anfragen</a>
                <a class="button secondary" href="/equipment">Equipment ansehen</a>
              </div>
            </div>

            <div class="visual-hero-image">
              <img src="/public/images/catering-photo.jpg" alt="Catering" />
            </div>
          </div>
        </section>

        <section class="content-band">
          <div class="wide-inner intro-grid">
            <div>
              <div class="section-kicker">Komplettlösung</div>
              <h2>Weniger Einzelabstimmung, mehr Planbarkeit.</h2>
            </div>
            <p>
              Catering funktioniert am besten, wenn Speisen, Equipment, Warmhalten, Lieferung und Aufbau zusammen geplant werden.
              So entstehen keine Lücken bei Geschirr, Buffetstation, Strom, Warmhaltung oder Rückgabe.
            </p>
          </div>
        </section>

        <section class="subpage-section cream">
          <div class="wide-inner">
            <div class="feature-list premium-categories">
              <div><strong>Firmenveranstaltungen</strong><span>Sommerfeste, Teamevents, Business-Lunches, Empfänge und Buffets.</span></div>
              <div><strong>Private Feiern</strong><span>Geburtstage, Gartenfeiern, Familienfeiern, Hochzeiten und Einschulungen.</span></div>
              <div><strong>Buffet & Fingerfood</strong><span>Kalte und warme Speisen, Fingerfood, Salate, Desserts und Snacks.</span></div>
              <div><strong>Frühstück & Lunch</strong><span>Frühstücksboxen, Lunchbuffets, Bowls, Wraps und leichte Verpflegung.</span></div>
              <div><strong>Equipment dazu</strong><span>Geschirr, Besteck, Chafing Dishes, Tische und Getränkespender.</span></div>
              <div><strong>Lieferung & Aufbau</strong><span>Abstimmung von Zeitfenster, Aufbau, Rückgabe und Logistik.</span></div>
              <div><strong>Budgetplanung</strong><span>Empfehlung passend zu Personenanzahl, Anlass und Budget.</span></div>
              <div><strong>Ein Ansprechpartner</strong><span>Weniger Chaos, weil mehrere Leistungen zusammen gedacht werden.</span></div>
            </div>
          </div>
        </section>

        <section class="subpage-section">
          <div class="wide-inner">
            <div class="section-head">
              <div>
                <div class="section-kicker">Ablauf</div>
                <h2>Vom Wunsch zur passenden Lösung.</h2>
              </div>
            </div>

            <div class="process-grid">
              <div><strong>1. Anfrage</strong><span>Datum, Ort, Personenanzahl und gewünschte Art der Verpflegung senden.</span></div>
              <div><strong>2. Empfehlung</strong><span>Wir prüfen, welche Catering- und Equipmentlösung sinnvoll ist.</span></div>
              <div><strong>3. Angebot</strong><span>Du erhältst ein Angebot mit Speisen, Equipment und Zusatzleistungen.</span></div>
              <div><strong>4. Umsetzung</strong><span>Lieferung, Aufbau und Ablauf werden gemeinsam abgestimmt.</span></div>
            </div>
          </div>
        </section>
      </main>
    `
  });
}

export function renderServicesPage() {
  return renderPage({
    title: "Services", active: "services",
    content: `
      <main>
        <section class="visual-hero">
          <div class="wide-inner visual-hero-grid">
            <div>
              <div class="section-kicker">Services</div>
              <h1>Lieferung, Aufbau, Abholung und Eventlogistik.</h1>
              <p>
                Gute Events brauchen nicht nur Artikel, sondern einen klaren Ablauf.
                Feiermiete unterstützt dich bei der Zusammenstellung, Lieferung, Aufbau, Abholung und Koordination.
              </p>
              <div class="hero-actions">
                <a class="button primary" href="/anfrage">Service anfragen</a>
                <a class="button secondary" href="/catering">Catering ansehen</a>
              </div>
            </div>

            <div class="visual-hero-image">
              <img src="/public/images/service-photo.jpg" alt="Eventservice" />
            </div>
          </div>
        </section>

        <section class="content-band">
          <div class="wide-inner intro-grid">
            <div>
              <div class="section-kicker">Mehr als Vermietung</div>
              <h2>Damit dein Event nicht an Kleinigkeiten scheitert.</h2>
            </div>
            <p>
              Ob ein Pavillon gestellt, Stehtische geliefert, Chafing Dishes vorbereitet oder Buffetartikel abgeholt werden:
              Wir planen Leistungen nach Aufwand, Ort und Zeitfenster.
            </p>
          </div>
        </section>

        <section class="subpage-section cream">
          <div class="wide-inner">
            <div class="feature-list premium-categories">
              <div><strong>Lieferung</strong><span>Lieferung nach Berlin, Brandenburg und Umgebung nach Absprache.</span></div>
              <div><strong>Aufbau</strong><span>Aufbau von Pavillons, Tischen, Buffetstationen und Zubehör.</span></div>
              <div><strong>Abholung</strong><span>Rückholung im vereinbarten Zeitfenster nach der Veranstaltung.</span></div>
              <div><strong>Komplettpakete</strong><span>Passende Zusammenstellung nach Anlass und Personenanzahl.</span></div>
              <div><strong>Catering-Koordination</strong><span>Speisen, Equipment und Logistik auf Wunsch gemeinsam planen.</span></div>
              <div><strong>Küchennutzung</strong><span>Produktionsküche für Vorbereitung oder Eventabwicklung anfragen.</span></div>
              <div><strong>Kurzfristige Anfragen</strong><span>Je nach Verfügbarkeit auch kurzfristig möglich.</span></div>
              <div><strong>Beratung</strong><span>Wir empfehlen, was für deinen Anlass praktisch und sinnvoll ist.</span></div>
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




