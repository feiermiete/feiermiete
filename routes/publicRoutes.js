import express from "express";
import { prisma } from "../lib/prisma.js";
import { sendInquiryNotification, sendCustomerInquiryConfirmation } from "../utils/mailjet.js";
import { renderHomePage } from "../views/homeView.js";
import { renderInquiryPage } from "../views/inquiryView.js";
import {
  renderEquipmentPage,
  renderKitchenPage,
  renderCateringPage,
  renderServicesPage,
  renderSeoLandingPage
} from "../views/contentPagesView.js";

export const publicRoutes = express.Router();

function parseEventDate(value) {
  if (!value) return null;

  const trimmed = String(value).trim();

  // Format: 2026-08-24
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T12:00:00`);
  }

  // Format: 24.08.2026
  const germanMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (germanMatch) {
    const day = germanMatch[1].padStart(2, "0");
    const month = germanMatch[2].padStart(2, "0");
    const year = germanMatch[3];
    return new Date(`${year}-${month}-${day}T12:00:00`);
  }

  return null;
}

publicRoutes.get("/", async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  res.send(renderHomePage({ products }));
});

publicRoutes.get("/equipment", async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  res.send(renderEquipmentPage({ products }));
});

publicRoutes.get("/kueche-mieten", (req, res) => {
  res.send(renderKitchenPage());
});

publicRoutes.get("/catering", (req, res) => {
  res.send(renderCateringPage());
});

publicRoutes.get("/services", (req, res) => {
  res.send(renderServicesPage());
});


publicRoutes.get("/event-equipment-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Event-Equipment mieten in Berlin",
    kicker: "Event-Equipment Berlin",
    headline: "Event-Equipment mieten f&uuml;r Feiern, Firmenveranstaltungen und Buffets.",
    intro: "Feiermiete bietet Mietartikel f&uuml;r private Feiern, Firmenveranstaltungen, Gartenfeiern, Buffets und Caterings in Berlin und Brandenburg.",
    image: "/public/images/equipment-photo.jpg",
    bullets: [
      { title: "Equipment nach Bedarf", text: "Stehtische, Pavillons, Bierzeltgarnituren, Chafing Dishes, Geschirr und Getr&auml;nkespender." },
      { title: "Lieferung m&ouml;glich", text: "Auf Wunsch mit Lieferung, Abholung und abgestimmtem Zeitfenster." },
      { title: "Private und gewerbliche Events", text: "Geeignet f&uuml;r Geburtstage, Firmenfeiern, Sommerfeste, Buffets und Caterings." },
      { title: "Unverbindliches Angebot", text: "Wir pr&uuml;fen Verf&uuml;gbarkeit, Mietdauer, Kaution und Logistik individuell." }
    ],
    sections: [
      {
        kicker: "Sortiment",
        title: "Welche Artikel k&ouml;nnen gemietet werden?",
        text: "Je nach Anlass k&ouml;nnen einzelne Mietartikel oder komplette Zusammenstellungen angefragt werden. Besonders gefragt sind Stehtische, Pavillons, Buffetartikel, Geschirr, Besteck und Getr&auml;nke-Equipment."
      }
    ]
  }));
});

publicRoutes.get("/anfrage", async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { name: "asc" }
  });

  res.send(renderInquiryPage({
    products,
    success: req.query.success === "1"
  }));
});

publicRoutes.post("/anfrage", async (req, res) => {
  console.log("[INQUIRY] Anfrage POST /anfrage erhalten");
  const {
    name,
    companyName,
    email,
    phone,
    eventDate,
    location,
    product,
    guestCount,
    rentalDuration,
    serviceType,
    deliveryNeeded,
    message,
    cartData
  } = req.body;

  let cartItems = [];

  try {
    cartItems = cartData ? JSON.parse(cartData) : [];
  } catch {
    cartItems = [];
  }

  const cartSummary = cartItems.length
    ? cartItems.map((item) => {
        const quantity = Number(item.quantity || 1);
        const price = item.price ? ` | Mietpreis: ${item.price}` : "";
        const deposit = item.deposit ? ` | Kaution: ${item.deposit}` : "";
        return `${quantity} x ${item.name || "Artikel"}${price}${deposit}`;
      }).join("\n")
    : "";

  const selectedDetails = [
    cartSummary ? `Angefragte Artikel:\n${cartSummary}` : null,
    product ? `Wunschartikel / Leistung: ${product}` : null,
    serviceType ? `Art der Anfrage: ${serviceType}` : null,
    guestCount ? `Personenanzahl: ${guestCount}` : null,
    rentalDuration ? `Mietdauer / Zeitraum: ${rentalDuration}` : null,
    deliveryNeeded ? `Lieferung gewünscht: ${deliveryNeeded}` : null,
    message ? `Nachricht: ${message}` : null
  ].filter(Boolean).join("\n\n");

  console.log("[INQUIRY] Anfrage wird in Datenbank gespeichert");

  const inquiry = await prisma.inquiry.create({
    data: {
      customerName: name,
      companyName: companyName || null,
      email,
      phone: phone || null,
      eventDate: parseEventDate(eventDate),
      deliveryAddress: location || null,
      message: selectedDetails || null,
      status: "NEW"
    }
  });

  console.log(`[INQUIRY] Anfrage #${inquiry.id} gespeichert. Warenkorb-Positionen: ${cartItems.length}`);

  for (const item of cartItems) {
    const productRecord = await prisma.product.findFirst({
      where: {
        name: {
          equals: item.name
        }
      }
    });

    await prisma.inquiryItem.create({
      data: {
        inquiryId: inquiry.id,
        productId: productRecord ? productRecord.id : null,
        name: item.name || "Artikel",
        category: item.category || null,
        quantity: Number(item.quantity || 1),
        priceText: item.price || null,
        depositText: item.deposit || null,
        stockText: item.stock || null,
        priceCents: productRecord ? productRecord.priceCents : 0,
        depositCents: productRecord ? productRecord.depositCents : 0
      }
    });
  }

  console.log(`[INQUIRY] Artikelpositionen f?r Anfrage #${inquiry.id} gespeichert. Mailjet wird versucht.`);

  let mailStatus = "not_attempted";

  try {
    const savedItems = await prisma.inquiryItem.findMany({
      where: { inquiryId: inquiry.id },
      orderBy: { id: "asc" }
    });

    const mailResult = await sendInquiryNotification(inquiry, savedItems);
    await sendCustomerInquiryConfirmation(inquiry, savedItems);
    mailStatus = mailResult?.status || "sent";
    console.log(`[INQUIRY] Mailjet-Mail f?r Anfrage #${inquiry.id} Status: ${mailStatus}`);
  } catch (mailError) {
    mailStatus = "error";
    console.error("Anfrage wurde gespeichert, aber Mailjet-Mail konnte nicht gesendet werden:", mailError);
  }

  console.log(`[INQUIRY] Anfrage #${inquiry.id} abgeschlossen. Redirect auf Erfolg. Mailstatus: ${mailStatus}`);
  res.redirect(`/anfrage?success=1&mail=${encodeURIComponent(mailStatus)}`);
});

function renderLegalPage({ title, content }) {
  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title} - Feiermiete</title>
        <link rel="stylesheet" href="/public/css/style.css" />
      </head>
      <body>
        <header class="site-header">
          <div class="header-inner">
            <a class="brand" href="/">
              <div class="brand-main">Feiermiete</div>
              <div class="brand-sub">Equipment für Feiern & Events</div>
            </a>
            <nav>
              <a href="/">Home</a>
              <a href="/equipment">Equipment</a>
              <a href="/kueche-mieten">Küche mieten</a>
              <a href="/catering">Catering</a>
              <a href="/services">Services</a>
              <a class="nav-button" href="/anfrage">Anfrage</a>
            </nav>
          </div>
        </header>

        <main class="legal-page">
          <div class="wide-inner legal-box">
            <div class="section-kicker">Rechtliches</div>
            <h1>${title}</h1>
            ${content}
          </div>
        </main>

        <footer class="site-footer">
          <div class="wide-inner footer-grid">
            <div>
              <strong>Feiermiete</strong>
              <p>Equipment · Küche · Catering · Eventservice · Berlin & Brandenburg</p>
            </div>
            <div class="footer-links">
              <a href="/impressum">Impressum</a>
              <a href="/datenschutz">Datenschutz</a>
              <a href="/agb">AGB</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  `;
}



publicRoutes.get("/impressum", (req, res) => {
  res.send(renderLegalPage({
    title: "Impressum",
    content: `
      <p><strong>Angaben nach den gesetzlichen Informationspflichten</strong></p>

      <p>
        Feiermiete<br>
        Edis Gastrobetriebe GmbH & Co. KG<br>
        Goerzallee 299<br>
        14167 Berlin<br>
        Deutschland
      </p>

      <p>
        E-Mail: info@feiermiete.de<br>
        Telefon: wird erg?nzt
      </p>

      <p>
        Vertreten durch die pers?nlich haftende Gesellschafterin:<br>
        Edis Beteiligungs GmbH
      </p>

      <p>
        Registergericht, Registernummer und Umsatzsteuer-ID werden erg?nzt, sofern vorhanden.
      </p>

      <p>
        Verantwortlich f?r den Inhalt dieser Website:<br>
        Edis Gastrobetriebe GmbH & Co. KG, Goerzallee 299, 14167 Berlin
      </p>

      <p class="muted">
        Hinweis: Dieses Impressum ist als Arbeitsfassung hinterlegt und sollte vor Ver?ffentlichung vollst?ndig
        mit Registerdaten, Telefonnummer, Umsatzsteuerangaben und rechtlicher Pr?fung finalisiert werden.
      </p>
    `
  }));
});

publicRoutes.get("/datenschutz", (req, res) => {
  res.send(renderLegalPage({
    title: "Datenschutzerkl?rung",
    content: `
      <p>
        Der Schutz personenbezogener Daten ist uns wichtig. Personenbezogene Daten werden nur verarbeitet,
        soweit dies zur Bearbeitung von Anfragen, zur Angebotserstellung, zur Vertragsabwicklung und zur Kommunikation erforderlich ist.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich f?r die Datenverarbeitung ist:<br>
        Edis Gastrobetriebe GmbH & Co. KG<br>
        Goerzallee 299<br>
        14167 Berlin<br>
        E-Mail: info@feiermiete.de
      </p>

      <h2>2. Anfrageformular</h2>
      <p>
        Wenn du ?ber das Anfrageformular Kontakt aufnimmst, verarbeiten wir die von dir angegebenen Daten,
        insbesondere Name, Firma, E-Mail-Adresse, Telefonnummer, Eventdatum, Lieferadresse, Personenanzahl,
        Mietdauer, ausgew?hlte Artikel und deine Nachricht. Diese Daten nutzen wir zur Bearbeitung deiner Anfrage,
        zur Angebotserstellung und zur weiteren Abstimmung.
      </p>

      <h2>3. E-Mail-Kommunikation</h2>
      <p>
        F?r den Versand von internen Anfragebenachrichtigungen und Kundenbest?tigungen kann ein externer
        E-Mail-Dienstleister eingesetzt werden. Dabei werden die f?r den E-Mail-Versand notwendigen Daten verarbeitet,
        insbesondere E-Mail-Adresse, Name, Anfrageinhalt und technische Versandinformationen.
      </p>

      <h2>4. Speicherung</h2>
      <p>
        Anfragen und zugeh?rige Daten werden gespeichert, solange dies f?r Bearbeitung, Angebotserstellung,
        Vertragsabwicklung, Nachweiszwecke oder gesetzliche Aufbewahrungspflichten erforderlich ist.
      </p>

      <h2>5. Rechte betroffener Personen</h2>
      <p>
        Du hast im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft, Berichtigung, L?schung,
        Einschr?nkung der Verarbeitung, Daten?bertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen.
        Anfragen hierzu k?nnen an info@feiermiete.de gesendet werden.
      </p>

      <p class="muted">
        Hinweis: Diese Datenschutzerkl?rung ist eine Arbeitsfassung und sollte vor Ver?ffentlichung rechtlich gepr?ft
        und an die tats?chlich eingesetzten Dienste, Cookies, Tracking-Tools und Hosting-Strukturen angepasst werden.
      </p>
    `
  }));
});

publicRoutes.get("/agb", (req, res) => {
  res.send(renderLegalPage({
    title: "Allgemeine Gesch?ftsbedingungen",
    content: `
      <p>
        Diese Allgemeinen Gesch?ftsbedingungen gelten f?r Mietartikel, Event-Equipment, K?chenvermietung,
        Lieferung, Aufbau, Abholung, Catering-Koordination und erg?nzende Serviceleistungen von Feiermiete,
        soweit keine abweichende individuelle Vereinbarung getroffen wurde.
      </p>

      <h2>1. Anfrage und Angebot</h2>
      <p>
        Die Darstellung von Artikeln und Leistungen auf der Website stellt kein verbindliches Angebot dar.
        Eine Buchung kommt erst zustande, wenn eine Anfrage gepr?ft und durch Feiermiete schriftlich best?tigt wurde.
      </p>

      <h2>2. Mietpreise, Kaution und Zahlung</h2>
      <p>
        Mietpreise, Kautionen, Lieferkosten, Aufbauleistungen und R?ckgabebedingungen werden im jeweiligen Angebot
        oder Vertrag ausgewiesen. Die Kaution dient als Sicherheit f?r besch?digte, fehlende oder stark verschmutzte Artikel.
      </p>

      <h2>3. Mietdauer, ?bergabe und R?ckgabe</h2>
      <p>
        Die konkrete Mietdauer, ?bergabe, Lieferung, Abholung und R?ckgabe werden individuell abgestimmt.
        Mietartikel sind vollst?ndig, p?nktlich und im vereinbarten Zustand zur?ckzugeben.
      </p>

      <h2>4. Besch?digung, Verlust und Reinigung</h2>
      <p>
        Besch?digte, fehlende oder stark verschmutzte Mietartikel k?nnen mit Reparaturkosten, Reinigungskosten,
        Wiederbeschaffungswert oder Zeitwert berechnet werden. Offene Betr?ge k?nnen mit der Kaution verrechnet werden.
      </p>

      <h2>5. Lieferung, Aufbau und Abholung</h2>
      <p>
        Lieferung, Aufbau und Abholung erfolgen nur, wenn sie ausdr?cklich vereinbart wurden.
        Wartezeiten, erschwerte Zug?nge, fehlende Parkm?glichkeiten oder nachtr?gliche ?nderungen k?nnen zus?tzliche Kosten verursachen.
      </p>

      <h2>6. Stornierung und ?nderungen</h2>
      <p>
        ?nderungen oder Stornierungen sind so fr?h wie m?glich mitzuteilen. Bereits entstandene Kosten,
        reservierte Artikel, Personal-, Logistik- oder Vorbereitungskosten k?nnen je nach Zeitpunkt und Aufwand berechnet werden.
      </p>

      <h2>7. Produktionsk?che, Catering und Services</h2>
      <p>
        F?r Produktionsk?che, Catering-Koordination und Eventservice gelten individuelle Absprachen,
        insbesondere zu Nutzungszeit, Reinigung, ?bergabe, Haftung, Ausstattung, Personal und Zusatzleistungen.
      </p>

      <p class="muted">
        Hinweis: Diese AGB sind eine Arbeitsfassung und sollten vor Ver?ffentlichung rechtlich gepr?ft und an den
        tats?chlichen Miet-, Liefer-, Kautions- und Stornoablauf angepasst werden.
      </p>
    `
  }));
});





