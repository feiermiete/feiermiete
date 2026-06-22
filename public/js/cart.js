(function () {
  const CART_KEY = "feiermiete_request_cart";

  function moneyText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateFloatingCart();
  }

  function updateFloatingCart() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    let button = document.querySelector(".floating-request-cart");

    if (!button) {
      button = document.createElement("a");
      button.className = "floating-request-cart";
      button.href = "/anfrage";
      button.innerHTML = '<span>Anfragekorb</span><strong>0</strong>';
      document.body.appendChild(button);
    }

    const badge = button.querySelector("strong");
    if (badge) badge.textContent = String(totalQty);

    button.style.display = totalQty > 0 ? "flex" : "none";
  }

  function getInfoFromCard(card) {
    const title =
      card.querySelector("h2")?.textContent ||
      card.querySelector("h3")?.textContent ||
      card.querySelector("strong")?.textContent ||
      "Artikel";

    const category =
      card.querySelector(".product-category")?.textContent ||
      card.querySelector(".shop-card-category")?.textContent ||
      card.querySelector(".section-kicker")?.textContent ||
      "";

    let price = "";
    let deposit = "";
    let stock = "";

    card.querySelectorAll(".shop-card-info div").forEach((row) => {
      const label = row.querySelector("span")?.textContent?.toLowerCase() || "";
      const value = row.querySelector("strong")?.textContent || "";

      if (label.includes("mietpreis")) price = value;
      if (label.includes("kaution")) deposit = value;
      if (label.includes("verfügbar")) stock = value;
    });

    return {
      name: moneyText(title),
      category: moneyText(category),
      price: moneyText(price),
      deposit: moneyText(deposit),
      stock: moneyText(stock)
    };
  }

  function addQuantityControls() {
    document.querySelectorAll(".shop-card").forEach((card) => {
      const button = card.querySelector(".shop-card-button");
      if (!button) return;

      button.textContent = "Zum Anfragekorb";

      if (!card.querySelector(".cart-qty-box")) {
        const qtyBox = document.createElement("div");
        qtyBox.className = "cart-qty-box";
        qtyBox.innerHTML = `
          <label>Menge</label>
          <div>
            <button type="button" class="qty-minus">−</button>
            <input class="cart-qty-input" type="number" min="1" value="1" />
            <button type="button" class="qty-plus">+</button>
          </div>
        `;

        button.parentNode.insertBefore(qtyBox, button);
      }
    });
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      const minus = event.target.closest(".qty-minus");
      const plus = event.target.closest(".qty-plus");

      if (minus || plus) {
        const box = event.target.closest(".cart-qty-box");
        const input = box?.querySelector(".cart-qty-input");
        if (!input) return;

        let value = Number(input.value || 1);

        if (minus) value = Math.max(1, value - 1);
        if (plus) value = value + 1;

        input.value = value;
        return;
      }

      const button = event.target.closest(".shop-card-button");
      if (!button) return;

      const card = button.closest(".shop-card");
      if (!card) return;

      event.preventDefault();

      const info = getInfoFromCard(card);
      const qtyInput = card.querySelector(".cart-qty-input");
      const quantity = Math.max(1, Number(qtyInput?.value || 1));

      const cart = getCart();
      const existing = cart.find((item) => item.name === info.name);

      if (existing) {
        existing.quantity = Number(existing.quantity || 0) + quantity;
      } else {
        cart.push({
          ...info,
          quantity
        });
      }

      saveCart(cart);

      button.textContent = "Hinzugefügt ✓";
      setTimeout(() => {
        button.textContent = "Zum Anfragekorb";
      }, 1000);
    });

    document.addEventListener("click", function (event) {
      const remove = event.target.closest("[data-remove-cart-item]");
      if (!remove) return;

      const index = Number(remove.getAttribute("data-remove-cart-item"));
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderInquiryCartBox();
    });
  }

  function buildCartText() {
    const cart = getCart();

    if (!cart.length) return "";

    let text = "Anfragekorb:\n\n";

    cart.forEach((item) => {
      text += `${item.quantity} x ${item.name}\n`;

      if (item.price) text += `Mietpreis: ${item.price}\n`;
      if (item.deposit) text += `Kaution: ${item.deposit}\n`;
      if (item.stock) text += `Verfügbar laut Website: ${item.stock}\n`;

      text += "\n";
    });

    return text.trim();
  }

  function renderInquiryCartBox() {
    const cart = getCart();
    const form = document.querySelector("form");
    const textarea = document.querySelector('textarea[name="message"], textarea[name="nachricht"]');

    if (!form || !textarea) return;

    let box = document.querySelector(".inquiry-cart-preview");

    if (!box) {
      box = document.createElement("div");
      box.className = "inquiry-cart-preview";
      form.insertBefore(box, form.firstChild);
    }

    if (!cart.length) {
      box.innerHTML = "";
      return;
    }

    box.innerHTML = `
      <h3>Dein Anfragekorb</h3>
      <p>Diese Artikel werden mit deiner Anfrage übermittelt.</p>
      <div class="inquiry-cart-items">
        ${cart.map((item, index) => `
          <div class="inquiry-cart-item">
            <strong>${item.quantity} x ${item.name}</strong>
            <span>${item.price || ""}${item.deposit ? " · Kaution: " + item.deposit : ""}</span>
            <button type="button" data-remove-cart-item="${index}">Entfernen</button>
          </div>
        `).join("")}
      </div>
    `;

    let hidden = form.querySelector('input[name="cartData"]');

    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "cartData";
      form.appendChild(hidden);
    }

    hidden.value = JSON.stringify(cart);

    const cartText = buildCartText();

    if (cartText && !textarea.value.includes("Anfragekorb:")) {
      textarea.value = cartText + "\n\n" + textarea.value;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    addQuantityControls();
    bindEvents();
    updateFloatingCart();
    renderInquiryCartBox();

    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", function () {
        renderInquiryCartBox();
      });
    }
  });
})();

