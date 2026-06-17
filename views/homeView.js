function formatEuro(cents) {
  if (cents === null || cents === undefined) return null;

  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

export function renderHomePage({ products = [] }) {
  const productCards = products.map((product) => {
    const price = formatEuro(product.priceCents);
    const deposit = formatEuro(product.depositCents);

    return `
      <article class="product-card">
        <div class="product-image">
          <div class="product-symbol">${product.name?.slice(0, 1) || "F"}</div>
        </div>

        <div class="product-body">
          <div class="product-kicker">${product.category?.name || "Equipment"}</div>
          <h3>${product.name}</h3>
          <p>${product.description || "Hochwertiges Equipment für deine Feier oder Veranstaltung."}</p>
        </div>

        <div class="product-meta">
          <div>
            <span>Mietpreis</span>
            <strong>ab ${price}</strong>
          </div>
          <div>
            <span>Kaution</span>
            <strong>${deposit || "auf Anfrage"}</strong>
          </div>
        </div>

        <a class="product-button" href="/anfrage?produkt=${product.slug}">Artikel anfragen</a>
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
            --red: #c70012;
            --red-dark: #99000c;
            --dark: #141414;
            --text: #242424;
            --muted: #707070;
            --cream: #f5f0e9;
            --soft: #faf7f2;
            --line: rgba(20,20,20,0.09);
            --shadow: 0 24px 70px rgba(0,0,0,0.09);
          }

          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: var(--cream);
            color: var(--text);
          }

          a {
            color: inherit;
          }

          .topbar {
            background: #8b8b8b;
            color: white;
            font-size: 12px;
            letter-spacing: 0.04em;
            padding: 9px 40px;
          }

          .topbar-inner {
            max-width: 1240px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            gap: 34px;
            flex-wrap: wrap;
          }

          header {
            background: rgba(255,255,255,0.94);
            backdrop-filter: blur(18px);
            border-bottom: 1px solid var(--line);
            position: sticky;
            top: 0;
            z-index: 50;
          }

          .header-inner {
            max-width: 1240px;
            margin: 0 auto;
            padding: 24px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 30px;
          }

          .brand {
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .brand-mark {
            width: 42px;
            height: 52px;
            position: relative;
          }

          .brand-mark::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(145deg, var(--red), var(--red-dark));
            clip-path: polygon(0 0, 72% 0, 72% 30%, 32% 45%, 32% 100%, 0 100%);
          }

          .brand-mark::after {
            content: "";
            position: absolute;
            right: 0;
            top: 21px;
            width: 27px;
            height: 25px;
            background: linear-gradient(145deg, var(--red), var(--red-dark));
            clip-path: polygon(0 26%, 100% 0, 100% 28%, 36% 48%, 100% 70%, 100% 100%, 0 68%);
          }

          .brand-copy strong {
            display: block;
            color: var(--red);
            font-size: 30px;
            line-height: 0.95;
            font-weight: 800;
            letter-spacing: -0.035em;
          }

          .brand-copy span {
            display: block;
            margin-top: 7px;
            color: #555;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
          }

          nav {
            display: flex;
            align-items: center;
            gap: 30px;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          nav a {
            text-decoration: none;
          }

          .nav-button {
            background: var(--red);
            color: white;
            padding: 14px 20px;
            border-radius: 2px;
            box-shadow: 0 12px 26px rgba(199,0,18,0.22);
          }

          .hero {
            position: relative;
            overflow: hidden;
            background:
              linear-gradient(90deg, rgba(245,240,233,0.98) 0%, rgba(245,240,233,0.90) 48%, rgba(245,240,233,0.50) 100%),
              radial-gradient(circle at 86% 18%, rgba(199,0,18,0.13), transparent 32%),
              linear-gradient(135deg, #fff 0%, #efe6dc 100%);
          }

          .hero::before {
            content: "";
            position: absolute;
            right: -180px;
            top: 70px;
            width: 650px;
            height: 650px;
            border: 1px solid rgba(199,0,18,0.20);
            transform: rotate(35deg);
          }

          .hero::after {
            content: "";
            position: absolute;
            right: 100px;
            bottom: -130px;
            width: 260px;
            height: 260px;
            background: rgba(255,255,255,0.58);
            border: 1px solid rgba(255,255,255,0.9);
            transform: rotate(35deg);
          }

          .hero-inner {
            max-width: 1240px;
            margin: 0 auto;
            padding: 110px 40px 118px;
            position: relative;
            z-index: 2;
          }

          .hero-content {
            max-width: 760px;
          }

          .eyebrow {
            display: flex;
            align-items: center;
            gap: 13px;
            color: var(--red);
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            margin-bottom: 30px;
          }

          .eyebrow::before {
            content: "";
            width: 54px;
            height: 3px;
            background: var(--red);
          }

          h1 {
            margin: 0;
            color: var(--dark);
            font-size: clamp(54px, 7vw, 96px);
            line-height: 0.92;
            letter-spacing: -0.07em;
            text-transform: uppercase;
          }

          h1 span {
            display: block;
            color: var(--red);
          }

          .hero-text {
            max-width: 650px;
            margin: 30px 0 0;
            color: #3d3d3d;
            font-size: 21px;
            line-height: 1.55;
          }

          .actions {
            margin-top: 36px;
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
          }

          .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 54px;
            padding: 0 25px;
            text-decoration: none;
            font-weight: 900;
            border-radius: 2px;
            border: 2px solid var(--dark);
            background: white;
          }

          .button.primary {
            background: var(--red);
            border-color: var(--red);
            color: white;
            box-shadow: 0 16px 32px rgba(199,0,18,0.22);
          }

          .trust-row {
            background: white;
            border-top: 1px solid var(--line);
            border-bottom: 1px solid var(--line);
          }

          .trust-inner {
            max-width: 1240px;
            margin: 0 auto;
            padding: 26px 40px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 22px;
          }

          .trust-item {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .trust-icon {
            width: 32px;
            height: 32px;
            border: 1px solid var(--red);
            color: var(--red);
            border-radius: 50%;
            display: grid;
            place-items: center;
            flex: 0 0 auto;
          }

          .section {
            padding: 84px 40px 96px;
          }

          .section-inner {
            max-width: 1240px;
            margin: 0 auto;
          }

          .section-head {
            display: flex;
            justify-content: space-between;
            align-items: end;
            gap: 40px;
            margin-bottom: 36px;
          }

          .section-kicker {
            color: var(--red);
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 12px;
          }

          h2 {
            margin: 0;
            font-size: clamp(38px, 4vw, 58px);
            line-height: 1;
            letter-spacing: -0.06em;
          }

          .section-head p {
            max-width: 440px;
            margin: 0;
            color: var(--muted);
            line-height: 1.6;
            font-size: 17px;
          }

          .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
            gap: 22px;
          }

          .product-card {
            background: white;
            border: 1px solid var(--line);
            box-shadow: var(--shadow);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            min-height: 430px;
            transition: transform 0.18s ease, box-shadow 0.18s ease;
          }

          .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 30px 90px rgba(0,0,0,0.12);
          }

          .product-image {
            height: 150px;
            background:
              linear-gradient(135deg, rgba(20,20,20,0.82), rgba(20,20,20,0.62)),
              radial-gradient(circle at 80% 30%, rgba(199,0,18,0.45), transparent 36%),
              #222;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .product-symbol {
            width: 66px;
            height: 66px;
            border: 1px solid rgba(255,255,255,0.55);
            color: white;
            display: grid;
            place-items: center;
            font-size: 32px;
            font-weight: 900;
            text-transform: uppercase;
          }

          .product-body {
            padding: 24px 24px 18px;
            flex: 1;
          }

          .product-kicker {
            color: var(--red);
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.10em;
            margin-bottom: 14px;
          }

          .product-card h3 {
            margin: 0 0 12px;
            font-size: 25px;
            letter-spacing: -0.035em;
            line-height: 1.08;
          }

          .product-card p {
            margin: 0;
            color: #5c5c5c;
            line-height: 1.55;
            font-size: 15px;
          }

          .product-meta {
            margin: 0 24px 18px;
            padding: 16px 0;
            border-top: 1px solid var(--line);
            border-bottom: 1px solid var(--line);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          .product-meta span {
            display: block;
            color: var(--muted);
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 4px;
          }

          .product-meta strong {
            font-size: 17px;
          }

          .product-button {
            margin: 0 24px 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 48px;
            background: var(--dark);
            color: white;
            text-decoration: none;
            font-weight: 900;
            border-radius: 2px;
          }

          .product-button:hover {
            background: var(--red);
          }

          .cta {
            background: #151515;
            color: white;
            padding: 82px 40px;
          }

          .cta-inner {
            max-width: 1240px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 40px;
            align-items: center;
          }

          .cta h2 {
            color: white;
          }

          .cta p {
            color: #cfcfcf;
            font-size: 19px;
            line-height: 1.6;
            max-width: 640px;
          }

          footer {
            background: white;
            border-top: 1px solid var(--line);
            padding: 34px 40px;
            color: #777;
          }

          .footer-inner {
            max-width: 1240px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            gap: 20px;
            flex-wrap: wrap;
          }

          @media (max-width: 900px) {
            .topbar {
              display: none;
            }

            .header-inner {
              padding: 20px 22px;
            }

            nav {
              display: none;
            }

            .hero-inner,
            .section,
            .cta,
            .trust-inner,
            footer {
              padding-left: 22px;
              padding-right: 22px;
            }

            .trust-inner {
              grid-template-columns: 1fr 1fr;
            }

            .section-head,
            .cta-inner {
              display: block;
            }

            .section-head p {
              margin-top: 16px;
            }

            .brand-copy strong {
              font-size: 25px;
            }

            .brand-copy span {
              font-size: 10px;
            }

            .brand-mark {
              width: 36px;
              height: 46px;
            }
          }
        </style>
      </head>

      <body>
        <div class="topbar">
          <div class="topbar-inner">
            <span>Berlin & Brandenburg</span>
            <span>Privatfeiern</span>
            <span>Firmenevents</span>
            <span>Hochzeiten</span>
            <span>Catering-Zubehör</span>
          </div>
        </div>

        <header>
          <div class="header-inner">
            <a class="brand" href="/">
              <div class="brand-mark" aria-hidden="true"></div>
              <div class="brand-copy">
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
          </div>
        </header>

        <main>
          <section class="hero">
            <div class="hero-inner">
              <div class="hero-content">
                <div class="eyebrow">Event- & Partyequipment mieten</div>
                <h1>Sie feiern.<span>Wir liefern.</span></h1>
                <p class="hero-text">
                  Pavillons, Stehtische, Bierzeltgarnituren, Geschirr, Buffet-Equipment und Zubehör für Geburtstage, Gartenfeiern, Hochzeiten und Firmenveranstaltungen.
                </p>
                <div class="actions">
                  <a class="button primary" href="/anfrage">Unverbindlich anfragen</a>
                  <a class="button" href="#equipment">Equipment ansehen</a>
                </div>
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
                  <div class="section-kicker">Mietartikel</div>
                  <h2>Beliebtes Equipment</h2>
                </div>
                <p>
                  Wähle einzelne Artikel oder kombiniere mehrere Produkte zu einem passenden Paket für deine Feier.
                </p>
              </div>

              <div class="product-grid">
                ${productCards || "<p>Noch keine Produkte eingetragen.</p>"}
              </div>
            </div>
          </section>

          <section class="cta">
            <div class="cta-inner">
              <div>
                <div class="section-kicker">Anfrage</div>
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
          <div class="footer-inner">
            <strong>Feiermiete</strong>
            <span>Equipment für Feiern & Events · Berlin & Brandenburg</span>
          </div>
        </footer>
      </body>
    </html>
  `;
}
