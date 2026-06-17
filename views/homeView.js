import { renderServicesSection } from "./sections/servicesSection.js";
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
        <style>
          :root {
            --red: #c70012;
            --red-dark: #9d000d;
            --dark: #141414;
            --text: #242424;
            --muted: #686868;
            --cream: #f4efe8;
            --soft: #fbf8f3;
            --line: rgba(20,20,20,0.09);
            --shadow: 0 24px 70px rgba(0,0,0,0.08);
          }

          * { box-sizing: border-box; }

          html { scroll-behavior: smooth; }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: var(--cream);
            color: var(--text);
          }

          a { color: inherit; }

          .topbar {
            background: #8c8c8c;
            color: white;
            font-size: 12px;
            letter-spacing: 0.04em;
            padding: 9px 56px;
          }

          .topbar-inner {
            max-width: 1520px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            gap: 34px;
            flex-wrap: wrap;
          }

          header {
            background: rgba(255,255,255,0.96);
            backdrop-filter: blur(18px);
            border-bottom: 1px solid var(--line);
            position: sticky;
            top: 0;
            z-index: 50;
          }

          .header-inner {
            max-width: 1520px;
            margin: 0 auto;
            padding: 24px 56px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 30px;
          }

          .brand {
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .brand-main {
            color: var(--red);
            font-size: 34px;
            line-height: 0.9;
            font-weight: 900;
            letter-spacing: -0.05em;
          }

          .brand-main::before {
            content: "";
            display: inline-block;
            width: 3px;
            height: 34px;
            background: var(--red);
            margin-right: 14px;
            transform: translateY(5px);
          }

          .brand-sub {
            margin-top: 8px;
            margin-left: 17px;
            color: #565656;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
          }

          nav {
            display: flex;
            align-items: center;
            gap: 30px;
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          nav a { text-decoration: none; }

          .nav-button {
            background: var(--red);
            color: white;
            padding: 14px 22px;
            border-radius: 2px;
            box-shadow: 0 16px 34px rgba(199,0,18,0.22);
          }

          .hero {
            position: relative;
            overflow: hidden;
            background:
              linear-gradient(90deg, rgba(244,239,232,0.98) 0%, rgba(244,239,232,0.88) 52%, rgba(244,239,232,0.56) 100%),
              radial-gradient(circle at 86% 20%, rgba(199,0,18,0.13), transparent 33%),
              linear-gradient(135deg, #fff 0%, #eee4da 100%);
          }

          .hero::before {
            content: "";
            position: absolute;
            right: -130px;
            top: 80px;
            width: 620px;
            height: 620px;
            border: 1px solid rgba(199,0,18,0.18);
            transform: rotate(35deg);
          }

          .hero::after {
            content: "";
            position: absolute;
            right: 40px;
            bottom: -110px;
            width: 250px;
            height: 250px;
            background: rgba(255,255,255,0.56);
            border: 1px solid rgba(255,255,255,0.9);
            transform: rotate(35deg);
          }

          .hero-inner {
            max-width: 1520px;
            margin: 0 auto;
            padding: 104px 56px 112px;
            position: relative;
            z-index: 2;
          }

          .hero-content {
            max-width: 760px;
          }

          .eyebrow {
            display: flex;
            align-items: center;
            gap: 13px;
            color: var(--red);
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            margin-bottom: 30px;
          }

          .eyebrow::before {
            content: "";
            width: 54px;
            height: 3px;
            background: var(--red);
          }

          h1 {
            margin: 0;
            color: var(--dark);
            font-size: clamp(56px, 6.6vw, 100px);
            line-height: 0.92;
            letter-spacing: -0.075em;
            text-transform: uppercase;
          }

          h1 span {
            display: block;
            color: var(--red);
          }

          .hero-text {
            max-width: 660px;
            margin: 30px 0 0;
            color: #3d3d3d;
            font-size: 21px;
            line-height: 1.55;
          }

          .actions {
            margin-top: 36px;
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
          }

          .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 54px;
            padding: 0 25px;
            text-decoration: none;
            font-weight: 900;
            border-radius: 2px;
            border: 2px solid var(--dark);
            background: white;
          }

          .button.primary {
            background: var(--red);
            border-color: var(--red);
            color: white;
            box-shadow: 0 16px 34px rgba(199,0,18,0.22);
          }

          .trust-row {
            background: white;
            border-top: 1px solid var(--line);
            border-bottom: 1px solid var(--line);
          }

          .trust-inner {
              grid-template-columns: 1fr 1fr;
            }

            .catering-section {
              padding-left: 22px;
              padding-right: 22px;
            }

            .catering-card {
              padding: 34px 24px;
            }

            .catering-points {
              grid-template-columns: 1fr;
            }

            .section-head,
            .cta-inner {
              display: block;
            }

            .section-head p {
              margin-top: 16px;
            }

            .brand-main {
              font-size: 30px;
            }
          }
        </style>
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
              <a href="#equipment">Equipment</a><a href="#services">Services</a>
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

          <section class="catering-section">
            <div class="catering-inner">
              <div class="catering-card">
                <div class="section-kicker">Catering & Eventservice</div>
                <h2>Alles aus einer Hand.</h2>
                <p>
                  Neben Equipment unterstützen wir dich auf Wunsch auch bei passenden Catering-Lösungen. 
                  Wir arbeiten mit erfahrenen Cateringfirmen zusammen und können Equipment, Lieferung, Aufbau 
                  und Speisen sinnvoll miteinander koordinieren.
                </p>

                <div class="catering-points">
                  <div>
                    <strong>Für Privatfeiern</strong>
                    <span>Geburtstage, Gartenfeiern, Hochzeiten und Familienfeiern.</span>
                  </div>
                  <div>
                    <strong>Für Firmen</strong>
                    <span>Sommerfeste, Teamevents, Buffets, Empfänge und Business-Events.</span>
                  </div>
                  <div>
                    <strong>Ein Ansprechpartner</strong>
                    <span>Equipment, Catering und Ablauf können gemeinsam geplant werden.</span>
                  </div>
                </div>

                <a class="button primary" href="/anfrage">Event anfragen</a>
              </div>
            </div>
          </section>

          ${renderServicesSection()}
          ${renderWhySection()}
          ${renderCateringSection()}
          ${renderLogisticsSection()}
          ${renderPriceModelSection()}
          ${renderFaqSection()}

          <section class="cta">
            <div class="cta-inner">
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






