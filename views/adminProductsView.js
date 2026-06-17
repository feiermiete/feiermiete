import { renderAdminLayout } from "./adminLayoutView.js";

export function renderAdminDashboard({ productCount = 0, inquiryCount = 0, passwordQuery = "" }) {
  return renderAdminLayout({
    title: "Dashboard",
    passwordQuery,
    content: `
      <div class="topbar">
        <div>
          <h1>Dashboard</h1>
          <p class="muted">Übersicht für Feiermiete.</p>
        </div>
        <a class="button" href="/admin/products/new${passwordQuery}">Equipment hinzufügen</a>
      </div>

      <div class="form-grid">
        <div class="card">
          <h2>${productCount}</h2>
          <p class="muted">Equipment-Artikel</p>
        </div>
        <div class="card">
          <h2>${inquiryCount}</h2>
          <p class="muted">Anfragen</p>
        </div>
      </div>
    `
  });
}

export function renderAdminProducts({ products = [], passwordQuery = "" }) {
  const rows = products.map((product) => {
    const price = (product.priceCents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR"
    });

    return `
      <tr>
        <td><strong>${product.name}</strong><br><span class="muted">${product.slug}</span></td>
        <td>${product.category?.name || "-"}</td>
        <td>${price}</td>
        <td>${product.isActive ? "Aktiv" : "Inaktiv"}</td>
      </tr>
    `;
  }).join("");

  return renderAdminLayout({
    title: "Equipment",
    passwordQuery,
    content: `
      <div class="topbar">
        <div>
          <h1>Equipment</h1>
          <p class="muted">Alle Mietartikel verwalten.</p>
        </div>
        <a class="button" href="/admin/products/new${passwordQuery}">Neu hinzufügen</a>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Kategorie</th>
              <th>Preis</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="4">Noch keine Produkte vorhanden.</td></tr>`}
          </tbody>
        </table>
      </div>
    `
  });
}

export function renderNewProductForm({ categories = [], passwordQuery = "" }) {
  const categoryOptions = categories.map((category) => {
    return `<option value="${category.id}">${category.name}</option>`;
  }).join("");

  return renderAdminLayout({
    title: "Equipment hinzufügen",
    passwordQuery,
    content: `
      <div class="topbar">
        <div>
          <h1>Equipment hinzufügen</h1>
          <p class="muted">Neuen Mietartikel anlegen.</p>
        </div>
        <a class="button" href="/admin/products${passwordQuery}">Zur Liste</a>
      </div>

      <div class="card">
        <form method="POST" action="/admin/products${passwordQuery}">
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
              <input name="imageUrl" placeholder="später Upload / aktuell optional URL" />
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
