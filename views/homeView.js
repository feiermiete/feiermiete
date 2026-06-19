function formatEuro(cents) {
  if (cents === null || cents === undefined) return null;

  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

function getProductImage(product) {
  const map = {
    "pavillon-6x3": "/public/images/equipment/pavillon.svg",
    "stehtisch": "/public/images/equipment/stehtisch.svg",
    "bierzeltgarnitur": "/public/images/equipment/bierzeltgarnitur.svg",
    "chafing-dish": "/public/images/equipment/chafing-dish.svg",
    "getraenkespender": "/public/images/equipment/getraenkespender.svg",
    "gluehweinbehaelter": "/public/images/equipment/gluehweinbehaelter.svg",
    "geschirr-besteck-set": "/public/images/equipment/geschirr.svg",
    "buffet-tisch": "/public/images/equipment/buffet-tisch.svg"
  };

  return product.imageUrl || map[product.slug] || "/public/images/equipment/pavillon.svg";
}

export function renderHomePage({ products = [] }) {
  const productCards = products.slice(0, 8).map((product) => {
    const price = formatEuro(product.priceCents);
    const deposit = formatEuro(product.depositCents);
    const image = getProductImage(product);

    return `
      <article class="product-card">
        <a class="product-image" href="/anfrage?produkt=${product.slug}">
          <img src="${image}" alt="${product.name}" />
        </a>

        <div class="product-body">
          <div class="product-kicker">${product.category?.name || "Equipment"}</div>
          <h3>${product.name}</h3>
          <p>${product.description || "Hochwertiges Equipment für deine Feier oder Veranstaltung."}</p>
        </div>

        <div class="product-meta">
          <div>
            <span>Mietpreis</span>
            <strong>ab ${price}</strong>
          </div>
          <div>
            <span>Kaution</span>
            <strong>${deposit || "auf Anfrage"}</strong>
          </div>
        </div>

        <a class="product-button" href="/anfrage?produkt=${product.slug}">Artikel anfragen</a>
      </article>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Feiermiete - Equipment, Küche & Eventservice mieten</title>
        <link rel="stylesheet" href="/public/css/style.css" />
      </head>

      <body>
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

        <main>
          <section class="hero">
            <div class="wide-inner hero-grid">
              <div class="hero-copy">
                <div class="eyebrow">Event- & Partyequipment in Berlin</div>
                <h1>Sie feiern.<span>Wir liefern.</span></h1>
                <p>
                  Equipment, Produktionsküche, Catering-Koordination und Eventlogistik für private Feiern, Firmenveranstaltungen und Caterings.
                </p>

                <div class="actions">
                  <a class="button primary" href="/anfrage">Unverbindlich anfragen</a>
                  <a class="button" href="/services">Leistungen ansehen</a>
                </div>
              </div>

              <div class="hero-visual">
                <div class="hero-card">
                  <span>Feiermiete</span>
                  <strong>Alles für deine Feier aus einer Hand.</strong>
                  <p>Equipment · Küche · Catering · Lieferung</p>
                </div>
              </div>
            </div>
          </section>

          <section class="trust-row">
            <div class="wide-inner trust-inner">
              <div><strong>Berlin & Brandenburg</strong><span>Liefergebiet</span></div>
              <div><strong>Privat & Firma</strong><span>Für jede Feier</span></div>
              <div><strong>Flexible Pakete</strong><span>Nach Bedarf</span></div>
              <div><strong>Ein Ansprechpartner</strong><span>Alles koordiniert</span></div>
            </div>
          </section>

          <section class="section services-overview" id="services">
            <div class="wide-inner">
              <div class="section-head">
                <div>
                  <div class="section-kicker">Unsere Leistungen</div>
                  <h2>Alles für deine Feier – klar aufgeteilt.</h2>
                </div>
                <p>
                  Wähle den Bereich, der zu deiner Veranstaltung passt. Jede Leistung hat eine eigene Seite mit mehr Informationen.
                </p>
              </div>

              <div class="service-grid">
                <article class="service-card">
                  <div class="service-image service-equipment">
                    <span>Equipment</span>
                  </div>
                  <div class="service-content">
                    <span>01</span>
                    <h3>Equipment mieten</h3>
                    <p>
                      Miete genau das Equipment, das du für deine Feier brauchst – einzeln oder als passendes Paket. Ideal für Geburtstage, Gartenfeiern, Hochzeiten, Firmenfeiern und kleine Events.
                    </p>
                    <ul class="service-points">
                      <li>Pavillons, Stehtische und Bierzeltgarnituren</li>
                      <li>Geschirr, Besteck, Chafing Dishes und Buffet-Zubehör</li>
                      <li>Flexible Zusammenstellung nach Personenanzahl und Anlass</li>
                    </ul>
                    <a href="/equipment">Mehr zu Equipment</a>
                  </div>
                </article>

                <article class="service-card" id="kueche">
                  <div class="service-image service-kitchen">
                    <span>Küche</span>
                  </div>
                  <div class="service-content">
                    <span>02</span>
                    <h3>Küche mieten</h3>
                    <p>
                      Unsere Produktionsküche kannst du stundenweise oder tageweise anfragen. Perfekt, wenn du vorbereiten, produzieren, verpacken oder größere Mengen für ein Event organisieren möchtest.
                    </p>
                    <ul class="service-points">
                      <li>Für Caterer, Food-Startups und Pop-up-Konzepte</li>
                      <li>Für Vorbereitung, Produktion und Eventabwicklung</li>
                      <li>Nutzung nach Verfügbarkeit und individueller Absprache</li>
                    </ul>
                    <a href="/kueche-mieten">Mehr zur Küche</a>
                  </div>
                </article>

                <article class="service-card" id="catering">
                  <div class="service-image service-catering">
                    <span>Catering</span>
                  </div>
                  <div class="service-content">
                    <span>03</span>
                    <h3>Catering koordinieren</h3>
                    <p>
                      Du brauchst neben Equipment auch passende Speisen? Auf Wunsch koordinieren wir Catering-Lösungen mit erfahrenen Partnern, damit Essen, Equipment, Lieferung und Ablauf zusammenpassen.
                    </p>
                    <ul class="service-points">
                      <li>Catering-Koordination für private und geschäftliche Events</li>
                      <li>Abstimmung von Speisen, Buffetaufbau und Equipment</li>
                      <li>Ein Ansprechpartner statt viele einzelne Absprachen</li>
                    </ul>
                    <a href="/catering">Mehr zu Catering</a>
                  </div>
                </article>

                <article class="service-card">
                  <div class="service-image service-logistics">
                    <span>Logistik</span>
                  </div>
                  <div class="service-content">
                    <span>04</span>
                    <h3>Lieferung & Aufbau</h3>
                    <p>
                      Wir liefern das gewünschte Equipment zum vereinbarten Zeitpunkt, unterstützen bei der sinnvollen Platzierung und holen alles nach der Veranstaltung wieder ab.
                    </p>
                    <ul class="service-points">
                      <li>Lieferung nach Berlin, Brandenburg und Umgebung</li>
                      <li>Aufbauhilfe nach Absprache möglich</li>
                      <li>Rückgabe, Abholung und Ablauf planbar organisiert</li>
                    </ul>
                    <a href="/services">Mehr zu Services</a>
                  </div>
                </article>
              </div>
            </div>
          </section>
          <section class="section product-section" id="equipment">
            <div class="wide-inner">
              <div class="section-head">
                <div>
                  <div class="section-kicker">Mietartikel</div>
                  <h2>Beliebtes Equipment</h2>
                </div>
                <p>
                  Starte mit einzelnen Artikeln oder kombiniere mehrere Produkte zu einem passenden Paket.
                </p>
              </div>

              <div class="product-grid">
                ${productCards || "<p>Noch keine Produkte eingetragen.</p>"}
              </div>
            </div>
          </section>

          <section class="section process-section">
            <div class="wide-inner">
              <div class="center-head">
                <div class="section-kicker">Ablauf</div>
                <h2>So funktioniert es.</h2>
                <p>Du fragst an, wir prüfen Verfügbarkeit und erstellen dir ein passendes Angebot.</p>
              </div>

              <div class="process-grid">
                <div>
                  <span>01</span>
                  <h3>Anfrage senden</h3>
                  <p>Datum, Ort, gewünschtes Equipment und besondere Wünsche mitteilen.</p>
                </div>
                <div>
                  <span>02</span>
                  <h3>Angebot erhalten</h3>
                  <p>Wir prüfen Artikel, Küche, Catering und Lieferung nach Verfügbarkeit.</p>
                </div>
                <div>
                  <span>03</span>
                  <h3>Feier vorbereiten</h3>
                  <p>Wir koordinieren Lieferung, Aufbau und Rückgabe nach Absprache.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="section faq-section premium-faq">
  <div class="wide-inner faq-premium-grid">
    <div class="faq-intro">
      <div class="section-kicker">Fragen & Antworten</div>
      <h2>Gut zu wissen.</h2>
      <p>
        Hier findest du die wichtigsten Antworten zur Miete von Equipment,
        Produktionsküche, Lieferung, Aufbau, Kaution und Catering-Koordination.
      </p>

      <div class="faq-note-box">
        <strong>Deine Frage ist nicht dabei?</strong>
        <span>
          Schreib uns einfach, was du planst. Wir prüfen dein Anliegen und melden uns mit einer passenden Empfehlung.
        </span>
        <a href="/anfrage">Anfrage senden</a>
      </div>
    </div>

    <div class="faq-list">
      <details>
        <summary>
          <span>Kann ich auch einzelne Artikel mieten?</span>
          <strong>+</strong>
        </summary>
        <p>
          Ja. Du kannst einzelne Mietartikel wie Stehtische, Pavillons, Chafing Dishes,
          Getränkespender oder Geschirr anfragen. Wenn mehrere Artikel benötigt werden,
          stellen wir dir ein passendes Paket zusammen.
        </p>
      </details>

      <details>
        <summary>
          <span>Bietet ihr Lieferung und Aufbau an?</span>
          <strong>+</strong>
        </summary>
        <p>
          Ja, Lieferung, Aufbau und spätere Abholung können je nach Auftrag und Standort
          mit angeboten werden. Die Kosten hängen von Entfernung, Menge, Zeitfenster und Aufwand ab.
        </p>
      </details>

      <details>
        <summary>
          <span>Kann ich eure Produktionsküche mieten?</span>
          <strong>+</strong>
        </summary>
        <p>
          Ja. Die Produktionsküche kann stundenweise oder tageweise angefragt werden.
          Sie eignet sich für Vorbereitung, Produktion, Catering, Pop-ups, Food-Startups
          oder größere Eventmengen.
        </p>
      </details>

      <details>
        <summary>
          <span>Bietet ihr auch Catering an?</span>
          <strong>+</strong>
        </summary>
        <p>
          Auf Wunsch koordinieren wir passende Catering-Lösungen. Besonders sinnvoll ist das,
          wenn Equipment, Speisen, Lieferung und Aufbau gemeinsam geplant werden sollen.
        </p>
      </details>

      <details>
        <summary>
          <span>Gibt es eine Kaution?</span>
          <strong>+</strong>
        </summary>
        <p>
          Je nach Artikel, Menge und Mietdauer kann eine Kaution anfallen. Das wird im Angebot
          transparent aufgeführt, damit du vorher weißt, welche Kosten entstehen.
        </p>
      </details>

      <details>
        <summary>
          <span>Kann ich kurzfristig anfragen?</span>
          <strong>+</strong>
        </summary>
        <p>
          Ja, kurzfristige Anfragen sind möglich. Je früher du anfragst, desto besser können wir
          Verfügbarkeit, Lieferung und mögliche Zusatzleistungen einplanen.
        </p>
      </details>
    </div>
  </div>
</section>
<section class="final-cta">
            <div class="wide-inner final-cta-inner">
              <div>
                <div class="section-kicker">Anfrage</div>
                <h2>Du planst eine Feier?</h2>
                <p>
                  Schreib uns Datum, Ort, Personenanzahl und was du brauchst. Wir empfehlen dir passende Artikel, Services oder eine Komplettlösung.
                </p>
              </div>
              <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
            </div>
          </section>
        </main>

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
      </body>
    </html>
  `;
}










