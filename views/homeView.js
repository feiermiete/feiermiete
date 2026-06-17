export function renderHomePage({ products = [] }) {
  const productCards = products.map((product) => {
    const price = (product.priceCents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR"
    });

    return `
      <article class="product-card">
        <div class="product-tag">${product.category?.name || "Equipment"}</div>
        <h3>${product.name}</h3>
        <p>${product.description || ""}</p>
        <div class="product-price">ab ${price}</div>
        <a class="small-button" href="/anfrage?produkt=${product.slug}">Anfragen</a>
      </article>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Feiermiete - Equipment für deine Feier mieten</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f7f3ec;
            color: #1f1f1f;
          }

          header {
            padding: 22px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255,255,255,0.82);
            backdrop-filter: blur(16px);
            position: sticky;
            top: 0;
            z-index: 10;
            border-bottom: 1px solid rgba(0,0,0,0.06);
          }

          .logo {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.04em;
          }

          nav a {
            margin-left: 22px;
            color: #1f1f1f;
            text-decoration: none;
            font-weight: 600;
          }

          .hero {
            padding: 90px 40px 60px;
            text-align: center;
          }

          .hero-inner {
            max-width: 920px;
            margin: 0 auto;
          }

          .eyebrow {
            display: inline-block;
            background: #ffffff;
            border: 1px solid rgba(0,0,0,0.08);
            padding: 10px 16px;
            border-radius: 999px;
            font-weight: 700;
            margin-bottom: 24px;
          }

          h1 {
            font-size: clamp(44px, 7vw, 82px);
            line-height: 0.95;
            margin: 0 0 24px;
            letter-spacing: -0.07em;
          }

          .hero p {
            max-width: 680px;
            margin: 0 auto 34px;
            font-size: 21px;
            line-height: 1.55;
            color: #4a4a4a;
          }

          .button {
            display: inline-block;
            background: #111;
            color: white;
            padding: 17px 28px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 800;
          }

          .section {
            padding: 50px 40px 80px;
          }

          .section-inner {
            max-width: 1180px;
            margin: 0 auto;
          }

          .section h2 {
            font-size: 38px;
            margin: 0 0 24px;
            letter-spacing: -0.04em;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 18px;
          }

          .product-card {
            background: white;
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 18px 50px rgba(0,0,0,0.07);
            border: 1px solid rgba(0,0,0,0.05);
          }

          .product-tag {
            display: inline-block;
            font-size: 12px;
            font-weight: 800;
            background: #f0eadf;
            padding: 8px 10px;
            border-radius: 999px;
            margin-bottom: 16px;
          }

          .product-card h3 {
            font-size: 22px;
            margin: 0 0 10px;
          }

          .product-card p {
            color: #555;
            line-height: 1.5;
            min-height: 72px;
          }

          .product-price {
            font-size: 18px;
            font-weight: 900;
            margin: 18px 0;
          }

          .small-button {
            display: inline-block;
            color: #111;
            border: 1px solid #111;
            padding: 10px 16px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 800;
          }

          footer {
            padding: 34px 40px;
            text-align: center;
            color: #666;
          }

          @media (max-width: 700px) {
            header {
              padding: 18px 22px;
            }

            nav {
              display: none;
            }

            .hero, .section {
              padding-left: 22px;
              padding-right: 22px;
            }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="logo">Feiermiete</div>
          <nav>
            <a href="/">Start</a>
            <a href="#equipment">Equipment</a>
            <a href="/anfrage">Anfrage</a>
          </nav>
        </header>

        <main>
          <section class="hero">
            <div class="hero-inner">
              <div class="eyebrow">Equipment-Verleih in Berlin & Umgebung</div>
              <h1>Alles für deine Feier mieten.</h1>
              <p>
                Pavillons, Stehtische, Bierzeltgarnituren, Chafing Dishes, Geschirr und Buffet-Equipment für private Feiern, Firmenveranstaltungen und Catering.
              </p>
              <a class="button" href="/anfrage">Unverbindlich anfragen</a>
            </div>
          </section>

          <section class="section" id="equipment">
            <div class="section-inner">
              <h2>Beliebtes Equipment</h2>
              <div class="grid">
                ${productCards || "<p>Noch keine Produkte eingetragen.</p>"}
              </div>
            </div>
          </section>
        </main>

        <footer>
          Feiermiete · Equipment mieten für Berlin & Brandenburg
        </footer>
      </body>
    </html>
  `;
}
