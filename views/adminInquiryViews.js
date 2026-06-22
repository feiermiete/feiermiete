export function renderAdminInquiryDetail(inquiry) {
  const euro = (cents) => {
    const value = Number(cents || 0) / 100;
    return value.toFixed(2);
  };

  const safe = (value) => value || "";

  return renderAdminLayout("Anfrage bearbeiten", `
    <div class="admin-page-head">
      <div>
        <p class="admin-kicker">Anfrage bearbeiten</p>
        <h1>Anfrage #${inquiry.id}</h1>
        <p>Prüfe Kundendaten, kalkuliere Mietpreis, Kaution und Lieferung und erstelle anschließend den Vertrag.</p>
      </div>

      <div class="admin-actions">
        <a class="admin-button secondary" href="/admin/inquiries">Zurück zu Anfragen</a>
        <a class="admin-button" href="/admin/inquiries/${inquiry.id}/contract" target="_blank">Vertrag öffnen</a>
      </div>
    </div>

    <div class="admin-detail-grid">
      <section class="admin-card">
        <h2>Kundendaten</h2>

        <div class="admin-info-list">
          <div><span>Name</span><strong>${safe(inquiry.name)}</strong></div>
          <div><span>E-Mail</span><strong>${safe(inquiry.email)}</strong></div>
          <div><span>Telefon</span><strong>${safe(inquiry.phone)}</strong></div>
          <div><span>Eventdatum</span><strong>${safe(inquiry.eventDate)}</strong></div>
          <div><span>Ort</span><strong>${safe(inquiry.location)}</strong></div>
          <div><span>Status</span><strong>${safe(inquiry.status || "OPEN")}</strong></div>
        </div>
      </section>

      <section class="admin-card">
        <h2>Anfrage / Produkte</h2>
        <pre class="admin-message-box">${safe(inquiry.message)}</pre>
      </section>
    </div>

    <form class="admin-card admin-form" method="POST" action="/admin/inquiries/${inquiry.id}/update">
      <h2>Kalkulation & Bearbeitung</h2>

      <div class="form-grid">
        <div class="form-row">
          <label>Status</label>
          <select name="status">
            ${["OPEN", "ANGEBOT", "GEBUCHT", "ABGELEHNT", "ERLEDIGT"].map((status) => `
              <option value="${status}" ${inquiry.status === status ? "selected" : ""}>${status}</option>
            `).join("")}
          </select>
        </div>

        <div class="form-row">
          <label>Mietpreis gesamt in Euro</label>
          <input name="rentalTotalEuro" type="number" step="0.01" value="${euro(inquiry.rentalTotalCents)}" />
        </div>

        <div class="form-row">
          <label>Kaution gesamt in Euro</label>
          <input name="depositTotalEuro" type="number" step="0.01" value="${euro(inquiry.depositTotalCents)}" />
        </div>

        <div class="form-row">
          <label>Lieferkosten in Euro</label>
          <input name="deliveryFeeEuro" type="number" step="0.01" value="${euro(inquiry.deliveryFeeCents)}" />
        </div>

        <div class="form-row full">
          <label>Interne Notiz</label>
          <textarea name="adminNote" rows="6">${safe(inquiry.adminNote)}</textarea>
        </div>
      </div>

      <button class="admin-button" type="submit">Anfrage speichern</button>
    </form>
  `);
}

function renderAdminLayout(title, content) {
  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title} - Feiermiete Admin</title>
        <link rel="stylesheet" href="/public/css/style.css" />
      </head>
      <body>
        <div class="admin-shell">
          <aside class="admin-sidebar">
            <div class="admin-brand">
              <strong>Feiermiete</strong>
              <span>Admin Bereich</span>
            </div>

            <nav>
              <a href="/admin">Dashboard</a>
              <a href="/admin/products">Equipment verwalten</a>
              <a href="/admin/products/new">Equipment hinzufügen</a>
              <a href="/admin/inquiries">Anfragen</a>
              <a href="/">Website ansehen</a>
            </nav>

            <form method="POST" action="/admin/logout">
              <button type="submit">Ausloggen</button>
            </form>
          </aside>

          <main class="admin-main">
            ${content}
          </main>
        </div>
      </body>
    </html>
  `;
}

export function renderInquiryContract(inquiry) {
  const formatMoney = (cents) => {
    const value = Number(cents || 0) / 100;
    return value.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
  };

  const safe = (value) => value || "____________________________";

  const rentalTotal = Number(inquiry.rentalTotalCents || 0);
  const deliveryFee = Number(inquiry.deliveryFeeCents || 0);
  const depositTotal = Number(inquiry.depositTotalCents || 0);
  const totalWithoutDeposit = rentalTotal + deliveryFee;
  const totalWithDeposit = rentalTotal + deliveryFee + depositTotal;

  const today = new Date().toLocaleDateString("de-DE");

  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <title>Mietvertrag Anfrage ${inquiry.id}</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            color: #111;
            margin: 0;
            padding: 40px;
            line-height: 1.5;
            background: #fff;
          }

          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d40016;
            color: #fff;
            border: 0;
            padding: 14px 22px;
            font-weight: 800;
            cursor: pointer;
          }

          .top {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            border-bottom: 4px solid #111;
            padding-bottom: 24px;
            margin-bottom: 34px;
          }

          .brand {
            color: #d40016;
            font-weight: 900;
            font-size: 34px;
            line-height: 1;
          }

          .sub {
            text-transform: uppercase;
            letter-spacing: .18em;
            font-size: 11px;
            margin-top: 6px;
          }

          h1 {
            font-size: 34px;
            margin: 0 0 8px;
          }

          h2 {
            font-size: 20px;
            margin-top: 34px;
            border-bottom: 2px solid #111;
            padding-bottom: 8px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
          }

          th,
          td {
            border: 1px solid #ddd;
            padding: 11px;
            vertical-align: top;
          }

          th {
            background: #f4f1ec;
            text-align: left;
            width: 32%;
          }

          .cost-table th {
            width: auto;
          }

          .note {
            background: #f7f3ee;
            padding: 16px;
            border-left: 4px solid #d40016;
          }

          pre {
            white-space: pre-wrap;
            font-family: Arial, sans-serif;
            background: #f7f3ee;
            padding: 16px;
            border: 1px solid #e8e1d8;
          }

          .terms p {
            margin: 0 0 12px;
          }

          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            margin-top: 70px;
          }

          .line {
            border-top: 1px solid #111;
            padding-top: 8px;
            min-height: 60px;
          }

          .small {
            color: #555;
            font-size: 13px;
          }

          @media print {
            body {
              padding: 22px;
            }

            .print-button {
              display: none;
            }
          }
        </style>
      </head>

      <body>
        <button class="print-button" onclick="window.print()">Drucken / PDF speichern</button>

        <div class="top">
          <div>
            <div class="brand">Feiermiete</div>
            <div class="sub">Equipment für Feiern & Events</div>
          </div>

          <div>
            <strong>Mietvertrag / Auftragsbestätigung</strong><br>
            Anfrage-Nr.: ${inquiry.id}<br>
            Erstellt am: ${today}<br>
            Status: ${safe(inquiry.status || "OPEN")}
          </div>
        </div>

        <h1>Mietvertrag</h1>
        <p>
          Dieser Vertrag regelt die Vermietung von Event-Equipment, Zubehör und optionalen Serviceleistungen.
          Die Buchung wird verbindlich, sobald sie durch den Vermieter bestätigt wurde.
        </p>

        <h2>1. Vermieter</h2>
        <table>
          <tr><th>Firma</th><td>Edis Gastrobetriebe GmbH & Co. KG / Feiermiete</td></tr>
          <tr><th>Adresse</th><td>Goerzallee 299, 14167 Berlin</td></tr>
          <tr><th>Leistung</th><td>Vermietung von Event-Equipment, Gastro-Küche, Catering-Koordination und Eventservice</td></tr>
        </table>

        <h2>2. Mieter / Kunde</h2>
        <table>
          <tr><th>Name</th><td>${safe(inquiry.name)}</td></tr>
          <tr><th>E-Mail</th><td>${safe(inquiry.email)}</td></tr>
          <tr><th>Telefon</th><td>${safe(inquiry.phone)}</td></tr>
          <tr><th>Eventdatum</th><td>${safe(inquiry.eventDate)}</td></tr>
          <tr><th>Ort / Lieferadresse</th><td>${safe(inquiry.location)}</td></tr>
        </table>

        <h2>3. Mietartikel / Leistungsumfang</h2>
        <p>Folgende Artikel und Leistungen wurden angefragt beziehungsweise werden vermietet:</p>
        <pre>${safe(inquiry.message)}</pre>

        <h2>4. Kostenübersicht</h2>
        <table class="cost-table">
          <tr><th>Position</th><th>Betrag</th></tr>
          <tr><td>Mietpreis gesamt</td><td>${formatMoney(rentalTotal)}</td></tr>
          <tr><td>Lieferung / Aufbau / Abholung</td><td>${formatMoney(deliveryFee)}</td></tr>
          <tr><td>Zwischensumme ohne Kaution</td><td><strong>${formatMoney(totalWithoutDeposit)}</strong></td></tr>
          <tr><td>Kaution</td><td>${formatMoney(depositTotal)}</td></tr>
          <tr><td>Gesamt inkl. Kaution</td><td><strong>${formatMoney(totalWithDeposit)}</strong></td></tr>
        </table>

        <p class="note">
          Die Kaution dient als Sicherheit für beschädigte, fehlende oder stark verschmutzte Mietartikel.
          Nach vollständiger und ordnungsgemäßer Rückgabe wird die Kaution zurückgezahlt oder verrechnet.
        </p>

        <h2>5. Mietdauer, Übergabe und Rückgabe</h2>
        <div class="terms">
          <p>Die konkrete Mietdauer, Übergabe, Lieferung, Abholung und Rückgabe werden individuell abgestimmt.</p>
          <p>Der Mieter verpflichtet sich, die Mietartikel vollständig, sauber und im vereinbarten Zustand zurückzugeben.</p>
          <p>Verspätete Rückgabe kann zusätzliche Kosten verursachen, sofern dadurch weitere Vermietungen, Abholung oder Planung beeinträchtigt werden.</p>
        </div>

        <h2>6. Beschädigung, Verlust und Reinigung</h2>
        <div class="terms">
          <p>Beschädigte oder fehlende Artikel können zum Wiederbeschaffungswert oder Reparaturwert berechnet werden.</p>
          <p>Stark verschmutzte Artikel können mit zusätzlichen Reinigungskosten berechnet werden.</p>
          <p>Der Vermieter ist berechtigt, offene Beträge mit der Kaution zu verrechnen.</p>
        </div>

        <h2>7. Zahlung und Bestätigung</h2>
        <div class="terms">
          <p>Die Zahlung erfolgt nach individueller Vereinbarung. Eine Buchung gilt erst nach schriftlicher Bestätigung durch den Vermieter als verbindlich.</p>
          <p>Änderungen der Artikelanzahl, Mietdauer, Lieferadresse oder Serviceleistungen können den Gesamtpreis verändern.</p>
        </div>

        <h2>8. Interne Notiz / besondere Vereinbarung</h2>
        <pre>${safe(inquiry.adminNote)}</pre>

        <div class="signatures">
          <div class="line">Ort, Datum / Vermieter</div>
          <div class="line">Ort, Datum / Mieter</div>
        </div>

        <p class="small">
          Hinweis: Diese Vertragsansicht kann über den Browser als PDF gespeichert werden.
        </p>
      </body>
    </html>
  `;
}
