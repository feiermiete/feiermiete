function formatPrice(product) {
  if (!product.priceCents) return "auf Anfrage";

  return (product.priceCents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

function renderHeader() {
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

function renderFooter() {
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

export function renderHomePage({ products = [] }) {
  const productCards = products.slice(0, 4).map((product) => {
    const price = formatPrice(product);

    return `
      <article class="home-product-card">
        <div class="home-product-image">
          <img src="${product.imageUrl || "/public/images/equipment.svg"}" alt="${product.name}" />
        </div>
        <div class="home-product-body">
          <div class="home-product-category">${product.category?.name || "Mietartikel"}</div>
          <h3>${product.name}</h3>
          <p>${product.description || "Mietartikel für Feiern, Events, Buffets und Catering."}</p>
          <div class="home-product-bottom">
            <strong>ab ${price}</strong>
            <a href="/anfrage">Anfragen</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Feiermiete - Equipment, Küche & Eventservice</title>
        <link rel="stylesheet" href="/public/css/style.css" />
      </head>

      <body>
        ${renderHeader()}

        <main>
          <section class="home-hero-v2">
            <div class="wide-inner home-hero-grid">
              <div class="home-hero-content">
                <div class="section-kicker">Equipment · Küche · Catering · Eventservice</div>
                <h1>Alles für deine Feier. Einfach mieten, planen und anfragen.</h1>
                <p>
                  Feiermiete verbindet Mietartikel, Produktionsküche, Catering-Koordination,
                  Lieferung und Aufbau zu einer praktischen Lösung für private Feiern,
                  Firmenveranstaltungen, Buffets und Events in Berlin & Brandenburg.
                </p>

                <div class="hero-actions">
                  <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
                  <a class="button secondary" href="/equipment">Equipment ansehen</a>
                </div>

                <div class="hero-mini-facts">
                  <div><strong>Berlin & Brandenburg</strong><span>Lieferung nach Absprache</span></div>
                  <div><strong>Privat & Firma</strong><span>Feiern, Events, Buffets</span></div>
                  <div><strong>Flexibel</strong><span>Einzelartikel oder Paket</span></div>
                </div>
              </div>

              <div class="home-hero-visual">
                <img src="/public/images/equipment.svg" alt="Event Equipment mieten" />
                <div class="hero-floating-card">
                  <strong>Unverbindlich anfragen</strong>
                  <span>Wir prüfen Verfügbarkeit, Lieferung, Aufbau und Kaution vor dem Angebot.</span>
                </div>
              </div>
            </div>
          </section>

          <section class="home-trust-band">
            <div class="wide-inner trust-grid-v2">
              <div>
                <span>01</span>
                <strong>Equipment mieten</strong>
                <p>Pavillons, Stehtische, Geschirr, Chafing Dishes, Getränkespender und mehr.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Küche mieten</strong>
                <p>Produktionsküche stundenweise oder tageweise für Vorbereitung und Produktion.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Catering koordinieren</strong>
                <p>Speisen, Buffet, Equipment und Logistik können gemeinsam geplant werden.</p>
              </div>
              <div>
                <span>04</span>
                <strong>Lieferung & Aufbau</strong>
                <p>Auf Wunsch mit Lieferung, Aufbau, Abholung und praktischer Eventlogistik.</p>
              </div>
            </div>
          </section>

          <section class="home-services-v2">
            <div class="wide-inner">
              <div class="home-section-head">
                <div>
                  <div class="section-kicker">Leistungen</div>
                  <h2>Mehr als nur ein Mietshop.</h2>
                </div>
                <p>
                  Du musst nicht selbst herausfinden, welche Artikel zusammenpassen.
                  Wir denken Anlass, Personenanzahl, Standort, Aufbau und Rückgabe direkt mit.
                </p>
              </div>

              <div class="service-showcase-grid">
                <article>
                  <img src="/public/images/equipment.svg" alt="Equipment" />
                  <div>
                    <span>Equipment</span>
                    <h3>Mietartikel für jeden Anlass</h3>
                    <p>
                      Von Pavillons und Tischen bis zu Buffet-Equipment, Geschirr,
                      Getränkespendern und Zubehör.
                    </p>
                    <a href="/equipment">Equipment ansehen</a>
                  </div>
                </article>

                <article>
                  <img src="/public/images/kitchen.svg" alt="Produktionsküche" />
                  <div>
                    <span>Küche</span>
                    <h3>Produktionsküche flexibel nutzen</h3>
                    <p>
                      Für Caterer, Food-Startups, Eventvorbereitung, Produktionsspitzen
                      oder größere Mengen.
                    </p>
                    <a href="/kueche-mieten">Küche mieten</a>
                  </div>
                </article>

                <article>
                  <img src="/public/images/catering.svg" alt="Catering" />
                  <div>
                    <span>Catering</span>
                    <h3>Catering und Equipment zusammen planen</h3>
                    <p>
                      Speisen, Buffet, Warmhalten, Geschirr, Lieferung und Aufbau
                      können sinnvoll kombiniert werden.
                    </p>
                    <a href="/catering">Catering ansehen</a>
                  </div>
                </article>

                <article>
                  <img src="/public/images/services.svg" alt="Services" />
                  <div>
                    <span>Services</span>
                    <h3>Lieferung, Aufbau und Rückgabe</h3>
                    <p>
                      Damit dein Event praktisch funktioniert: Lieferung, Aufbau,
                      Abholung und Ablauf nach Absprache.
                    </p>
                    <a href="/services">Services ansehen</a>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section class="home-dark-info">
            <div class="wide-inner dark-info-grid">
              <div>
                <div class="section-kicker">Warum Feiermiete?</div>
                <h2>Ein Ansprechpartner für viele Event-Bausteine.</h2>
              </div>
              <div class="dark-info-list">
                <div>
                  <strong>Keine blinde Onlinezahlung</strong>
                  <p>Wir prüfen zuerst Verfügbarkeit, Mietdauer, Lieferort, Aufbau und Kaution.</p>
                </div>
                <div>
                  <strong>Individuelle Pakete</strong>
                  <p>Einzelne Artikel oder Kombinationen passend zu Personenanzahl und Anlass.</p>
                </div>
                <div>
                  <strong>Praktisch geplant</strong>
                  <p>Equipment, Küche, Catering und Logistik werden nicht getrennt gedacht.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="home-products-v2">
            <div class="wide-inner">
              <div class="home-section-head">
                <div>
                  <div class="section-kicker">Beliebte Mietartikel</div>
                  <h2>Ein erster Blick ins Sortiment.</h2>
                </div>
                <p>
                  Das vollständige Sortiment findest du auf der Equipment-Seite.
                  Dort bauen wir nach und nach alle Kategorien und Artikel aus.
                </p>
              </div>

              <div class="home-product-grid">
                ${productCards || "<p>Noch keine Artikel vorhanden.</p>"}
              </div>

              <div class="center-action">
                <a class="button primary" href="/equipment">Gesamtes Equipment ansehen</a>
              </div>
            </div>
          </section>

          <section class="home-process-v2">
            <div class="wide-inner">
              <div class="process-title-v2">
                <div class="section-kicker">Ablauf</div>
                <h2>So funktioniert es.</h2>
                <p>
                  Du fragst an, wir prüfen die passenden Möglichkeiten und erstellen
                  dir ein Angebot mit den relevanten Positionen.
                </p>
              </div>

              <div class="process-cards-v2">
                <article>
                  <span>01</span>
                  <h3>Anfrage senden</h3>
                  <p>Datum, Ort, Personenanzahl, gewünschte Artikel oder Leistungen mitteilen.</p>
                  <ul>
                    <li>Equipment</li>
                    <li>Küche</li>
                    <li>Catering</li>
                  </ul>
                </article>

                <article>
                  <span>02</span>
                  <h3>Angebot erhalten</h3>
                  <p>Wir prüfen Verfügbarkeit, Lieferaufwand, Aufbau, Kaution und Kombinationen.</p>
                  <ul>
                    <li>transparent</li>
                    <li>individuell</li>
                    <li>passend geplant</li>
                  </ul>
                </article>

                <article>
                  <span>03</span>
                  <h3>Feier vorbereiten</h3>
                  <p>Nach Bestätigung werden Lieferung, Aufbau, Rückgabe und Ablauf abgestimmt.</p>
                  <ul>
                    <li>Lieferung</li>
                    <li>Aufbau</li>
                    <li>Abholung</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section class="premium-faq">
            <div class="wide-inner faq-premium-grid">
              <div class="faq-intro">
                <div class="section-kicker">Fragen & Antworten</div>
                <h2>Gut zu wissen.</h2>
                <p>
                  Die wichtigsten Antworten zur Miete von Equipment, Produktionsküche,
                  Catering-Koordination, Lieferung, Aufbau und Kaution.
                </p>

                <div class="faq-note-box">
                  <strong>Deine Frage ist nicht dabei?</strong>
                  <span>Schreib uns einfach, was du planst. Wir melden uns mit einer passenden Empfehlung.</span>
                  <a href="/anfrage">Anfrage senden</a>
                </div>
              </div>

              <div class="faq-list">
                <details>
                  <summary><span>Kann ich auch einzelne Artikel mieten?</span><strong>+</strong></summary>
                  <p>Ja. Einzelne Artikel wie Stehtische, Pavillons, Chafing Dishes, Getränkespender oder Geschirr können angefragt werden.</p>
                </details>

                <details>
                  <summary><span>Bietet ihr Lieferung und Aufbau an?</span><strong>+</strong></summary>
                  <p>Ja. Lieferung, Aufbau und Abholung können je nach Standort, Menge und Zeitfenster angeboten werden.</p>
                </details>

                <details>
                  <summary><span>Kann ich eure Produktionsküche mieten?</span><strong>+</strong></summary>
                  <p>Ja. Die Küche kann stundenweise oder tageweise für Vorbereitung, Produktion oder Eventabwicklung angefragt werden.</p>
                </details>

                <details>
                  <summary><span>Bietet ihr auch Catering an?</span><strong>+</strong></summary>
                  <p>Auf Wunsch koordinieren wir passende Catering-Lösungen, besonders wenn Speisen, Equipment und Logistik zusammen geplant werden sollen.</p>
                </details>

                <details>
                  <summary><span>Gibt es eine Kaution?</span><strong>+</strong></summary>
                  <p>Je nach Artikel, Menge und Mietdauer kann eine Kaution anfallen. Diese wird im Angebot transparent aufgeführt.</p>
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
                  Schreib uns Datum, Ort, Personenanzahl und was du brauchst.
                  Wir empfehlen dir passende Artikel, Services oder eine Komplettlösung.
                </p>
              </div>
              <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
            </div>
          </section>
        </main>

        ${renderFooter()}
      </body>
    </html>
  `;
}
