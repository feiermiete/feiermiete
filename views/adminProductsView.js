import { renderAdminLayout } from "./adminLayoutView.js";

function formatEuro(cents) {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2);
}

function formatEuroDisplay(cents) {
  if (cents === null || cents === undefined) return "-";

  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

function renderCategoryOptions(categories = [], selectedCategoryId = null) {
  return categories.map((category) => {
    const selected = Number(selectedCategoryId) === Number(category.id) ? "selected" : "";
    return `<option value="${category.id}" ${selected}>${category.name}</option>`;
  }).join("");
}

function display(value) {
  return value || "-";
}

export function renderAdminDashboard({ productCount = 0, activeProductCount = 0, inquiryCount = 0 }) {
  return renderAdminLayout({
    title: "Dashboard",
    content: `
      <div class="topbar">
        <div>
          <h1>Dashboard</h1>
          <p class="muted">Zentrale Übersicht für deine Feiermiete-Website.</p>
        </div>
        <a class="button" href="/">Website ansehen</a>
      </div>

      <div class="dashboard-grid">
        <div class="card stat-card">
          <strong>${activeProductCount}</strong>
          <p class="muted">Aktive Artikel online</p>
        </div>

        <div class="card stat-card">
          <strong>${inquiryCount}</strong>
          <p class="muted">Neue Kundenanfragen</p>
        </div>

        <div class="card stat-card">
          <strong>${productCount}</strong>
          <p class="muted">Artikel insgesamt</p>
        </div>
      </div>

      <div class="admin-section-title">
        <h2>Schnellzugriff</h2>
        <p class="muted">Die wichtigsten Bereiche für die tägliche Bearbeitung.</p>
      </div>

      <div class="action-grid">
        <a class="action-card" href="/admin/inquiries">
          <span>!</span>
          <strong>Anfragen bearbeiten</strong>
          <p>Kundenanfragen prüfen und später beantworten.</p>
        </a>

        <a class="action-card" href="/admin/products/new">
          <span>+</span>
          <strong>Artikel hinzufügen</strong>
          <p>Neues Equipment, Küchenangebot oder Serviceleistung anlegen.</p>
        </a>

        <a class="action-card" href="/admin/products">
          <span>✎</span>
          <strong>Sortiment pflegen</strong>
          <p>Preise, Texte, Status und Bild-URLs der Artikel verwalten.</p>
        </a>

        <a class="action-card" href="/">
          <span>↗</span>
          <strong>Website prüfen</strong>
          <p>Öffentliche Seite öffnen und Änderungen kontrollieren.</p>
        </a>
      </div>

      <div class="admin-section-title">
        <h2>Nächste To-dos</h2>
        <p class="muted">Diese Punkte sollten wir als nächstes finalisieren.</p>
      </div>

      <div class="todo-grid">
        <div class="todo-card">
          <strong>Bilder klären</strong>
          <p>Für Equipment, Küche, Catering und Logistik brauchen wir echte oder KI-generierte Bilder.</p>
        </div>

        <div class="todo-card">
          <strong>Anfrageformular verbinden</strong>
          <p>Anfragen sollen sauber in der Datenbank landen und im Admin sichtbar sein.</p>
        </div>

        <div class="todo-card">
          <strong>Kategorien verwalten</strong>
          <p>Später sollen Kategorien im Admin erstellt und bearbeitet werden können.</p>
        </div>

        <div class="todo-card">
          <strong>Domain verbinden</strong>
          <p>feiermiete.de später sauber mit Railway verbinden.</p>
        </div>
      </div>
    `
  });
}

export function renderAdminProducts({ products = [] }) {
  const rows = products.map((product) => {
    const price = formatEuroDisplay(product.priceCents);

    return `
      <tr>
        <td>
          <strong>${product.name}</strong><br>
          <span class="muted">${product.slug}</span>
        </td>
        <td>${product.category?.name || "-"}</td>
        <td>${price}</td>
        <td>
          <span class="status ${product.isActive ? "active" : "inactive"}">
            ${product.isActive ? "Aktiv" : "Inaktiv"}
          </span>
        </td>
        <td class="actions-cell">
          <a class="small-button" href="/admin/products/${product.id}/edit">Bearbeiten</a>

          <form method="POST" action="/admin/products/${product.id}/toggle">
            <button class="small-button secondary" type="submit">
              ${product.isActive ? "Deaktivieren" : "Aktivieren"}
            </button>
          </form>

          <form method="POST" action="/admin/products/${product.id}/delete" onsubmit="return confirm('Diesen Artikel wirklich löschen?');">
            <button class="small-button danger" type="submit">Löschen</button>
          </form>
        </td>
      </tr>
    `;
  }).join("");

  return renderAdminLayout({
    title: "Equipment",
    content: `
      <div class="topbar">
        <div>
          <h1>Equipment</h1>
          <p class="muted">Alle Mietartikel verwalten.</p>
        </div>
        <a class="button" href="/admin/products/new">Neu hinzufügen</a>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Kategorie</th>
              <th>Preis</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="5">Noch keine Produkte vorhanden.</td></tr>`}
          </tbody>
        </table>
      </div>
    `
  });
}

export function renderNewProductForm({ categories = [] }) {
  const categoryOptions = renderCategoryOptions(categories);

  return renderAdminLayout({
    title: "Equipment hinzufügen",
    content: `
      <div class="topbar">
        <div>
          <h1>Equipment hinzufügen</h1>
          <p class="muted">Neuen Mietartikel anlegen.</p>
        </div>
        <a class="button black" href="/admin/products">Zur Liste</a>
      </div>

      <div class="card">
        <form method="POST" action="/admin/products">
          <div class="form-grid">
            <div class="form-row">
              <label>Name</label>
              <input name="name" placeholder="z. B. Stehtisch" required />
            </div>

            <div class="form-row">
              <label>Slug / URL-Name</label>
              <input name="slug" placeholder="z. B. stehtisch" required />
            </div>

            <div class="form-row">
              <label>Kategorie</label>
              <select name="categoryId">
                <option value="">Ohne Kategorie</option>
                ${categoryOptions}
              </select>
            </div>

            <div class="form-row">
              <label>Preis in Euro</label>
              <input name="priceEuro" type="number" step="0.01" placeholder="z. B. 12.00" required />
            </div>

            <div class="form-row">
              <label>Kaution in Euro</label>
              <input name="depositEuro" type="number" step="0.01" placeholder="z. B. 30.00" />
            </div>

            <div class="form-row">
              <label>Bild-URL</label>
              <input name="imageUrl" placeholder="z. B. /public/images/equipment/stehtisch.jpg" />
            </div>

            <div class="form-row full">
              <label>Beschreibung</label>
              <textarea name="description" rows="5" placeholder="Kurze Beschreibung für Kunden"></textarea>
            </div>
          </div>

          <button class="button" type="submit">Equipment speichern</button>
        </form>
      </div>
    `
  });
}

export function renderEditProductForm({ product, categories = [] }) {
  const categoryOptions = renderCategoryOptions(categories, product.categoryId);

  return renderAdminLayout({
    title: "Equipment bearbeiten",
    content: `
      <div class="topbar">
        <div>
          <h1>Equipment bearbeiten</h1>
          <p class="muted">${product.name}</p>
        </div>
        <a class="button black" href="/admin/products">Zur Liste</a>
      </div>

      <div class="card">
        <form method="POST" action="/admin/products/${product.id}/update">
          <div class="form-grid">
            <div class="form-row">
              <label>Name</label>
              <input name="name" value="${product.name || ""}" required />
            </div>

            <div class="form-row">
              <label>Slug / URL-Name</label>
              <input name="slug" value="${product.slug || ""}" required />
            </div>

            <div class="form-row">
              <label>Kategorie</label>
              <select name="categoryId">
                <option value="">Ohne Kategorie</option>
                ${categoryOptions}
              </select>
            </div>

            <div class="form-row">
              <label>Preis in Euro</label>
              <input name="priceEuro" type="number" step="0.01" value="${formatEuro(product.priceCents)}" required />
            </div>

            <div class="form-row">
              <label>Kaution in Euro</label>
              <input name="depositEuro" type="number" step="0.01" value="${formatEuro(product.depositCents)}" />
            </div>

            <div class="form-row">
              <label>Bild-URL</label>
              <input name="imageUrl" value="${product.imageUrl || ""}" />
            </div>

            <div class="form-row full">
              <label>Beschreibung</label>
              <textarea name="description" rows="5">${product.description || ""}</textarea>
            </div>

            <div class="form-row full checkbox-row">
              <label>
                <input type="checkbox" name="isActive" ${product.isActive ? "checked" : ""} />
                Artikel aktiv auf der Website anzeigen
              </label>
            </div>
          </div>

          <button class="button" type="submit">Änderungen speichern</button>
        </form>
      </div>
    `
  });
}

export function renderAdminInquiries({ inquiries = [] }) {
  const rows = inquiries.map((inquiry) => {
    const date = inquiry.createdAt
      ? new Date(inquiry.createdAt).toLocaleString("de-DE")
      : "-";

    return `
      <tr>
        <td>
          <strong>${display(inquiry.customerName)}</strong><br>
          <span class="muted">${display(inquiry.email)}</span><br>
          <span class="muted">${display(inquiry.phone)}</span>
        </td>
        <td>${inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString("de-DE") : "-"}</td>
        <td>${display(inquiry.deliveryAddress)}</td>
        <td class="message-box">${display(inquiry.message)}</td>
        <td>${date}</td>
      </tr>
    `;
  }).join("");

  return renderAdminLayout({
    title: "Anfragen",
    content: `
      <div class="topbar">
        <div>
          <h1>Anfragen</h1>
          <p class="muted">Alle eingegangenen Kundenanfragen.</p>
        </div>
        <a class="button black" href="/admin">Dashboard</a>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Kontakt</th>
              <th>Datum</th>
              <th>Ort</th>
              <th>Nachricht</th>
              <th>Eingang</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="5">Noch keine Anfragen vorhanden.</td></tr>`}
          </tbody>
        </table>
      </div>
    `
  });
}



export function renderAdminInquiryDetail(inquiry) {
  const euro = (cents) => {
    const value = Number(cents || 0) / 100;
    return value.toFixed(2);
  };

  const safe = (value) => value || "";

  return renderAdminLayout("Anfrage bearbeiten", `
    <div class="admin-page-head">
      <div>
        <p class="admin-kicker">Anfrage</p>
        <h1>Anfrage #${inquiry.id}</h1>
        <p>Hier kannst du die Anfrage prüfen, kalkulieren und für einen Vertrag vorbereiten.</p>
      </div>
      <div class="admin-actions">
        <a class="admin-button secondary" href="/admin/inquiries">Zurück</a>
        <a class="admin-button" href="/admin/inquiries/${inquiry.id}/contract" target="_blank">Vertrag ansehen</a>
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
        <h2>Nachricht / Artikel</h2>
        <pre class="admin-message-box">${safe(inquiry.message)}</pre>
      </section>
    </div>

    <form class="admin-card admin-form" method="POST" action="/admin/inquiries/${inquiry.id}/update">
      <h2>Anfrage bearbeiten</h2>

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

export function renderInquiryContract(inquiry) {
  const formatMoney = (cents) => {
    const value = Number(cents || 0) / 100;
    return value.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
  };

  const safe = (value) => value || "________________";

  const total =
    Number(inquiry.rentalTotalCents || 0) +
    Number(inquiry.deliveryFeeCents || 0) +
    Number(inquiry.depositTotalCents || 0);

  return `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <title>Mietvertrag Anfrage ${inquiry.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #111;
            margin: 0;
            padding: 40px;
            line-height: 1.45;
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

          .top {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            margin-bottom: 40px;
          }

          .brand {
            color: #c70012;
            font-weight: 900;
            font-size: 28px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
          }

          td, th {
            border: 1px solid #ddd;
            padding: 10px;
            vertical-align: top;
          }

          th {
            background: #f5f5f5;
            text-align: left;
          }

          pre {
            white-space: pre-wrap;
            font-family: Arial, sans-serif;
            background: #f7f3ee;
            padding: 16px;
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
          }

          @media print {
            button {
              display: none;
            }

            body {
              padding: 28px;
            }
          }
        </style>
      </head>
      <body>
        <button onclick="window.print()">Als PDF speichern / Drucken</button>

        <div class="top">
          <div>
            <div class="brand">Feiermiete</div>
            <p>Equipment für Feiern & Events</p>
          </div>
          <div>
            <strong>Mietvertrag / Auftragsbestätigung</strong><br>
            Anfrage-Nr.: ${inquiry.id}<br>
            Status: ${safe(inquiry.status)}
          </div>
        </div>

        <h1>Mietvertrag</h1>
        <p>Zwischen dem Vermieter und dem unten genannten Mieter wird folgender Mietvertrag vorbereitet.</p>

        <h2>1. Mieter</h2>
        <table>
          <tr><th>Name</th><td>${safe(inquiry.name)}</td></tr>
          <tr><th>E-Mail</th><td>${safe(inquiry.email)}</td></tr>
          <tr><th>Telefon</th><td>${safe(inquiry.phone)}</td></tr>
          <tr><th>Eventdatum</th><td>${safe(inquiry.eventDate)}</td></tr>
          <tr><th>Ort</th><td>${safe(inquiry.location)}</td></tr>
        </table>

        <h2>2. Mietartikel / Anfrage</h2>
        <pre>${safe(inquiry.message)}</pre>

        <h2>3. Kosten</h2>
        <table>
          <tr><th>Mietpreis gesamt</th><td>${formatMoney(inquiry.rentalTotalCents)}</td></tr>
          <tr><th>Lieferkosten</th><td>${formatMoney(inquiry.deliveryFeeCents)}</td></tr>
          <tr><th>Kaution</th><td>${formatMoney(inquiry.depositTotalCents)}</td></tr>
          <tr><th>Gesamt inkl. Kaution</th><td><strong>${formatMoney(total)}</strong></td></tr>
        </table>

        <h2>4. Bedingungen</h2>
        <p>
          Die Mietartikel bleiben Eigentum des Vermieters. Der Mieter verpflichtet sich,
          die Artikel sorgfältig zu behandeln und vollständig sowie in vereinbartem Zustand zurückzugeben.
          Beschädigte, fehlende oder stark verschmutzte Artikel können mit der Kaution verrechnet werden.
        </p>
        <p>
          Lieferung, Aufbau, Rückgabe und Abholung erfolgen nach individueller Absprache.
          Die Buchung gilt erst nach schriftlicher Bestätigung durch den Vermieter als verbindlich.
        </p>

        <h2>5. Interne Notiz</h2>
        <pre>${safe(inquiry.adminNote)}</pre>

        <div class="signatures">
          <div class="line">Ort, Datum / Vermieter</div>
          <div class="line">Ort, Datum / Mieter</div>
        </div>
      </body>
    </html>
  `;
}

