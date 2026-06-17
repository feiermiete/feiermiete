export function renderInquiryPage({ products = [] }) {
  const productOptions = products.map((product) => {
    return `<option value="${product.name}">${product.name}</option>`;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Anfrage senden - Feiermiete</title>
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
              <a href="/#equipment">Equipment</a>
              <a href="/#kueche">Küche mieten</a>
              <a href="/#catering">Catering</a>
              <a href="/#services">Services</a>
              <a class="nav-button" href="/anfrage">Anfrage</a>
            </nav>
          </div>
        </header>

        <main class="inquiry-page">
          <div class="wide-inner inquiry-grid">
            <section class="inquiry-intro">
              <div class="section-kicker">Anfrage</div>
              <h1>Was planst du?</h1>
              <p>
                Schreib uns kurz, was du brauchst. Wir melden uns mit einer passenden Empfehlung
                für Equipment, Küche, Catering-Koordination oder Lieferung.
              </p>

              <div class="inquiry-benefits">
                <div>
                  <strong>Equipment</strong>
                  <span>Pavillons, Stehtische, Geschirr, Buffet-Zubehör und mehr.</span>
                </div>
                <div>
                  <strong>Küche mieten</strong>
                  <span>Produktionsküche stundenweise oder tageweise anfragen.</span>
                </div>
                <div>
                  <strong>Alles aus einer Hand</strong>
                  <span>Auf Wunsch mit Catering-Koordination und Lieferung.</span>
                </div>
              </div>
            </section>

            <section class="inquiry-card">
              <form method="POST" action="/anfrage">
                <div class="form-row">
                  <label>Name</label>
                  <input name="name" placeholder="Dein Name" required />
                </div>

                <div class="form-row">
                  <label>E-Mail</label>
                  <input name="email" type="email" placeholder="deine@email.de" required />
                </div>

                <div class="form-row">
                  <label>Telefon</label>
                  <input name="phone" placeholder="Telefonnummer" />
                </div>

                <div class="form-row">
                  <label>Eventdatum</label>
                  <input name="eventDate" placeholder="z. B. 24.08.2026" />
                </div>

                <div class="form-row">
                  <label>Ort</label>
                  <input name="location" placeholder="z. B. Berlin, Brandenburg, Location-Adresse" />
                </div>

                <div class="form-row">
                  <label>Wunschartikel</label>
                  <select name="product">
                    <option value="">Bitte auswählen, falls bekannt</option>
                    ${productOptions}
                    <option value="Produktionsküche">Produktionsküche mieten</option>
                    <option value="Catering-Koordination">Catering-Koordination</option>
                    <option value="Komplettpaket">Komplettpaket / Alles aus einer Hand</option>
                  </select>
                </div>

                <div class="form-row">
                  <label>Nachricht</label>
                  <textarea name="message" rows="6" placeholder="Was brauchst du? Personenanzahl, Zeitraum, Lieferung, Aufbau, Küche, Catering usw."></textarea>
                </div>

                <button class="button primary" type="submit">Anfrage senden</button>
              </form>
            </section>
          </div>
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
