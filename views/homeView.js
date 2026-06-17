import { renderServicesSection } from "./sections/servicesSection.js";
import { renderKitchenRentalSection } from "./sections/kitchenRentalSection.js";
import { renderWhySection } from "./sections/whySection.js";
import { renderCateringSection } from "./sections/cateringSection.js";
import { renderLogisticsSection } from "./sections/logisticsSection.js";
import { renderPriceModelSection } from "./sections/priceModelSection.js";
import { renderFaqSection } from "./sections/faqSection.js";

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
  const productCards = products.map((product) => {
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
        <title>Feiermiete - Equipment für Feiern & Events mieten</title>
        <link rel="stylesheet" href="/public/css/style.css" />
      </head>

      <body>
        <div class="topbar">
          <div class="topbar-inner">
            <span>Berlin & Brandenburg</span>
            <span>Privatfeiern</span>
            <span>Firmenevents</span>
            <span>Hochzeiten</span>
            <span>Catering-Zubehör</span>
          </div>
        </div>

        <header>
          <div class="header-inner">
            <a class="brand" href="/">
              <div class="brand-main">Feiermiete</div>
              <div class="brand-sub">Equipment für Feiern & Events</div>
            </a>

            <nav>
              <a href="/">Home</a>
              <a href="#equipment">Equipment</a><a href="#kueche">Küche mieten</a>
              <a href="#services">Services</a>
              <a href="/admin">Admin</a>
              <a class="nav-button" href="/anfrage">Anfrage</a>
            </nav>
          </div>
        </header>

        <main>
          <section class="hero">
            <div class="hero-inner">
              <div class="hero-content">
                <div class="eyebrow">Event- & Partyequipment mieten</div>
                <h1>Sie feiern.<span>Wir liefern.</span></h1>
                <p class="hero-text">
                  Pavillons, Stehtische, Bierzeltgarnituren, Geschirr, Buffet-Equipment und Zubehör für Geburtstage, Gartenfeiern, Hochzeiten und Firmenveranstaltungen.
                </p>
                <div class="actions">
                  <a class="button primary" href="/anfrage">Unverbindlich anfragen</a>
                  <a class="button" href="#equipment">Equipment ansehen</a>
                </div>
              </div>
            </div>
          </section>

          <section class="trust-row">
            <div class="trust-inner">
              <div class="trust-item"><div class="trust-icon">✓</div> Zuverlässige Lieferung</div>
              <div class="trust-item"><div class="trust-icon">✓</div> Für Privat & Firma</div>
              <div class="trust-item"><div class="trust-icon">✓</div> Flexible Pakete</div>
              <div class="trust-item"><div class="trust-icon">✓</div> Berlin & Umgebung</div>
            </div>
          </section>

          <section class="section" id="equipment">
            <div class="section-inner">
              <div class="section-head">
                <div>
                  <div class="section-kicker">Mietartikel</div>
                  <h2>Beliebtes Equipment</h2>
                </div>
                <p>
                  Wähle einzelne Artikel oder kombiniere mehrere Produkte zu einem passenden Paket für deine Feier.
                </p>
              </div>

              <div class="product-grid">
                ${productCards || "<p>Noch keine Produkte eingetragen.</p>"}
              </div>
            </div>
          </section>

          ${renderKitchenRentalSection()}
          ${renderServicesSection()}
          ${renderWhySection()}
          ${renderCateringSection()}
          ${renderLogisticsSection()}
          ${renderPriceModelSection()}
          ${renderFaqSection()}

          <section class="cta">
            <div class="cta-inner wide-inner">
              <div>
                <div class="section-kicker">Anfrage</div>
                <h2>Du planst eine Feier?</h2>
                <p>
                  Schick uns Datum, Ort und gewünschtes Equipment. Wir melden uns mit einer passenden Empfehlung und einem Angebot.
                </p>
              </div>
              <div>
                <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div class="footer-inner">
            <strong>Feiermiete</strong>
            <span>Equipment für Feiern & Events · Berlin & Brandenburg</span>
          </div>
        </footer>
      </body>
    </html>
  `;
}




