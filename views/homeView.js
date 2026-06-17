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
              <a href="#equipment">Equipment</a>
              <a href="#kueche">Küche mieten</a>
              <a href="#catering">Catering</a>
              <a href="#services">Services</a>
              
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
                  <a class="button" href="#services">Leistungen ansehen</a>
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
                  <h2>Mehr als nur Equipment.</h2>
                </div>
                <p>
                  Feiermiete verbindet Mietartikel, Produktionsküche, Catering-Koordination und Logistik zu einem einfachen Eventservice.
                </p>
              </div>

              <div class="service-grid">
                <article class="service-card">
                  <div class="service-image service-equipment"></div>
                  <div class="service-content">
                    <span>01</span>
                    <h3>Equipment mieten</h3>
                    <p>Pavillons, Stehtische, Bierzeltgarnituren, Geschirr, Chafing Dishes und Buffet-Zubehör.</p>
                    <a href="#equipment">Equipment ansehen</a>
                  </div>
                </article>

                <article class="service-card" id="kueche">
                  <div class="service-image service-kitchen"></div>
                  <div class="service-content">
                    <span>02</span>
                    <h3>Küche mieten</h3>
                    <p>Produktionsküche stundenweise oder tageweise für Caterer, Food-Startups, Events und Vorbereitung.</p>
                    <a href="/anfrage?kategorie=kueche">Küche anfragen</a>
                  </div>
                </article>

                <article class="service-card" id="catering">
                  <div class="service-image service-catering"></div>
                  <div class="service-content">
                    <span>03</span>
                    <h3>Catering koordinieren</h3>
                    <p>Auf Wunsch arbeiten wir mit passenden Cateringfirmen zusammen, damit Speisen und Equipment zusammenpassen.</p>
                    <a href="/anfrage?kategorie=catering">Catering anfragen</a>
                  </div>
                </article>

                <article class="service-card">
                  <div class="service-image service-logistics"></div>
                  <div class="service-content">
                    <span>04</span>
                    <h3>Lieferung & Aufbau</h3>
                    <p>Wir liefern, unterstützen beim Aufbau und holen das Equipment nach der Veranstaltung wieder ab.</p>
                    <a href="/anfrage?kategorie=logistik">Ablauf besprechen</a>
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

          <section class="section faq-section">
            <div class="wide-inner">
              <div class="section-head">
                <div>
                  <div class="section-kicker">Fragen & Antworten</div>
                  <h2>Gut zu wissen.</h2>
                </div>
                <p>
                  Die wichtigsten Antworten zu Equipment, Küche, Catering, Lieferung und Kaution.
                </p>
              </div>

              <div class="faq-grid">
                <details>
                  <summary>Kann ich auch einzelne Artikel mieten?</summary>
                  <p>Ja. Du kannst einzelne Artikel wie Stehtische, Pavillons, Geschirr oder Chafing Dishes anfragen.</p>
                </details>

                <details>
                  <summary>Kann ich eure Produktionsküche mieten?</summary>
                  <p>Ja. Die Produktionsküche kann stundenweise oder tageweise angefragt werden, je nach Verfügbarkeit und Nutzungszweck.</p>
                </details>

                <details>
                  <summary>Bietet ihr selbst Catering an?</summary>
                  <p>Feiermiete steht für Equipment, Küche und Eventlogistik. Auf Wunsch koordinieren wir passende Catering-Lösungen über unser Netzwerk.</p>
                </details>

                <details>
                  <summary>Gibt es eine Kaution?</summary>
                  <p>Bei bestimmten Artikeln kann eine Kaution anfallen. Die genaue Höhe wird im Angebot transparent ausgewiesen.</p>
                </details>

                <details>
                  <summary>Liefert ihr auch außerhalb von Berlin?</summary>
                  <p>Ja, nach Absprache liefern wir auch nach Brandenburg und Umgebung. Die Lieferkosten hängen von Entfernung und Aufwand ab.</p>
                </details>

                <details>
                  <summary>Kann ich kurzfristig anfragen?</summary>
                  <p>Kurzfristige Anfragen sind möglich. Ob es klappt, hängt von Verfügbarkeit, Menge und Lieferaufwand ab.</p>
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
                  Schreib uns, was du brauchst. Wir melden uns mit einer passenden Empfehlung und einem Angebot.
                </p>
              </div>
              <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
            </div>
          </section>
        </main>

        <footer>
          <div class="wide-inner footer-inner">
            <strong>Feiermiete</strong>
            <span>Equipment · Küche · Catering · Eventservice · Berlin & Brandenburg</span>
          </div>
        </footer>
      </body>
    </html>
  `;
}


