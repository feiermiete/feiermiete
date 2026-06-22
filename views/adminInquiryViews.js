import { renderAdminLayout } from "./adminLayout.js";
﻿function formatMoney(cents) {
  const value = Number(cents || 0) / 100;
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

function euroInput(cents) {
  const value = Number(cents || 0) / 100;
  return value.toFixed(2);
}

function safe(value) {
  return value || "";
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("de-DE");
  } catch {
    return "";
  }
}

function itemRows(items = []) {
  if (!items.length) {
    return `
      <tr>
        <td colspan="6">Keine einzelnen Artikelpositionen gespeichert. Die Artikel stehen eventuell noch im Nachrichtentext.</td>
      </tr>
    `;
  }

  return items.map((item) => {
    const rentalTotal = Number(item.priceCents || 0) * Number(item.quantity || 1);
    const depositTotal = Number(item.depositCents || 0) * Number(item.quantity || 1);

    return `
      <tr>
        <td><strong>${safe(item.name)}</strong></td>
        <td>${safe(item.category)}</td>
        <td>${item.quantity || 1}</td>
        <td>${item.priceCents ? formatMoney(item.priceCents) : safe(item.priceText) || "auf Anfrage"}</td>
        <td>${item.depositCents ? formatMoney(item.depositCents) : safe(item.depositText) || "auf Anfrage"}</td>
        <td>
          ${item.priceCents ? `Miete: ${formatMoney(rentalTotal)}<br>` : ""}
          ${item.depositCents ? `Kaution: ${formatMoney(depositTotal)}` : ""}
        </td>
      </tr>
    `;
  }).join("");
}

function calculateItemsRental(items = []) {
  return items.reduce((sum, item) => {
    return sum + Number(item.priceCents || 0) * Number(item.quantity || 1);
  }, 0);
}

function calculateItemsDeposit(items = []) {
  return items.reduce((sum, item) => {
    return sum + Number(item.depositCents || 0) * Number(item.quantity || 1);
  }, 0);
}

export function renderAdminInquiryDetail(inquiry) {
  const itemsRentalTotal = calculateItemsRental(inquiry.items || []);
  const itemsDepositTotal = calculateItemsDeposit(inquiry.items || []);

  const rentalValue = inquiry.rentalTotalCents || itemsRentalTotal;
  const depositValue = inquiry.depositTotalCents || itemsDepositTotal;

  return renderAdminLayout({ title: "Anfrage bearbeiten", content: `
    <div class="admin-page-head">
      <div>
        <p class="admin-kicker">Anfrage bearbeiten</p>
        <h1>Anfrage #${inquiry.id}</h1>
        <p>Prüfe Kundendaten, Artikelpositionen, Mietpreis, Kaution und Lieferung.</p>
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
          <div><span>Name</span><strong>${safe(inquiry.customerName)}</strong></div>
          <div><span>Firma</span><strong>${safe(inquiry.companyName)}</strong></div>
          <div><span>E-Mail</span><strong>${safe(inquiry.email)}</strong></div>
          <div><span>Telefon</span><strong>${safe(inquiry.phone)}</strong></div>
          <div><span>Eventdatum</span><strong>${formatDate(inquiry.eventDate)}</strong></div>
          <div><span>Ort / Lieferadresse</span><strong>${safe(inquiry.deliveryAddress)}</strong></div>
          <div><span>Status</span><strong>${safe(inquiry.status || "NEW")}</strong></div>
        </div>
      </section>

      <section class="admin-card">
        <h2>Nachricht</h2>
        <pre class="admin-message-box">${safe(inquiry.message)}</pre>
      </section>
    </div>

    <section class="admin-card">
      <h2>Artikelpositionen</h2>

      <div class="admin-table-wrap">
        <table class="admin-items-table">
          <thead>
            <tr>
              <th>Artikel</th>
              <th>Kategorie</th>
              <th>Menge</th>
              <th>Mietpreis</th>
              <th>Kaution</th>
              <th>Summe</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows(inquiry.items || [])}
          </tbody>
        </table>
      </div>

      <div class="admin-totals-box">
        <div>
          <span>Artikel-Mietpreis</span>
          <strong>${formatMoney(itemsRentalTotal)}</strong>
        </div>
        <div>
          <span>Artikel-Kaution</span>
          <strong>${formatMoney(itemsDepositTotal)}</strong>
        </div>
      </div>
    </section>

    <form class="admin-card admin-form" method="POST" action="/admin/inquiries/${inquiry.id}/update">
      <h2>Kundendaten bearbeiten</h2>

<div class="form-grid">
  <div class="form-row">
    <label>Name / Ansprechpartner</label>
    <input name="customerName" value="${safe(inquiry.customerName)}" required />
  </div>

  <div class="form-row">
    <label>Firma</label>
    <input name="companyName" value="${safe(inquiry.companyName)}" />
  </div>

  <div class="form-row">
    <label>E-Mail</label>
    <input name="email" type="email" value="${safe(inquiry.email)}" required />
  </div>

  <div class="form-row">
    <label>Telefon</label>
    <input name="phone" value="${safe(inquiry.phone)}" />
  </div>

  <div class="form-row">
    <label>Eventdatum</label>
    <input name="eventDate" type="date" value="${inquiry.eventDate ? new Date(inquiry.eventDate).toISOString().slice(0, 10) : ""}" />
  </div>

  <div class="form-row">
    <label>Ort / Lieferadresse</label>
    <input name="deliveryAddress" value="${safe(inquiry.deliveryAddress)}" />
  </div>
</div>

<h2>Kalkulation & Bearbeitung</h2>

<div class="form-grid">
        <div class="form-row">
          <label>Status</label>
          <select name="status">
            ${["NEW", "OPEN", "ANGEBOT", "GEBUCHT", "ABGELEHNT", "ERLEDIGT"].map((status) => `
              <option value="${status}" ${inquiry.status === status ? "selected" : ""}>${status}</option>
            `).join("")}
          </select>
        </div>

        <div class="form-row">
          <label>Mietpreis gesamt in Euro</label>
          <input name="rentalTotalEuro" type="number" step="0.01" value="${euroInput(rentalValue)}" />
        </div>

        <div class="form-row">
          <label>Kaution gesamt in Euro</label>
          <input name="depositTotalEuro" type="number" step="0.01" value="${euroInput(depositValue)}" />
        </div>

        <div class="form-row">
          <label>Lieferkosten in Euro</label>
          <input name="deliveryFeeEuro" type="number" step="0.01" value="${euroInput(inquiry.deliveryFeeCents)}" />
        </div>

        <div class="form-row full">
          <label>Interne Notiz</label>
          <textarea name="adminNote" rows="6">${safe(inquiry.adminNote)}</textarea>
        </div>
      </div>

      <button class="admin-button" type="submit">Anfrage speichern</button>
    </form>
  ` });
}

export function renderInquiryContract(inquiry) {
  const itemsRentalTotal = calculateItemsRental(inquiry.items || []);
  const itemsDepositTotal = calculateItemsDeposit(inquiry.items || []);

  const rentalTotal = Number(inquiry.rentalTotalCents || itemsRentalTotal || 0);
  const deliveryFee = Number(inquiry.deliveryFeeCents || 0);
  const depositTotal = Number(inquiry.depositTotalCents || itemsDepositTotal || 0);
  const totalWithoutDeposit = rentalTotal + deliveryFee;
  const totalWithDeposit = rentalTotal + deliveryFee + depositTotal;

  const today = new Date().toLocaleDateString("de-DE");
  const contractNumber = inquiry.contractNumber || `FM-${String(inquiry.id).padStart(5, "0")}`;

  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mietvertrag ${contractNumber}</title>
        <style>
          * { box-sizing: border-box; }

          body {
            margin: 0;
            background: #ece7df;
            color: #151515;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.5;
          }

          .print-button {
            position: fixed;
            top: 22px;
            right: 22px;
            z-index: 10;
            background: #d40016;
            color: #fff;
            border: 0;
            border-radius: 999px;
            padding: 13px 22px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 12px 26px rgba(0,0,0,.18);
          }

          .page {
            max-width: 1040px;
            margin: 34px auto;
            background: #fff;
            padding: 48px;
            box-shadow: 0 22px 70px rgba(0,0,0,.12);
          }

          .contract-top {
            display: grid;
            grid-template-columns: 1.2fr .8fr;
            gap: 36px;
            align-items: start;
            border-bottom: 4px solid #111;
            padding-bottom: 26px;
            margin-bottom: 30px;
          }

          .brand {
            color: #d40016;
            font-weight: 900;
            font-size: 36px;
            letter-spacing: -1px;
            line-height: 1;
          }

          .brand-sub {
            margin-top: 8px;
            text-transform: uppercase;
            letter-spacing: .18em;
            font-size: 11px;
            color: #555;
            font-weight: 700;
          }

          .meta-box {
            border: 1px solid #ded8cf;
            background: #f8f5f0;
            padding: 18px;
            font-size: 14px;
          }

          .meta-box strong {
            display: inline-block;
            min-width: 120px;
          }

          h1 {
            font-size: 34px;
            margin: 0 0 10px;
            letter-spacing: -1px;
          }

          .intro {
            margin: 0 0 24px;
            color: #333;
            max-width: 850px;
          }

          .badge {
            display: inline-block;
            background: #111;
            color: #fff;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .08em;
          }

          h2 {
            font-size: 19px;
            margin: 34px 0 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #111;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th, td {
            border: 1px solid #ded8cf;
            padding: 11px;
            vertical-align: top;
            font-size: 14px;
          }

          th {
            background: #f4f1ec;
            text-align: left;
            font-weight: 800;
          }

          .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 22px;
          }

          .summary-table .total-row td {
            background: #111;
            color: #fff;
            font-weight: 900;
          }

          .summary-table .deposit-row td {
            background: #f8f5f0;
            font-weight: 800;
          }

          .note {
            background: #fff4f4;
            border-left: 5px solid #d40016;
            padding: 15px 18px;
            margin-top: 16px;
            font-size: 14px;
          }

          .terms {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .term-box {
            border: 1px solid #ded8cf;
            background: #faf8f4;
            padding: 15px;
            min-height: 110px;
          }

          .term-box strong {
            display: block;
            margin-bottom: 6px;
          }

          pre {
            white-space: pre-wrap;
            font-family: Arial, Helvetica, sans-serif;
            background: #f8f5f0;
            border: 1px solid #ded8cf;
            padding: 14px;
            min-height: 70px;
          }

          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 70px;
            margin-top: 70px;
          }

          .signature-line {
            border-top: 1px solid #111;
            padding-top: 10px;
            min-height: 70px;
            font-size: 14px;
          }

          .footer-note {
            margin-top: 32px;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ded8cf;
            padding-top: 14px;
          }

          @media print {
            body { background: #fff; }
            .page { box-shadow: none; margin: 0; max-width: none; padding: 22px; }
            .print-button { display: none; }
            h2 { break-after: avoid; }
            table, .term-box { break-inside: avoid; }
          }
        </style>
      </head>

      <body>
        <button class="print-button" onclick="window.print()">Drucken / PDF speichern</button>

        <main class="page">
          <section class="contract-top">
            <div>
              <div class="brand">Feiermiete</div>
              <div class="brand-sub">Equipment für Feiern & Events</div>
            </div>

            <div class="meta-box">
              <div><strong>Dokument:</strong> Mietvertrag / Auftragsbestätigung</div>
              <div><strong>Vertrags-Nr.:</strong> ${contractNumber}</div>
              <div><strong>Anfrage-Nr.:</strong> ${inquiry.id}</div>
              <div><strong>Erstellt am:</strong> ${today}</div>
              <div><strong>Status:</strong> ${safe(inquiry.status || "NEW")}</div>
            </div>
          </section>

          <h1>Mietvertrag für Event-Equipment</h1>
          <p class="intro">
            Dieser Vertrag regelt die Vermietung von Event-Equipment, Zubehör und optionalen Serviceleistungen.
            Die Buchung wird erst verbindlich, wenn sie durch den Vermieter schriftlich bestätigt wurde.
          </p>

          <p><span class="badge">Entwurf / Vertragsansicht</span></p>

          <div class="two-col">
            <section>
              <h2>1. Vermieter</h2>
              <table>
                <tr><th>Firma</th><td>Edis Gastrobetriebe GmbH & Co. KG / Feiermiete</td></tr>
                <tr><th>Adresse</th><td>Goerzallee 299, 14167 Berlin</td></tr>
                <tr><th>E-Mail</th><td>info@feiermiete.de</td></tr>
                <tr><th>Leistung</th><td>Vermietung von Event-Equipment, Gastro-Küche, Catering-Koordination und Eventservice</td></tr>
              </table>
            </section>

            <section>
              <h2>2. Mieter / Kunde</h2>
              <table>
                <tr><th>Name</th><td>${safe(inquiry.customerName)}</td></tr>
                <tr><th>Firma</th><td>${safe(inquiry.companyName)}</td></tr>
                <tr><th>E-Mail</th><td>${safe(inquiry.email)}</td></tr>
                <tr><th>Telefon</th><td>${safe(inquiry.phone)}</td></tr>
                <tr><th>Eventdatum</th><td>${formatDate(inquiry.eventDate)}</td></tr>
                <tr><th>Ort / Lieferadresse</th><td>${safe(inquiry.deliveryAddress)}</td></tr>
              </table>
            </section>
          </div>

          <h2>3. Mietartikel / Leistungsumfang</h2>
          <table>
            <thead>
              <tr>
                <th>Artikel</th>
                <th>Kategorie</th>
                <th>Menge</th>
                <th>Mietpreis</th>
                <th>Kaution</th>
                <th>Summe</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows(inquiry.items || [])}
            </tbody>
          </table>

          <h2>4. Kostenübersicht</h2>
          <table class="summary-table">
            <tr><th>Position</th><th>Betrag</th></tr>
            <tr><td>Mietpreis gesamt</td><td>${formatMoney(rentalTotal)}</td></tr>
            <tr><td>Lieferung / Aufbau / Abholung</td><td>${formatMoney(deliveryFee)}</td></tr>
            <tr><td>Zwischensumme ohne Kaution</td><td><strong>${formatMoney(totalWithoutDeposit)}</strong></td></tr>
            <tr class="deposit-row"><td>Kaution gesamt</td><td>${formatMoney(depositTotal)}</td></tr>
            <tr class="total-row"><td>Gesamt inkl. Kaution</td><td>${formatMoney(totalWithDeposit)}</td></tr>
          </table>

          <p class="note">
            Die Kaution dient als Sicherheit für beschädigte, fehlende oder stark verschmutzte Mietartikel.
            Nach vollständiger und ordnungsgemäßer Rückgabe wird die Kaution zurückgezahlt oder mit offenen Forderungen verrechnet.
          </p>

          <h2>5. Nachricht / Zusatzangaben</h2>
          <pre>${safe(inquiry.message)}</pre>

          <h2>6. Mietbedingungen</h2>
          <div class="terms">
            <div class="term-box"><strong>Mietdauer und Rückgabe</strong>Die konkrete Mietdauer, Übergabe, Lieferung, Abholung und Rückgabe werden individuell abgestimmt. Der Mieter verpflichtet sich, alle Mietartikel vollständig und pünktlich zurückzugeben.</div>
            <div class="term-box"><strong>Zustand der Mietartikel</strong>Die Mietartikel sind sorgfältig zu behandeln und im vereinbarten Zustand zurückzugeben. Normale Gebrauchsspuren sind ausgenommen.</div>
            <div class="term-box"><strong>Beschädigung und Verlust</strong>Beschädigte oder fehlende Artikel können zum Reparaturwert, Wiederbeschaffungswert oder Zeitwert berechnet werden.</div>
            <div class="term-box"><strong>Reinigung</strong>Stark verschmutzte Artikel können mit zusätzlichen Reinigungskosten berechnet werden. Offene Beträge können mit der Kaution verrechnet werden.</div>
            <div class="term-box"><strong>Lieferung, Aufbau und Abholung</strong>Lieferung, Aufbau, Abholung und zusätzliche Serviceleistungen erfolgen nur, wenn sie vereinbart oder im Angebot enthalten sind.</div>
            <div class="term-box"><strong>Zahlung und Bestätigung</strong>Eine Buchung gilt erst nach schriftlicher Bestätigung durch den Vermieter als verbindlich. Zahlung, Kaution und Fälligkeit richten sich nach der individuellen Vereinbarung.</div>
          </div>

          <h2>7. Besondere Vereinbarung / interne Notiz</h2>
          <pre>${safe(inquiry.adminNote)}</pre>

          <div class="signatures">
            <div class="signature-line">Ort, Datum / Vermieter<br>Edis Gastrobetriebe GmbH & Co. KG / Feiermiete</div>
            <div class="signature-line">Ort, Datum / Mieter</div>
          </div>

          <p class="footer-note">
            Hinweis: Diese Vertragsansicht ist eine Arbeits- und Druckansicht. Rechtliche Formulierungen sollten bei Bedarf juristisch geprüft werden.
            Die Datei kann über den Browser mit „Drucken / PDF speichern“ als PDF gespeichert werden.
          </p>
        </main>
      </body>
    </html>
  `;
}
