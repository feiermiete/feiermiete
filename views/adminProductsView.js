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

export function renderAdminDashboard({ productCount = 0, activeProductCount = 0, inquiryCount = 0 }) {
  return renderAdminLayout({
    title: "Dashboard",
    content: `
      <div class="topbar">
        <div>
          <h1>Dashboard</h1>
          <p class="muted">Übersicht für Feiermiete.</p>
        </div>
        <a class="button" href="/admin/products/new">Equipment hinzufügen</a>
      </div>

      <div class="form-grid">
        <div class="card">
          <h2>${productCount}</h2>
          <p class="muted">Equipment-Artikel gesamt</p>
        </div>
        <div class="card">
          <h2>${activeProductCount}</h2>
          <p class="muted">Aktive Artikel auf der Website</p>
        </div>
        <div class="card">
          <h2>${inquiryCount}</h2>
          <p class="muted">Anfragen</p>
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
        <a class="button" href="/admin/products">Zur Liste</a>
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
        <a class="button" href="/admin/products">Zur Liste</a>
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
