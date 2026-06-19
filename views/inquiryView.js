export function renderInquiryPage({ products = [], success = false }) {
  const productOptions = products.map((product) => {
    return `<option value="${product.name}">${product.name}</option>`;
  }).join("");

  const successBox = success
    ? `
      <div class="success-box">
        <strong>Anfrage erfolgreich gesendet.</strong>
        <span>Danke! Wir melden uns schnellstmöglich mit einer passenden Rückmeldung.</span>
      </div>
    `
    : "";

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
              <a href="/equipment">Equipment</a>
              <a href="/kueche-mieten">Küche mieten</a>
              <a href="/catering">Catering</a>
              <a href="/services">Services</a>
              <a class="nav-button active" href="/anfrage">Anfrage</a>
            </nav>
          </div>
        </header>

        <main class="inquiry-page">
          <div class="wide-inner inquiry-grid">
            <section class="inquiry-intro">
              <div class="section-kicker">Unverbindliche Anfrage</div>
              <h1>Was brauchst du für deine Feier?</h1>
              <p>
                Statt direkt online zu bezahlen, prüfen wir zuerst Verfügbarkeit, Mietdauer, Lieferort,
                Aufbau, Kaution und mögliche Kombinationen. Danach erhältst du ein passendes Angebot.
              </p>

              <div class="inquiry-benefits">
                <div>
                  <strong>Equipment mieten</strong>
                  <span>Pavillons, Stehtische, Geschirr, Buffet-Zubehör, Küchentechnik und mehr.</span>
                </div>
                <div>
                  <strong>Produktionsküche</strong>
                  <span>Stundenweise oder tageweise für Vorbereitung, Produktion und Eventabwicklung.</span>
                </div>
                <div>
                  <strong>Alles aus einer Hand</strong>
                  <span>Auf Wunsch mit Catering-Koordination, Lieferung, Aufbau und Abholung.</span>
                </div>
              </div>
            </section>

            <section class="inquiry-card">
              ${successBox}

              <form method="POST" action="/anfrage">
                <div class="form-row">
                  <label>Name *</label>
                  <input name="name" placeholder="Dein Name" required />
                </div>

                <div class="form-row">
                  <label>Firma</label>
                  <input name="companyName" placeholder="Firma, falls vorhanden" />
                </div>

                <div class="form-row">
                  <label>E-Mail *</label>
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
                  <label>Ort / Lieferadresse</label>
                  <input name="location" placeholder="z. B. Berlin, Brandenburg oder genaue Adresse" />
                </div>

                <div class="form-row">
                  <label>Personenanzahl</label>
                  <input name="guestCount" placeholder="z. B. 40 Personen" />
                </div>

                <div class="form-row">
                  <label>Art der Anfrage</label>
                  <select name="serviceType">
                    <option value="">Bitte auswählen</option>
                    <option value="Equipment mieten">Equipment mieten</option>
                    <option value="Produktionsküche mieten">Produktionsküche mieten</option>
                    <option value="Catering-Koordination">Catering-Koordination</option>
                    <option value="Lieferung & Aufbau">Lieferung & Aufbau</option>
                    <option value="Komplettpaket">Komplettpaket / Alles aus einer Hand</option>
                  </select>
                </div>

                <div class="form-row">
                  <label>Wunschartikel / Leistung</label>
                  <select name="product">
                    <option value="">Bitte auswählen, falls bekannt</option>
                    ${productOptions}
                    <option value="Produktionsküche">Produktionsküche mieten</option>
                    <option value="Catering-Koordination">Catering-Koordination</option>
                    <option value="Komplettpaket">Komplettpaket / Alles aus einer Hand</option>
                  </select>
                </div>

                <div class="form-row">
                  <label>Lieferung gewünscht?</label>
                  <select name="deliveryNeeded">
                    <option value="">Bitte auswählen</option>
                    <option value="Ja">Ja</option>
                    <option value="Nein, Selbstabholung">Nein, Selbstabholung</option>
                    <option value="Noch unklar">Noch unklar</option>
                  </select>
                </div>

                <div class="form-row">
                  <label>Nachricht</label>
                  <textarea name="message" rows="6" placeholder="Was brauchst du? Mietdauer, Uhrzeit, Ausstattung, Küche, Catering, Aufbau, Besonderheiten usw."></textarea>
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

