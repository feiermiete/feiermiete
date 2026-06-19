function getProductImage(product) {
  const name = (product.name || "").toLowerCase();

  if (name.includes("buffet")) return "/public/images/catering-photo.jpg";
  if (name.includes("geschirr") || name.includes("besteck")) return "/public/images/cutlery-set.jpg";
  if (name.includes("glühwein") || name.includes("gluehwein")) return "/public/images/drinks-dispenser.jpg";
  if (name.includes("getränkespender") || name.includes("getraenkespender")) return "/public/images/drinks-dispenser.jpg";
  if (name.includes("chafing")) return "/public/images/catering-photo.jpg";
  if (name.includes("stehtisch")) return "/public/images/equipment-photo.jpg";
  if (name.includes("pavillon")) return "/public/images/equipment-photo.jpg";

  return "/public/images/equipment-photo.jpg";
}
function formatPrice(product) {
  if (!product.priceCents) return "auf Anfrage";
  return (product.priceCents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

function renderHeader() {
  return `
    <header class="site-header clean-header">
      <div class="header-inner">
        <a class="brand" href="/">
          <div class="brand-main">Feiermiete</div>
          <div class="brand-sub">Equipment für Feiern & Events</div>
        </a>

        <nav>
          <a class="active" href="/">Home</a>
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
    <footer class="footer-v2">
      <div class="wide-inner footer-top-process">
        <div>
          <span>01</span>
          <strong>Anfrage senden</strong>
          <p>Beschreibe kurz dein Event und deine Wünsche.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Angebot erhalten</strong>
          <p>Du bekommst ein individuelles Angebot mit passenden Leistungen.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Feier vorbereiten</strong>
          <p>Wir unterstützen dich bei Lieferung, Aufbau und Ablauf.</p>
        </div>
      </div>

      <div class="wide-inner footer-main-grid">
        <div>
          <h4>Kontakt</h4>
          <p>Feiermiete<br>Berlin & Brandenburg</p>
          <p>info@feiermiete.de</p>
        </div>

        <div>
          <h4>Navigation</h4>
          <a href="/">Home</a>
          <a href="/equipment">Equipment</a>
          <a href="/kueche-mieten">Küche mieten</a>
          <a href="/catering">Catering</a>
          <a href="/services">Services</a>
        </div>

        <div>
          <h4>Leistungen</h4>
          <a href="/equipment">Equipmentverleih</a>
          <a href="/kueche-mieten">Küchenvermietung</a>
          <a href="/catering">Catering-Koordination</a>
          <a href="/services">Lieferung & Aufbau</a>
        </div>

        <div>
          <h4>Rechtliches</h4>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="/agb">AGB</a>
        </div>

        <div class="footer-brand">
          <strong>Feiermiete</strong>
          <span>Equipment für Feiern & Events</span>
        </div>
      </div>
    </footer>
  `;
}

export function renderHomePage({ products = [] }) {
  const fallbackProducts = [
    { name: "Chafing Dish", category: { name: "Buffet & Warmhalten" }, description: "Warmhaltebehälter für Buffets, Catering und Events.", priceCents: 950, imageUrl: "/public/images/catering-photo.jpg" },
    { name: "Stehtisch", category: { name: "Tische & Sitzmöbel" }, description: "Klapptisch für Empfang, Gartenfeier oder Firmenveranstaltung.", priceCents: 1200, imageUrl: "/public/images/equipment-photo.jpg" },
    { name: "Geschirr-Set", category: { name: "Geschirr & Besteck" }, description: "Teller, Besteck, Gläser und Serviermaterial für dein Event.", priceCents: 250, imageUrl: "/public/images/gastro-kitchen.jpg" },
    { name: "Getränkespender", category: { name: "Getränke-Equipment" }, description: "Für Wasser, Limonade, Eistee oder Infused Water.", priceCents: 1000, imageUrl: "/public/images/catering-photo.jpg" }
  ];

  const visibleProducts = products.length ? products.slice(0, 4) : fallbackProducts;

  const productCards = visibleProducts.map((product) => {
    const price = formatPrice(product);
    return `
      <article class="compact-product">
        <div class="compact-product-image">
          <img src="${getProductImage(product)}" alt="${product.name}" />
        </div>
        <div class="compact-product-body">
          <div class="small-red">${product.category?.name || "Mietartikel"}</div>
          <h3>${product.name}</h3>
          <p>${product.description || "Mietartikel für Feiern, Events, Buffets und Catering."}</p>
          <div class="compact-product-row">
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
          <section class="fm-hero">
            <div class="fm-hero-text">
              <div class="section-kicker">Equipment · Küche · Catering · Eventservice</div>
              <h1>Alles für deine Feier. Einfach mieten, planen, anfragen.</h1>
              <p>
                Feiermiete kombiniert hochwertiges Leih-Equipment, Gastro-Küche,
                Catering-Koordination, Lieferung und Aufbau für private Feiern,
                Firmenevents, Buffets und Veranstaltungen in Berlin & Brandenburg.
              </p>

              <div class="fm-hero-actions">
                <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
                <a class="button secondary" href="/equipment">Equipment ansehen</a>
              </div>

              <div class="fm-facts">
                <div><strong>Berlin & Brandenburg</strong><span>Lieferung nach Absprache</span></div>
                <div><strong>Privat & Firma</strong><span>Feiern, Events, Buffets</span></div>
                <div><strong>Flexibel</strong><span>Einzelartikel oder Paket</span></div>
              </div>
            </div>

            <div class="fm-hero-image">
              <img src="/public/images/hero-event.jpg" alt="Event mit Pavillon und gedeckten Tischen" />
              <div class="fm-hero-card">
                <strong>Unverbindlich anfragen</strong>
                <span>Wir prüfen Verfügbarkeit, Lieferung, Aufbau und Kaution vor dem Angebot.</span>
              </div>
            </div>
          </section>

          <section class="fm-service-strip">
            <article>
              <img src="/public/images/equipment-photo.jpg" alt="Equipment" />
              <div>
                <span>01 Equipment</span>
                <h3>Event-Equipment mieten</h3>
                <p>Pavillons, Stehtische, Geschirr, Chafing Dishes, Getränkespender und mehr.</p>
              </div>
            </article>

            <article>
              <img src="/public/images/gastro-kitchen.jpg" alt="Küche" />
              <div>
                <span>02 Küche</span>
                <h3>Gastro-Küche mieten</h3>
                <p>Professionell ausgestattete Gastro-Küche für Caterer, Vorproduktion, Pop-ups, Food-Start-ups und größere Produktionen.</p>
              </div>
            </article>

            <article>
              <img src="/public/images/catering-photo.jpg" alt="Catering" />
              <div>
                <span>03 Catering</span>
                <h3>Catering koordinieren</h3>
                <p>Buffets, Fingerfood, Speisen, Equipment und Logistik gemeinsam planen.</p>
              </div>
            </article>

            <article>
              <img src="/public/images/equipment-photo.jpg" alt="Services" />
              <div>
                <span>04 Services</span>
                <h3>Lieferung & Aufbau</h3>
                <p>Lieferung, Aufbau, Abholung und praktische Event-Unterstützung.</p>
              </div>
            </article>
          </section>

          <section class="fm-products-board">
  <div class="wide-inner fm-products-board-grid">
    <div class="fm-products-board-intro">
      <div class="small-red">Beliebte Mietartikel</div>
      <h2>Ein erster Blick ins Sortiment.</h2>
      <p>
        Das vollständige Sortiment findest du auf der Equipment-Seite.
        Dort bauen wir nach und nach alle Kategorien und Artikel aus.
      </p>
      <a class="button primary" href="/equipment">Gesamtes Equipment ansehen</a>
    </div>

    <div class="fm-board-product-list">
      ${productCards}
    </div>

    <aside class="fm-board-why">
      <div class="small-red">Warum Feiermiete?</div>
      <h3>Ein Ansprechpartner. Viele Event-Bausteine.</h3>

      <ul>
        <li>
          <strong>Keine direkte Online-Zahlung</strong>
          <span>Wir prüfen Verfügbarkeit, Lieferung, Aufbau und Kaution vor dem Angebot.</span>
        </li>
        <li>
          <strong>Individuelle Pakete</strong>
          <span>Passend zu Personenanzahl, Anlass, Mietdauer und Budget.</span>
        </li>
        <li>
          <strong>Persönlich koordiniert</strong>
          <span>Von Anfrage bis Rückgabe praktisch abgestimmt.</span>
        </li>
      </ul>
    </aside>
  </div>
</section>
<section class="fm-dark-process">
            <div class="wide-inner fm-dark-grid">
              <div>
                <div class="small-red">So funktioniert es</div>
                <h2>In 3 einfachen Schritten.</h2>
              </div>
              <div>
                <span>1</span>
                <strong>Anfrage senden</strong>
                <p>Beschreibe Event, Datum, Ort und gewünschte Leistungen.</p>
              </div>
              <div>
                <span>2</span>
                <strong>Angebot erhalten</strong>
                <p>Wir prüfen Aufwand, Lieferung, Kaution und Verfügbarkeit.</p>
              </div>
              <div>
                <span>3</span>
                <strong>Feier vorbereiten</strong>
                <p>Nach Bestätigung stimmen wir Aufbau, Rückgabe und Ablauf ab.</p>
              </div>
              <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
            </div>
          </section>

          <section class="fm-detail-section">
            <div class="wide-inner fm-detail-grid">
              <div>
                <div class="small-red">Für welche Events?</div>
                <h2>Von der kleinen Gartenfeier bis zum Firmenevent.</h2>
                <p>
                  Feiermiete ist für alle gedacht, die nicht nur einen einzelnen Artikel suchen,
                  sondern eine praktische Lösung für ihr Event brauchen. Du kannst einzelne Mietartikel
                  anfragen oder mehrere Leistungen miteinander kombinieren.
                </p>
              </div>

              <div class="fm-detail-list">
                <div>
                  <strong>Private Feiern</strong>
                  <span>Geburtstage, Gartenfeiern, Hochzeiten, Einschulungen und Familienfeiern.</span>
                </div>
                <div>
                  <strong>Firmenevents</strong>
                  <span>Sommerfeste, Teamevents, Empfänge, Business-Lunches und Firmenbuffets.</span>
                </div>
                <div>
                  <strong>Catering & Buffet</strong>
                  <span>Chafing Dishes, Geschirr, Buffet-Tische, Getränkespender und Warmhaltung.</span>
                </div>
                <div>
                  <strong>Produktion & Küche</strong>
                  <span>Gastro-Küche für Vorbereitung, Produktion, Catering, Pop-ups und größere Mengen.</span>
                </div>
              </div>
            </div>
          </section>

          <section class="fm-package-section">
            <div class="wide-inner">
              <div class="fm-section-center">
                <div class="small-red">Pakete statt Chaos</div>
                <h2>Du sagst uns, was du planst. Wir denken mit.</h2>
                <p>
                  Statt blind online zu bezahlen, erhältst du ein Angebot, das wirklich zu deinem Event passt:
                  mit Mietdauer, Lieferung, Aufbau, Kaution, Rückgabe und passenden Zusatzleistungen.
                </p>
              </div>

              <div class="fm-package-grid">
                <article>
                  <strong>Basic</strong>
                  <h3>Nur Equipment</h3>
                  <p>Für Selbstabholer oder einfache Events mit klaren Artikeln.</p>
                  <ul>
                    <li>Einzelartikel</li>
                    <li>Mietdauer nach Absprache</li>
                    <li>Kaution je nach Artikel</li>
                  </ul>
                </article>

                <article>
                  <strong>Plus</strong>
                  <h3>Equipment mit Lieferung</h3>
                  <p>Für Events, bei denen Artikel geliefert und später abgeholt werden sollen.</p>
                  <ul>
                    <li>Lieferung möglich</li>
                    <li>Aufbau nach Absprache</li>
                    <li>Rückgabe organisiert</li>
                  </ul>
                </article>

                <article>
                  <strong>Komplett</strong>
                  <h3>Eventlösung</h3>
                  <p>Für Feiern mit Equipment, Küche, Catering-Koordination und Service.</p>
                  <ul>
                    <li>Alles aus einer Hand</li>
                    <li>individuelles Angebot</li>
                    <li>ein Ansprechpartner</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section class="fm-faq-section">
            <div class="wide-inner fm-faq-grid">
              <div>
                <div class="small-red">Fragen & Antworten</div>
                <h2>Gut zu wissen.</h2>
                <p>
                  Die wichtigsten Antworten zu Equipment, Küche, Catering, Lieferung, Aufbau und Kaution.
                </p>
              </div>

              <div class="fm-faq-list">
                <details>
                  <summary>Kann ich einzelne Artikel mieten?</summary>
                  <p>Ja. Du kannst einzelne Artikel wie Stehtische, Pavillons, Chafing Dishes, Geschirr oder Getränkespender anfragen.</p>
                </details>

                <details>
                  <summary>Bietet ihr Lieferung und Aufbau an?</summary>
                  <p>Ja. Lieferung, Aufbau und Abholung können je nach Standort, Menge und Zeitfenster angeboten werden.</p>
                </details>

                <details>
                  <summary>Kann ich die Gastro-Küche mieten?</summary>
                  <p>Ja. Die Küche kann stundenweise oder tageweise für Vorbereitung, Produktion oder Eventabwicklung angefragt werden.</p>
                </details>

                <details>
                  <summary>Warum keine direkte Onlinezahlung?</summary>
                  <p>Weil Verfügbarkeit, Mietdauer, Lieferort, Aufbau, Kaution und Rückgabe vorher geprüft werden müssen.</p>
                </details>
              </div>
            </div>
          </section>

          <section class="fm-final-cta">
            <div class="wide-inner fm-final-grid">
              <div>
                <div class="small-red">Anfrage</div>
                <h2>Du planst eine Feier?</h2>
                <p>
                  Schreib uns Datum, Ort, Personenanzahl und was du brauchst.
                  Wir melden uns mit einer passenden Empfehlung und einem Angebot.
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













