export function renderHomePage({ products = [] }) {
  const productCards = products.map((product) => {
    const price = (product.priceCents / 100).toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR"
    });

    return `
      <article class="product-card">
        <div class="product-top">
          <span>${product.category?.name || "Equipment"}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.description || ""}</p>
        <div class="product-footer">
          <strong>ab ${price}</strong>
          <a href="/anfrage?produkt=${product.slug}">Anfragen</a>
        </div>
      </article>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Feiermiete - Equipment für Feiern & Events mieten</title>
        <style>
          :root {
            --red: #c8101a;
            --dark: #171717;
            --muted: #666666;
            --cream: #f6f1eb;
            --line: rgba(0,0,0,0.08);
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: var(--cream);
            color: var(--dark);
          }

          a {
            color: inherit;
          }

          .topbar {
            height: 38px;
            background: #8c8c8c;
            color: white;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
          }

          header {
            background: white;
            border-bottom: 1px solid var(--line);
            padding: 24px 46px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 20;
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 16px;
            text-decoration: none;
          }

          .mark {
            width: 44px;
            height: 44px;
            background: var(--red);
            color: white;
            display: grid;
            place-items: center;
            font-weight: 900;
            font-size: 26px;
            letter-spacing: -0.1em;
          }

          .brand-text strong {
            display: block;
            color: var(--red);
            font-size: 28px;
            letter-spacing: 0.02em;
            line-height: 1;
          }

          .brand-text span {
            display: block;
            margin-top: 5px;
            color: #777;
            font-size: 12px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          nav {
            display: flex;
            align-items: center;
            gap: 30px;
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
          }

          nav a {
            text-decoration: none;
          }

          .nav-button {
            background: var(--red);
            color: white;
            padding: 13px 18px;
            border-radius: 4px;
          }

          .hero {
            min-height: 660px;
            position: relative;
            display: flex;
            align-items: center;
            overflow: hidden;
            background:
              linear-gradient(90deg, rgba(246,241,235,0.96) 0%, rgba(246,241,235,0.82) 48%, rgba(246,241,235,0.24) 100%),
              radial-gradient(circle at 75% 40%, rgba(200,16,26,0.14), transparent 34%),
              linear-gradient(135deg, #ffffff 0%, #efe6dc 100%);
          }

          .hero::after {
            content: "";
            position: absolute;
            right: -120px;
            top: 80px;
            width: 560px;
            height: 560px;
            border: 1px solid rgba(200,16,26,0.18);
            transform: rotate(35deg);
          }

          .hero-inner {
            position: relative;
            z-index: 2;
            max-width: 1180px;
            width: 100%;
            margin: 0 auto;
            padding: 80px 46px;
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            font-weight: 900;
            color: var(--red);
            text-transform: uppercase;
            letter-spacing: 0.13em;
            font-size: 13px;
            margin-bottom: 28px;
          }

          .eyebrow::before {
            content: "";
            width: 46px;
            height: 3px;
            background: var(--red);
          }

          h1 {
            max-width: 780px;
            margin: 0;
            font-size: clamp(48px, 7vw, 92px);
            line-height: 0.93;
            letter-spacing: -0.065em;
            text-transform: uppercase;
          }

          h1 span {
            color: var(--red);
          }

          .hero-text {
            max-width: 670px;
            margin-top: 28px;
            color: #3f3f3f;
            font-size: 21px;
            line-height: 1.55;
          }

          .actions {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            margin-top: 34px;
          }

          .button {
            display: inline-block;
            text-decoration: none;
            font-weight: 900;
            padding: 16px 24px;
            border-radius: 4px;
            border: 2px solid var(--dark);
            background: white;
          }

          .button.primary {
            background: var(--red);
            border-color: var(--red);
            color: white;
          }

          .trust-row {
            background: white;
            border-top: 1px solid var(--line);
            border-bottom: 1px solid var(--line);
          }

          .trust-inner {
            max-width: 1180px;
            margin: 0 auto;
            padding: 24px 46px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
          }

          .trust-item {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .trust-icon {
            width: 34px;
            height: 34px;
            border: 1px solid var(--red);
            color: var(--red);
            border-radius: 999px;
            display: grid;
            place-items: center;
            font-weight: 900;
          }

          .section {
            padding: 78px 46px;
          }

          .section-inner {
            max-width: 1180px;
            margin: 0 auto;
          }

          .section-head {
            display: flex;
            justify-content: space-between;
            align-items: end;
            gap: 24px;
            margin-bottom: 32px;
          }

          h2 {
            margin: 0;
            font-size: 46px;
            letter-spacing: -0.05em;
          }

          .section-head p {
            max-width: 420px;
            color: var(--muted);
            line-height: 1.55;
            margin: 0;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
          }

          .product-card {
            background: white;
            border: 1px solid var(--line);
            padding: 26px;
            min-height: 275px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 18px 45px rgba(0,0,0,0.055);
          }

          .product-top span {
            display: inline-block;
            color: var(--red);
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .product-card h3 {
            font-size: 24px;
            margin: 18px 0 10px;
            letter-spacing: -0.03em;
          }

          .product-card p {
            color: #5a5a5a;
            line-height: 1.55;
          }

          .product-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 18px;
          }

          .product-footer strong {
            font-size: 18px;
          }

          .product-footer a {
            color: var(--red);
            font-weight: 900;
            text-decoration: none;
          }

          .cta {
            background: #171717;
            color: white;
            padding: 76px 46px;
          }

          .cta-inner {
            max-width: 1180px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 30px;
            align-items: center;
          }

          .cta h2 {
            color: white;
          }

          .cta p {
            color: #cfcfcf;
            font-size: 19px;
            line-height: 1.55;
          }

          footer {
            background: white;
            padding: 32px 46px;
            text-align: center;
            color: #777;
            border-top: 1px solid var(--line);
          }

          @media (max-width: 850px) {
            header {
              padding: 20px 22px;
            }

            nav {
              display: none;
            }

            .hero-inner,
            .section,
            .cta,
            .trust-inner {
              padding-left: 22px;
              padding-right: 22px;
            }

            .trust-inner {
              grid-template-columns: 1fr 1fr;
            }

            .section-head,
            .cta-inner {
              grid-template-columns: 1fr;
              display: block;
            }

            .hero {
              min-height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="topbar">
          <span>Berlin & Brandenburg</span>
          <span>Privatfeiern</span>
          <span>Firmenevents</span>
          <span>Catering-Zubehör</span>
        </div>

        <header>
          <a class="brand" href="/">
            <div class="mark">F</div>
            <div class="brand-text">
              <strong>Feiermiete</strong>
              <span>Equipment für Feiern & Events</span>
            </div>
          </a>

          <nav>
            <a href="/">Home</a>
            <a href="#equipment">Equipment</a>
            <a href="/admin">Admin</a>
            <a class="nav-button" href="/anfrage">Anfrage</a>
          </nav>
        </header>

        <main>
          <section class="hero">
            <div class="hero-inner">
              <div class="eyebrow">Event- & Partyequipment mieten</div>
              <h1>Sie feiern. <br><span>Wir liefern.</span></h1>
              <p class="hero-text">
                Pavillons, Stehtische, Bierzeltgarnituren, Geschirr, Buffet-Equipment und Zubehör für Geburtstage, Gartenfeiern, Hochzeiten und Firmenveranstaltungen.
              </p>
              <div class="actions">
                <a class="button primary" href="/anfrage">Unverbindlich anfragen</a>
                <a class="button" href="#equipment">Equipment ansehen</a>
              </div>
            </div>
          </section>

          <section class="trust-row">
            <div class="trust-inner">
              <div class="trust-item"><div class="trust-icon">✓</div> Zuverlässige Lieferung</div>
              <div class="trust-item"><div class="trust-icon">✓</div> Für Privat & Firma</div>
              <div class="trust-item"><div class="trust-icon">✓</div> Flexible Pakete</div>
              <div class="trust-item"><div class="trust-icon">✓</div> Berlin & Umgebung</div>
            </div>
          </section>

          <section class="section" id="equipment">
            <div class="section-inner">
              <div class="section-head">
                <div>
                  <h2>Beliebtes Equipment</h2>
                </div>
                <p>
                  Wähle einzelne Artikel oder kombiniere mehrere Produkte zu einem passenden Paket für deine Feier.
                </p>
              </div>

              <div class="grid">
                ${productCards || "<p>Noch keine Produkte eingetragen.</p>"}
              </div>
            </div>
          </section>

          <section class="cta">
            <div class="cta-inner">
              <div>
                <h2>Du planst eine Feier?</h2>
                <p>
                  Schick uns Datum, Ort und gewünschtes Equipment. Wir melden uns mit einer passenden Empfehlung und einem Angebot.
                </p>
              </div>
              <div>
                <a class="button primary" href="/anfrage">Jetzt Anfrage senden</a>
              </div>
            </div>
          </section>
        </main>

        <footer>
          Feiermiete · Equipment für Feiern & Events · Berlin & Brandenburg
        </footer>
      </body>
    </html>
  `;
}
