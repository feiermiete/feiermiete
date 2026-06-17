import express from "express";
import { prisma } from "../lib/prisma.js";
import { renderHomePage } from "../views/homeView.js";
import { renderInquiryPage } from "../views/inquiryView.js";
import {
  renderEquipmentPage,
  renderKitchenPage,
  renderCateringPage,
  renderServicesPage
} from "../views/contentPagesView.js";

export const publicRoutes = express.Router();

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

publicRoutes.get("/anfrage", async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { name: "asc" }
  });

  res.send(renderInquiryPage({ products }));
});

publicRoutes.post("/anfrage", async (req, res) => {
  const {
    name,
    email,
    phone,
    eventDate,
    location,
    message
  } = req.body;

  await prisma.inquiry.create({
    data: {
      name,
      email,
      phone,
      eventDate,
      location,
      message
    }
  });

  res.redirect("/anfrage?success=1");
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
              <a href="/#equipment">Equipment</a>
              <a href="/#kueche">Küche mieten</a>
              <a href="/#catering">Catering</a>
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
      <p><strong>Angaben gemäß § 5 TMG</strong></p>
      <p>
        Feiermiete<br>
        Edis Gastrobetriebe GmbH & Co. KG<br>
        Goerzallee 299<br>
        14167 Berlin
      </p>
      <p>
        E-Mail: info@feiermiete.de<br>
        Telefon: wird ergänzt
      </p>
      <p>
        Vertreten durch: Edis Mutluer<br>
        Registergericht und Registernummer werden ergänzt.
      </p>
      <p class="muted">
        Hinweis: Dieses Impressum ist ein Platzhalter und sollte vor Veröffentlichung rechtlich geprüft und vollständig ergänzt werden.
      </p>
    `
  }));
});

publicRoutes.get("/datenschutz", (req, res) => {
  res.send(renderLegalPage({
    title: "Datenschutzerklärung",
    content: `
      <p>
        Der Schutz personenbezogener Daten ist uns wichtig. Personenbezogene Daten werden nur verarbeitet,
        soweit dies zur Bearbeitung von Anfragen, zur Angebotserstellung und zur Kommunikation erforderlich ist.
      </p>
      <p>
        Wenn du über das Anfrageformular Kontakt aufnimmst, speichern wir die angegebenen Daten zur Bearbeitung deiner Anfrage.
      </p>
      <p>
        Verantwortlich für die Datenverarbeitung ist die Edis Gastrobetriebe GmbH & Co. KG, Goerzallee 299, 14167 Berlin.
      </p>
      <p class="muted">
        Hinweis: Diese Datenschutzerklärung ist ein Platzhalter und sollte vor Veröffentlichung rechtlich geprüft werden.
      </p>
    `
  }));
});

publicRoutes.get("/agb", (req, res) => {
  res.send(renderLegalPage({
    title: "Allgemeine Geschäftsbedingungen",
    content: `
      <p>
        Unsere Leistungen erfolgen auf Grundlage individueller Angebote. Mietpreise, Kautionen, Lieferkosten,
        Aufbauleistungen und Rückgabebedingungen werden im jeweiligen Angebot ausgewiesen.
      </p>
      <p>
        Die vermieteten Gegenstände sind sorgfältig zu behandeln und zum vereinbarten Zeitpunkt zurückzugeben.
        Beschädigungen, Verlust oder starke Verschmutzungen können gesondert berechnet werden.
      </p>
      <p>
        Für Produktionsküche, Catering-Koordination und Eventservice gelten individuelle Absprachen.
      </p>
      <p class="muted">
        Hinweis: Diese AGB sind ein Platzhalter und sollten vor Veröffentlichung rechtlich geprüft werden.
      </p>
    `
  }));
});

