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
    { name: "Chafing Dish", category: { name: "Buffet & Warmhalten" }, description: "Warmhaltebehälter für Buffets, Catering und Events.", priceCents: 950, imageUrl: "/public/images/catering-photo.svg" },
    { name: "Stehtisch", category: { name: "Tische & Sitzmöbel" }, description: "Klapptisch für Empfang, Gartenfeier oder Firmenveranstaltung.", priceCents: 1200, imageUrl: "/public/images/equipment-photo.svg" },
    { name: "Geschirr-Set", category: { name: "Geschirr & Besteck" }, description: "Teller, Besteck, Gläser und Serviermaterial für dein Event.", priceCents: 250, imageUrl: "/public/images/kitchen-photo.svg" },
    { name: "Getränkespender", category: { name: "Getränke-Equipment" }, description: "Für Wasser, Limonade, Eistee oder Infused Water.", priceCents: 1000, imageUrl: "/public/images/catering-photo.svg" }
  ];

  const visibleProducts = products.length ? products.slice(0, 4) : fallbackProducts;

  const productCards = visibleProducts.map((product) => {
    const price = formatPrice(product);
    return `
      <article class="compact-product">
        <div class="compact-product-image">
          <img src="${product.imageUrl || "/public/images/equipment-photo.svg"}" alt="${product.name}" />
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
                Feiermiete kombiniert hochwertiges Leih-Equipment, Produktionsküche,
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
              <img src="/public/images/hero-event.svg" alt="Event mit Pavillon und gedeckten Tischen" />
              <div class="fm-hero-card">
                <strong>Unverbindlich anfragen</strong>
                <span>Wir prüfen Verfügbarkeit, Lieferung, Aufbau und Kaution vor dem Angebot.</span>
              </div>
            </div>
          </section>

          <section class="fm-service-strip">
            <article>
              <img src="/public/images/equipment-photo.svg" alt="Equipment" />
              <div>
                <span>01 Equipment</span>
                <h3>Event-Equipment mieten</h3>
                <p>Pavillons, Stehtische, Geschirr, Chafing Dishes, Getränkespender und mehr.</p>
              </div>
            </article>

            <article>
              <img src="/public/images/kitchen-photo.svg" alt="Küche" />
              <div>
                <span>02 Küche</span>
                <h3>Produktionsküche nutzen</h3>
                <p>Professionelle Küche stundenweise oder tageweise mieten.</p>
              </div>
            </article>

            <article>
              <img src="/public/images/catering-photo.svg" alt="Catering" />
              <div>
                <span>03 Catering</span>
                <h3>Catering koordinieren</h3>
                <p>Buffets, Fingerfood, Speisen, Equipment und Logistik gemeinsam planen.</p>
              </div>
            </article>

            <article>
              <img src="/public/images/service-photo.svg" alt="Services" />
              <div>
                <span>04 Services</span>
                <h3>Lieferung & Aufbau</h3>
                <p>Lieferung, Aufbau, Abholung und praktische Event-Unterstützung.</p>
              </div>
            </article>
          </section>

          <section class="fm-products-why">
            <div class="fm-products-left">
              <div class="small-red">Beliebte Mietartikel</div>
              <h2>Ein erster Blick ins Sortiment.</h2>
              <p>Das vollständige Sortiment findest du auf der Equipment-Seite mit allen Kategorien und Artikeln.</p>
              <a class="button primary" href="/equipment">Gesamtes Equipment ansehen</a>
            </div>

            <div class="fm-product-list">
              ${productCards}
            </div>

            <aside class="fm-why-box">
              <div class="small-red">Warum Feiermiete?</div>
              <h2>Ein Ansprechpartner. Viele Event-Bausteine.</h2>
              <ul>
                <li><strong>Keine direkte Online-Zahlung</strong><span>Wir prüfen Verfügbarkeit, Lieferung, Aufbau und Kaution.</span></li>
                <li><strong>Individuelle Pakete</strong><span>Passend zu Personenanzahl, Anlass und Budget.</span></li>
                <li><strong>Persönlich koordiniert</strong><span>Von Anfrage bis Rückgabe praktisch abgestimmt.</span></li>
              </ul>
              <img src="/public/images/advisor-photo.svg" alt="Beratung" />
            </aside>
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
        </main>

        ${renderFooter()}
      </body>
    </html>
  `;
}
