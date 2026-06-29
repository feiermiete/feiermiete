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


function renderImageLibraryOptions(selectedValue = "") {
  const images = [
    "/public/images/gluehweinbehaelter.jpg",
    "/public/images/stehtisch.jpg",
    "/public/images/bierzeltgarnitur.jpg",
    "/public/images/pavillon-6x3.jpg",
    "/public/images/buffet-table.jpg",
    "/public/images/chafing-dish.jpg",
    "/public/images/drinks-dispenser.jpg",
    "/public/images/getraenkespender.jpg",
    "/public/images/cutlery-set.jpg",
    "/public/images/hot-drink-dispenser.jpg",
    "/public/images/table-photo.jpg",
    "/public/images/equipment-photo.jpg",
    "/public/images/photo-coming-soon.jpg"
  ];

  return images.map((imagePath) => {
    const label = imagePath.replace("/public/images/", "");
    return `<option value="${imagePath}" ${selectedValue === imagePath ? "selected" : ""}>${label}</option>`;
  }).join("");
}


function renderImagePickerScript() {
  return `
    <script>
      function updateAdminImagePreview(form) {
        const input = form ? form.querySelector('input[name="imageUrl"]') : null;
        const preview = form ? form.querySelector('[data-image-preview]') : null;

        if (!input || !preview) return;

        if (input.value) {
          preview.innerHTML = '<img src="' + input.value + '" alt="Bildvorschau" />';
        } else {
          preview.innerHTML = '<span>Keine Bildvorschau</span>';
        }
      }

      document.addEventListener("change", function(event) {
        if (!event.target.matches("[data-image-library-select]")) return;

        const form = event.target.closest("form");
        const input = form ? form.querySelector('input[name="imageUrl"]') : null;

        if (input && event.target.value) {
          input.value = event.target.value;
          updateAdminImagePreview(form);
        }
      });

      document.addEventListener("input", function(event) {
        if (!event.target.matches('input[name="imageUrl"]')) return;
        updateAdminImagePreview(event.target.closest("form"));
      });

      document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll("form").forEach(updateAdminImagePreview);
      });
    </script>
  `;
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
    const deposit = formatEuroDisplay(product.depositCents);
    const image = product.imageUrl || "/public/images/photo-coming-soon.jpg";
    const description = product.description
      ? product.description.slice(0, 120) + (product.description.length > 120 ? "..." : "")
      : "Keine Beschreibung hinterlegt.";

    return `
      <tr>
        <td>
          <div class="admin-product-cell">
            <img class="admin-product-thumb" src="${image}" alt="${product.name || "Produkt"}" />
            <div>
              <strong>${product.name}</strong><br>
              <span class="muted">${product.slug}</span><br>
              <small class="muted">${description}</small>
            </div>
          </div>
        </td>
        <td>${product.category?.name || "-"}</td>
        <td>
          <strong>${price}</strong><br>
          <span class="muted">Kaution: ${deposit || "0,00 ?"}</span>
        </td>
        <td>
          <strong>${product.stockQuantity || 0}</strong><br>
          <span class="muted">verf?gbar</span>
        </td>
        <td>
          <span class="status ${product.isActive ? "active" : "inactive"}">
            ${product.isActive ? "Online" : "Offline"}
          </span>
        </td>
        <td class="actions-cell">
          <a class="small-button" href="/admin/products/${product.id}/edit">Bearbeiten</a>

          <form method="POST" action="/admin/products/${product.id}/toggle">
            <button class="small-button secondary" type="submit">
              ${product.isActive ? "Offline setzen" : "Online setzen"}
            </button>
          </form>

          <form method="POST" action="/admin/products/${product.id}/delete" onsubmit="return confirm('Diesen Artikel wirklich l?schen?');">
            <button class="small-button danger" type="submit">L?schen</button>
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
          <p class="muted">Alle Mietartikel, Preise, Bilder, Bestand und Status verwalten.</p>
        </div>
        <a class="button" href="/admin/products/new">Neu hinzuf?gen</a>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Artikel</th>
              <th>Kategorie</th>
              <th>Preis</th>
              <th>Bestand</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="6">Noch keine Artikel vorhanden.</td></tr>'}
          </tbody>
        </table>
      </div>
    `
  });
}


export function renderNewProductForm({ categories = [] }) {
  const categoryOptions = renderCategoryOptions(categories);

  return renderAdminLayout({
    title: "Equipment hinzuf?gen",
    content: `
      <div class="topbar">
        <div>
          <h1>Equipment hinzuf?gen</h1>
          <p class="muted">Neuen Mietartikel anlegen.</p>
        </div>
        <a class="button secondary" href="/admin/products">Zur Liste</a>
      </div>

      <div class="card">
        <form method="POST" action="/admin/products" enctype="multipart/form-data">
          <div class="form-grid">
            <div class="form-row">
              <label>Name</label>
              <input name="name" placeholder="z. B. Stehtisch" required />
            </div>

            <div class="form-row">
              <label>Slug / URL-Name</label>
              <input name="slug" placeholder="z. B. stehtisch" required />
              <small class="muted">Kleinbuchstaben ohne Leerzeichen, z. B. stehtisch oder pavillon-6x3.</small>
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
              <small class="muted">Optional. Wird sp?ter im Angebot/Mietvertrag ber?cksichtigt.</small>
            </div>

            <div class="form-row">
              <label>Menge verf?gbar</label>
              <input name="stockQuantity" type="number" step="1" min="0" value="0" />
              <small class="muted">Interner Bestand f?r Planung und Verf?gbarkeit.</small>
            </div>

            <div class="form-row">
              <label>Bild-URL</label>
              <input name="imageUrl" placeholder="z. B. /public/images/stehtisch.jpg" />
              <small class="muted">Du kannst ein Bild aus der Mediathek ausw?hlen oder die Bild-URL manuell eintragen.</small>
            </div>

            <div class="form-row">
              <label>Bild aus Mediathek ausw?hlen</label>
              <select data-image-library-select>
                <option value="">Bitte ausw?hlen</option>
                ${renderImageLibraryOptions()}
              </select>
            </div>

            <div class="form-row">
              <label>Bild vom Computer hochladen</label>
              <input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" />
              <small class="muted">JPG, PNG, WEBP oder SVG bis 5 MB.</small>
            </div>

            <div class="form-row full">
              <label>Bildvorschau</label>
              <div class="admin-image-preview" data-image-preview>
                <span>Keine Bildvorschau</span>
              </div>
            </div>

            <div class="form-row full">
              <label>Beschreibung</label>
              <textarea name="description" rows="6" placeholder="Kurze Beschreibung f?r Kunden, z. B. Einsatzbereich, Vorteile und passende Kombinationen."></textarea>
              <small class="muted">Diese Beschreibung erscheint auf der Website und sollte kundenverst?ndlich formuliert sein.</small>
            </div>

            <div class="form-row full checkbox-row">
              <label>
                <input type="checkbox" name="isActive" checked />
                Artikel aktiv auf der Website anzeigen
              </label>
            </div>
          </div>

          <button class="button" type="submit">Equipment speichern</button>
        </form>
      </div>

      ${renderImagePickerScript()}
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
        <form method="POST" action="/admin/products/${product.id}/update" enctype="multipart/form-data">
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
              <label>Menge verfügbar</label>
              <input name="stockQuantity" type="number" step="1" min="0" value="${product.stockQuantity || 0}" />
            </div>

            <div class="form-row">
              <label>Bild-URL</label>
              <input name="imageUrl" value="${product.imageUrl || ""}" />
            </div>

            <div class="form-row">
              <label>Bild aus Mediathek ausw?hlen</label>
              <select data-image-library-select onchange="this.closest('form').querySelector('input[name=imageUrl]').value=this.value">
                <option value="">Bitte ausw?hlen</option>
                ${renderImageLibraryOptions(product.imageUrl || "")}
              </select>
            </div>

            ${product.imageUrl ? `
              <div class="form-row full">
                <label>Aktuelle Bildvorschau</label>
                <img src="${product.imageUrl}" alt="${product.name || "Produktbild"}" style="max-width:260px;border-radius:14px;border:1px solid #ddd;" />
              </div>
            ` : ""}
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
        <td class="actions-cell">
          <a class="small-button" href="/admin/inquiries/${inquiry.id}">?ffnen</a>
          <a class="small-button secondary" href="/admin/inquiries/${inquiry.id}/contract" target="_blank">Vertrag</a>
        </td>
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
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="6">Noch keine Anfragen vorhanden.</td></tr>`}
          </tbody>
        </table>
      </div>
    `
  });
}
