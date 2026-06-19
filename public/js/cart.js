(function () {
  const KEY = "feiermiete_anfrage_artikel";

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    renderCart();
  }

  function getCardFromButton(button) {
    return button.closest(".shop-card") || button.closest(".compact-product") || button.closest(".home-product-card");
  }

  function getProduct(button) {
    const card = getCardFromButton(button);
    if (!card) return null;

    const name = card.querySelector("h3")?.innerText?.trim() || "Mietartikel";
    const category =
      card.querySelector(".shop-card-category")?.innerText?.trim() ||
      card.querySelector(".home-product-category")?.innerText?.trim() ||
      card.querySelector(".small-red")?.innerText?.trim() ||
      "";

    const price =
      Array.from(card.querySelectorAll("strong"))
        .map((el) => el.innerText.trim())
        .find((text) => text.includes("€")) || "Preis auf Anfrage";

    const image = card.querySelector("img")?.getAttribute("src") || "";

    return {
      id: name.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, "-"),
      name,
      category,
      price,
      image,
      quantity: 1
    };
  }

  function addProduct(product) {
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(product);
    }

    writeCart(cart);
    document.body.classList.add("fm-cart-open");
  }

  function removeProduct(id) {
    writeCart(readCart().filter((item) => item.id !== id));
  }

  function changeQty(id, amount) {
    const cart = readCart();
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      removeProduct(id);
      return;
    }

    writeCart(cart);
  }

  function countCart() {
    return readCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  function cartText() {
    const cart = readCart();

    if (!cart.length) return "";

    return [
      "Gewünschte Mietartikel:",
      "",
      ...cart.map((item) => `- ${item.quantity}x ${item.name} | ${item.category || "Mietartikel"} | ${item.price}`)
    ].join("\n");
  }

  function renderCart() {
    let root = document.querySelector("#fm-cart-root");

    if (!root) {
      root = document.createElement("div");
      root.id = "fm-cart-root";
      document.body.appendChild(root);
    }

    const cart = readCart();
    const count = countCart();

    root.innerHTML = `
      <button class="fm-cart-button" type="button">
        Anfragekorb <b>${count}</b>
      </button>

      <div class="fm-cart-backdrop"></div>

      <aside class="fm-cart-panel">
        <div class="fm-cart-header">
          <div>
            <span>Feiermiete</span>
            <h3>Anfragekorb</h3>
          </div>
          <button class="fm-cart-x" type="button">×</button>
        </div>

        <div class="fm-cart-items">
          ${
            cart.length
              ? cart.map((item) => `
                <div class="fm-cart-line">
                  ${item.image ? `<img src="${item.image}" alt="">` : ""}
                  <div>
                    <strong>${item.name}</strong>
                    <span>${item.category || "Mietartikel"}</span>
                    <small>${item.price}</small>

                    <div class="fm-cart-controls">
                      <button type="button" data-minus="${item.id}">−</button>
                      <b>${item.quantity}</b>
                      <button type="button" data-plus="${item.id}">+</button>
                      <button type="button" data-remove="${item.id}">Entfernen</button>
                    </div>
                  </div>
                </div>
              `).join("")
              : `<p class="fm-cart-empty">Noch keine Artikel im Anfragekorb.</p>`
          }
        </div>

        <div class="fm-cart-bottom">
          <p>Alle Artikel werden zusammen in eine Anfrage übernommen.</p>
          <a href="/anfrage" class="fm-cart-submit">Gemeinsame Anfrage stellen</a>
        </div>
      </aside>
    `;

    root.querySelector(".fm-cart-button")?.addEventListener("click", () => {
      document.body.classList.add("fm-cart-open");
    });

    root.querySelector(".fm-cart-backdrop")?.addEventListener("click", () => {
      document.body.classList.remove("fm-cart-open");
    });

    root.querySelector(".fm-cart-x")?.addEventListener("click", () => {
      document.body.classList.remove("fm-cart-open");
    });

    root.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => removeProduct(button.dataset.remove));
    });

    root.querySelectorAll("[data-plus]").forEach((button) => {
      button.addEventListener("click", () => changeQty(button.dataset.plus, 1));
    });

    root.querySelectorAll("[data-minus]").forEach((button) => {
      button.addEventListener("click", () => changeQty(button.dataset.minus, -1));
    });
  }

  function convertProductButtons() {
    document.querySelectorAll(".shop-card a, .shop-card-button, .compact-product a, .home-product-card a").forEach((button) => {
      const text = button.innerText.trim().toLowerCase();

      if (
        text.includes("artikel anfragen") ||
        text.includes("anfragen") ||
        text.includes("zum warenkorb")
      ) {
        button.innerText = "Zum Anfragekorb";
        button.href = "#";
        button.classList.add("fm-add-cart-button");
      }
    });
  }

  function fillInquiryForm() {
    const summary = cartText();
    if (!summary) return;

    const form = document.querySelector("form");
    if (!form) return;

    const textarea = form.querySelector('textarea[name="message"], textarea[name="nachricht"], textarea');

    let summaryBox = document.querySelector(".fm-selected-products");

    if (!summaryBox) {
      summaryBox = document.createElement("div");
      summaryBox.className = "fm-selected-products";
      summaryBox.innerHTML = `
        <div class="small-red">Ausgewählte Artikel</div>
        <h3>Diese Artikel werden mit angefragt:</h3>
        <pre></pre>
      `;
      form.prepend(summaryBox);
    }

    summaryBox.querySelector("pre").innerText = summary;

    if (textarea && !textarea.value.includes("Gewünschte Mietartikel:")) {
      textarea.value = summary + "\n\nWeitere Nachricht:\n";
    }

    form.addEventListener("submit", function () {
      const latestSummary = cartText();
      const messageField = form.querySelector('textarea[name="message"], textarea[name="nachricht"], textarea');

      if (messageField && latestSummary && !messageField.value.includes("Gewünschte Mietartikel:")) {
        messageField.value = latestSummary + "\n\nWeitere Nachricht:\n" + messageField.value;
      }
    });
  }

  document.addEventListener("click", function (event) {
    const button = event.target.closest(".fm-add-cart-button");

    if (!button) return;

    event.preventDefault();

    const product = getProduct(button);
    if (!product) return;

    addProduct(product);
  });

  document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    convertProductButtons();
    fillInquiryForm();
  });
})();
