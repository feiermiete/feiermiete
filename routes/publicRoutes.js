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


const publicSeoUrls = [
  "",
  "equipment",
  "kueche-mieten",
  "catering",
  "services",
  "anfrage",
  "event-equipment-mieten-berlin",
  "equipmentverleih-berlin",
  "party-equipment-mieten-berlin",
  "catering-equipment-mieten-berlin",
  "stehtisch-mieten-berlin",
  "bierzeltgarnitur-mieten-berlin",
  "pavillon-6x3-mieten-berlin",
  "chafing-dish-mieten-berlin",
  "getraenkespender-mieten-berlin",
  "gluehweinbehaelter-mieten-berlin",
  "geschirr-mieten-berlin",
  "besteck-mieten-berlin",
  "glaeser-mieten-berlin",
  "buffet-tisch-mieten-berlin",
  "produktionskueche-mieten-berlin",
  "equipment-hochzeit-mieten-berlin",
  "equipment-geburtstag-mieten-berlin",
  "equipment-firmenfeier-mieten-berlin",
  "equipment-sommerfest-mieten-berlin",
  "equipment-weihnachtsfeier-mieten-berlin",
  "equipment-gartenfeier-mieten-berlin",
  "equipment-lieferung-aufbau-berlin",
  "eventservice-berlin",
  "buffet-aufbau-berlin"
];

publicRoutes.get("/sitemap.xml", (req, res) => {
  const baseUrl = "https://www.feiermiete.de";
  const urls = publicSeoUrls.map((url) => {
    const loc = url ? `${baseUrl}/${url}` : baseUrl;
    return `
  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url ? "0.7" : "1.0"}</priority>
  </url>`;
  }).join("");

  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`);
});

publicRoutes.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://www.feiermiete.de/sitemap.xml
`);
});

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


publicRoutes.get("/chafing-dish-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Chafing Dish mieten in Berlin",
    kicker: "Buffet und Warmhalten",
    headline: "Chafing Dishes mieten f&uuml;r Buffets, Catering und warme Speisen.",
    intro: "Chafing Dishes eignen sich f&uuml;r warme Buffets, Business-Lunches, Caterings und Veranstaltungen, bei denen Speisen warmgehalten werden sollen.",
    image: "/public/images/chafing-dish.jpg",
    canonicalPath: req.path,
    bullets: [
      { title: "Ideal f&uuml;r Buffets", text: "Geeignet f&uuml;r warme Speisen, Beilagen, Business-Lunches und Eventbuffets." },
      { title: "Mit Zubeh&ouml;r", text: "Auf Wunsch mit Buffet-Equipment, Geschirr, Besteck und Serviermaterial." },
      { title: "Lieferung m&ouml;glich", text: "Lieferung, Abholung und Zeitfenster k&ouml;nnen individuell abgestimmt werden." },
      { title: "Kombinierbar", text: "Praktisch mit Buffet-Tischen, Getr&auml;nkespendern und Catering-Koordination." }
    ],
    sections: [
      {
        kicker: "Einsatz",
        title: "Wof&uuml;r eignen sich Chafing Dishes?",
        text: "Chafing Dishes werden genutzt, um warme Speisen bei Buffets und Caterings praktisch warmzuhalten. Sie sind besonders sinnvoll bei Firmenveranstaltungen, Familienfeiern und gr&ouml;&szlig;eren Buffets."
      }
    ]
  }));
});


publicRoutes.get("/gluehweinbehaelter-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Glühweinbehälter mieten in Berlin",
    kicker: "Winterevent und Ausschank",
    headline: "Gl&uuml;hweinbeh&auml;lter mieten f&uuml;r Weihnachtsfeiern, Winterevents und Ausschank.",
    intro: "Gl&uuml;hweinbeh&auml;lter sind ideal f&uuml;r Weihnachtsfeiern, Firmenhof-Events, Winterm&auml;rkte und Ausschankstationen in Berlin und Brandenburg.",
    image: "/public/images/gluehweinbehaelter.jpg",
    canonicalPath: req.path,
    bullets: [
      { title: "F&uuml;r Winterevents", text: "Ideal f&uuml;r Gl&uuml;hwein, Punsch, Tee oder hei&szlig;e Getr&auml;nke." },
      { title: "Einfach anfragen", text: "Datum, Ort, Mietdauer und Menge senden, wir pr&uuml;fen die Verf&uuml;gbarkeit." },
      { title: "Mit Equipment kombinieren", text: "Passend mit Stehtischen, Bechern, Pavillon oder Getr&auml;nkestation." },
      { title: "Lieferung m&ouml;glich", text: "Auf Wunsch mit Lieferung und Abholung nach Absprache." }
    ],
    sections: [
      {
        kicker: "Paketidee",
        title: "Gl&uuml;hwein-Event als Komplettpaket",
        text: "F&uuml;r Winterevents kann der Gl&uuml;hweinbeh&auml;lter mit Stehtischen, Pavillon, Bechern und weiterem Zubeh&ouml;r kombiniert werden."
      }
    ]
  }));
});


publicRoutes.get("/produktionskueche-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Produktionsküche mieten in Berlin",
    kicker: "Gastro-K&uuml;che Berlin",
    headline: "Produktionsk&uuml;che mieten f&uuml;r Catering, Pop-ups und Vorproduktion.",
    intro: "Die Gastro-K&uuml;che kann f&uuml;r Vorbereitung, Produktion, Kommissionierung oder Eventabwicklung angefragt werden. Ideal f&uuml;r Caterer, Food-Start-ups und Pop-up-Konzepte.",
    image: "/public/images/gastro-kitchen.jpg",
    ctaLabel: "K&uuml;che anfragen",
    bullets: [
      { title: "Stundenweise oder tageweise", text: "Flexible Anfrage je nach Produktionsaufwand und Zeitraum." },
      { title: "F&uuml;r Caterer und Food-Konzepte", text: "Geeignet f&uuml;r Vorbereitung, Eventproduktion, Pop-ups und gr&ouml;&szlig;ere Mengen." },
      { title: "Optional mit Equipment", text: "Chafing Dishes, Transportboxen, Buffetartikel und Logistik k&ouml;nnen erg&auml;nzt werden." },
      { title: "Individuelle Abstimmung", text: "Nutzung, Zeiten, Ablauf und Anforderungen werden vorab gekl&auml;rt." }
    ],
    sections: [
      {
        kicker: "Nutzung",
        title: "Wann lohnt sich eine Produktionsk&uuml;che?",
        text: "Eine Produktionsk&uuml;che ist sinnvoll, wenn Speisen vorbereitet, Mengen produziert, Buffets kommissioniert oder Pop-up-Abl&auml;ufe vorbereitet werden sollen."
      }
    ]
  }));
});


// SEO LANDING PAGES START

publicRoutes.get("/event-equipment-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Event-Equipment mieten in Berlin",
    kicker: "Event-Equipment Berlin",
    headline: "Event-Equipment mieten f&uuml;r Feiern, Firmenveranstaltungen und Buffets.",
    intro: "Feiermiete bietet Mietartikel f&uuml;r private Feiern, Firmenveranstaltungen, Gartenfeiern, Buffets und Caterings in Berlin und Brandenburg.",
    image: "/public/images/equipment-photo.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Event-Equipment kann aus einzelnen Mietartikeln oder passenden Paketen bestehen. Besonders gefragt sind Stehtische, Pavillons, Bierzeltgarnituren, Geschirr, Besteck, Chafing Dishes und Getr&auml;nkespender."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      },
      {
            "href": "/getraenkespender-mieten-berlin",
            "label": "Getr&auml;nkespender mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/equipmentverleih-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Equipmentverleih Berlin",
    kicker: "Equipmentverleih",
    headline: "Equipmentverleih in Berlin f&uuml;r private und gewerbliche Veranstaltungen.",
    intro: "Ob kleine Feier, Firmenveranstaltung oder Buffet: Feiermiete stellt passendes Equipment f&uuml;r Events in Berlin und Brandenburg zusammen.",
    image: "/public/images/equipment-photo.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Beim Equipmentverleih geht es nicht nur um einzelne Artikel, sondern um eine sinnvolle Zusammenstellung nach Anlass, Personenanzahl, Ort und Ablauf."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      },
      {
            "href": "/getraenkespender-mieten-berlin",
            "label": "Getr&auml;nkespender mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/party-equipment-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Party-Equipment mieten in Berlin",
    kicker: "Party-Equipment",
    headline: "Party-Equipment mieten f&uuml;r Geburtstage, Gartenfeiern und private Events.",
    intro: "Feiermiete hilft bei der passenden Ausstattung f&uuml;r private Feiern, Geburtstage, Gartenpartys und kleinere Veranstaltungen.",
    image: "/public/images/hero-event.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "F&uuml;r Partys sind vor allem Stehtische, Bierzeltgarnituren, Pavillons, Getr&auml;nkespender, Geschirr und einfache Buffetartikel sinnvoll."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      },
      {
            "href": "/getraenkespender-mieten-berlin",
            "label": "Getr&auml;nkespender mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/catering-equipment-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Catering-Equipment mieten in Berlin",
    kicker: "Catering-Equipment",
    headline: "Catering-Equipment mieten f&uuml;r Buffets, Lunches und Eventverpflegung.",
    intro: "F&uuml;r Caterings, Buffets und Business-Lunches kannst du passendes Equipment wie Chafing Dishes, Geschirr, Besteck, Buffet-Tische und Getr&auml;nkespender anfragen.",
    image: "/public/images/catering-photo.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Catering-Equipment sorgt daf&uuml;r, dass Speisen praktisch ausgegeben, warmgehalten und sauber pr&auml;sentiert werden k&ouml;nnen."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      },
      {
            "href": "/getraenkespender-mieten-berlin",
            "label": "Getr&auml;nkespender mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/stehtisch-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Stehtisch mieten in Berlin",
    kicker: "Tische & Empfang",
    headline: "Stehtische mieten f&uuml;r Empfang, Firmenfeier, Gartenfeier und Buffetbereich.",
    intro: "Stehtische sind praktisch f&uuml;r Empf&auml;nge, Sommerfeste, Firmenfeiern, private Feiern und lockere Buffetbereiche.",
    image: "/public/images/stehtisch.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Stehtische eignen sich f&uuml;r Getr&auml;nke, Snacks, kurze Gespr&auml;che und flexible Eventfl&auml;chen. Sie lassen sich gut mit Pavillons, Bierzeltgarnituren oder Getr&auml;nkespendern kombinieren."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      },
      {
            "href": "/getraenkespender-mieten-berlin",
            "label": "Getr&auml;nkespender mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/bierzeltgarnitur-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Bierzeltgarnitur mieten in Berlin",
    kicker: "Sitzpl&auml;tze",
    headline: "Bierzeltgarnituren mieten f&uuml;r Gartenfeiern, Sommerfeste und Vereinsveranstaltungen.",
    intro: "Bierzeltgarnituren schaffen schnell Sitzpl&auml;tze f&uuml;r private Feiern, Firmenfeste, Outdoor-Events und lockere Veranstaltungen.",
    image: "/public/images/bierzeltgarnitur.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Bierzeltgarnituren sind robust, flexibel einsetzbar und ideal, wenn viele Sitzpl&auml;tze unkompliziert ben&ouml;tigt werden."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      },
      {
            "href": "/getraenkespender-mieten-berlin",
            "label": "Getr&auml;nkespender mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/pavillon-6x3-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Pavillon 6x3 mieten in Berlin",
    kicker: "Outdoor & Wetterschutz",
    headline: "Pavillon 6x3 mieten f&uuml;r Gartenfeiern, Outdoor-Events und Verkaufsfl&auml;chen.",
    intro: "Ein Pavillon ist praktisch als Wetterschutz, Buffetbereich, Ausschankstation oder &uuml;berdachte Fl&auml;che bei Outdoor-Events.",
    image: "/public/images/pavillon-6x3.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Ein 6x3-Pavillon bietet flexible &uuml;berdachte Fl&auml;che und kann mit Stehtischen, Bierzeltgarnituren oder Buffet-Equipment kombiniert werden."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      },
      {
            "href": "/getraenkespender-mieten-berlin",
            "label": "Getr&auml;nkespender mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/chafing-dish-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Chafing Dish mieten in Berlin",
    kicker: "Buffet & Warmhalten",
    headline: "Chafing Dishes mieten f&uuml;r Buffets, Catering und warme Speisen.",
    intro: "Chafing Dishes eignen sich f&uuml;r warme Buffets, Business-Lunches, Caterings und Veranstaltungen, bei denen Speisen warmgehalten werden sollen.",
    image: "/public/images/chafing-dish.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Chafing Dishes werden genutzt, um warme Speisen bei Buffets und Caterings praktisch warmzuhalten. Sie sind sinnvoll bei Firmenveranstaltungen, Familienfeiern und gr&ouml;&szlig;eren Buffets."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/getraenkespender-mieten-berlin",
            "label": "Getr&auml;nkespender mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/getraenkespender-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Getraenkespender mieten in Berlin",
    kicker: "Getr&auml;nke-Equipment",
    headline: "Getr&auml;nkespender mieten f&uuml;r Buffets, Sommerfeste und Selbstbedienung.",
    intro: "Getr&auml;nkespender sind ideal f&uuml;r Wasser, Limonade, Eistee, Infused Water und einfache Selbstbedienungsstationen.",
    image: "/public/images/getraenkespender.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Getr&auml;nkespender helfen, Buffets und Veranstaltungen sauber zu organisieren. Sie sind besonders praktisch bei Sommerfesten, Meetings, Gartenfeiern und Caterings."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/gluehweinbehaelter-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Gluehweinbehaelter mieten in Berlin",
    kicker: "Winterevent & Ausschank",
    headline: "Gl&uuml;hweinbeh&auml;lter mieten f&uuml;r Weihnachtsfeiern, Winterevents und Ausschank.",
    intro: "Gl&uuml;hweinbeh&auml;lter sind ideal f&uuml;r Weihnachtsfeiern, Firmenhof-Events, Winterm&auml;rkte und Ausschankstationen in Berlin und Brandenburg.",
    image: "/public/images/gluehweinbehaelter.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "F&uuml;r Winterevents kann der Gl&uuml;hweinbeh&auml;lter mit Stehtischen, Pavillon, Bechern und weiterem Zubeh&ouml;r kombiniert werden."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/geschirr-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Geschirr mieten in Berlin",
    kicker: "Geschirr & Besteck",
    headline: "Geschirr mieten f&uuml;r Feiern, Buffets, Caterings und Firmenveranstaltungen.",
    intro: "F&uuml;r Buffets, Feiern und Caterings kannst du Teller, Schalen, Besteck, Gl&auml;ser und Serviermaterial passend zum Anlass anfragen.",
    image: "/public/images/cutlery-set.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Gemietetes Geschirr hilft, Veranstaltungen sauber und einheitlich auszustatten. Besonders praktisch ist die Kombination mit Lieferung, R&uuml;ckgabe und weiterem Buffet-Equipment."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/besteck-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Besteck mieten in Berlin",
    kicker: "Geschirr & Besteck",
    headline: "Besteck mieten f&uuml;r Catering, Buffet und Eventverpflegung.",
    intro: "Besteck kann passend zu Geschirr, Buffet, Catering und Personenanzahl angefragt werden.",
    image: "/public/images/cutlery-set.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Besteck wird h&auml;ufig gemeinsam mit Tellern, Gl&auml;sern, Serviermaterial und Buffet-Equipment ben&ouml;tigt."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/glaeser-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Glaeser mieten in Berlin",
    kicker: "Gl&auml;ser & Ausschank",
    headline: "Gl&auml;ser mieten f&uuml;r Feiern, Empf&auml;nge und Veranstaltungen.",
    intro: "Gl&auml;ser eignen sich f&uuml;r Empf&auml;nge, Feiern, Buffets, Getr&auml;nkestationen und Firmenveranstaltungen.",
    image: "/public/images/glassware-photo.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Gl&auml;ser k&ouml;nnen mit Getr&auml;nkespendern, Stehtischen, Buffet-Equipment und weiterem Geschirr kombiniert werden."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/buffet-tisch-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Buffet-Tisch mieten in Berlin",
    kicker: "Buffet-Aufbau",
    headline: "Buffet-Tische mieten f&uuml;r Catering, Speisenausgabe und Eventbuffets.",
    intro: "Buffet-Tische schaffen Fl&auml;che f&uuml;r Speisen, Getr&auml;nke, Serviermaterial und eine saubere Ausgabe.",
    image: "/public/images/buffet-table.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Ein Buffet-Tisch ist sinnvoll, wenn Speisen &uuml;bersichtlich platziert werden sollen. Er l&auml;sst sich mit Chafing Dishes, Geschirr, Besteck und Getr&auml;nkespendern kombinieren."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/produktionskueche-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Produktionskueche mieten in Berlin",
    kicker: "Gastro-K&uuml;che Berlin",
    headline: "Produktionsk&uuml;che mieten f&uuml;r Catering, Pop-ups und Vorproduktion.",
    intro: "Die Gastro-K&uuml;che kann f&uuml;r Vorbereitung, Produktion, Kommissionierung oder Eventabwicklung angefragt werden. Ideal f&uuml;r Caterer, Food-Start-ups und Pop-up-Konzepte.",
    image: "/public/images/gastro-kitchen.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Eine Produktionsk&uuml;che ist sinnvoll, wenn Speisen vorbereitet, Mengen produziert, Buffets kommissioniert oder Pop-up-Abl&auml;ufe vorbereitet werden sollen."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/equipment-hochzeit-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Equipment fuer Hochzeit mieten in Berlin",
    kicker: "Hochzeit",
    headline: "Equipment f&uuml;r Hochzeit mieten in Berlin und Brandenburg.",
    intro: "F&uuml;r Hochzeiten k&ouml;nnen Tische, Stehtische, Geschirr, Gl&auml;ser, Buffet-Equipment, Pavillons und Getr&auml;nkestationen angefragt werden.",
    image: "/public/images/hero-event.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Bei Hochzeiten ist wichtig, dass Ausstattung, Lieferung, Aufbau und R&uuml;ckgabe gut abgestimmt sind. Feiermiete hilft bei einer passenden Zusammenstellung."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/equipment-geburtstag-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Equipment fuer Geburtstag mieten in Berlin",
    kicker: "Geburtstag",
    headline: "Equipment f&uuml;r Geburtstag mieten: Tische, Pavillon, Geschirr und Buffetartikel.",
    intro: "F&uuml;r Geburtstage und private Feiern kannst du passendes Party-Equipment in Berlin und Brandenburg anfragen.",
    image: "/public/images/hero-event.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "F&uuml;r Geburtstage werden oft Stehtische, Bierzeltgarnituren, Pavillon, Geschirr, Getr&auml;nkespender oder Buffetartikel ben&ouml;tigt."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/equipment-firmenfeier-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Equipment fuer Firmenfeier mieten in Berlin",
    kicker: "Firmenfeier",
    headline: "Equipment f&uuml;r Firmenfeiern, Sommerfeste und Team-Events mieten.",
    intro: "F&uuml;r Firmenfeiern k&ouml;nnen Mietartikel, Buffet-Equipment, Getr&auml;nkestationen, Lieferung und Aufbau kombiniert werden.",
    image: "/public/images/service-photo.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Bei Firmenfeiern geht es um einen reibungslosen Ablauf. Deshalb werden Artikel, Lieferung, Aufbau und R&uuml;ckgabe nach Zeitfenster geplant."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/equipment-sommerfest-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Equipment fuer Sommerfest mieten in Berlin",
    kicker: "Sommerfest",
    headline: "Equipment f&uuml;r Sommerfeste mieten: Pavillon, Stehtische, Getr&auml;nkespender und Sitzpl&auml;tze.",
    intro: "F&uuml;r Sommerfeste sind wetterfeste und flexible Mietartikel besonders wichtig.",
    image: "/public/images/hero-event.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Sommerfeste ben&ouml;tigen oft Pavillons, Stehtische, Bierzeltgarnituren, Getr&auml;nkespender und Buffetfl&auml;chen."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/equipment-weihnachtsfeier-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Equipment fuer Weihnachtsfeier mieten in Berlin",
    kicker: "Weihnachtsfeier",
    headline: "Equipment f&uuml;r Weihnachtsfeiern und Winterevents mieten.",
    intro: "F&uuml;r Weihnachtsfeiern und Winterevents k&ouml;nnen Gl&uuml;hweinbeh&auml;lter, Stehtische, Pavillon, Ausschank und Buffetartikel kombiniert werden.",
    image: "/public/images/gluehweinbehaelter.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Winterevents funktionieren besonders gut mit Gl&uuml;hweinbeh&auml;ltern, Stehtischen, Bechern, Pavillon und klar geplantem Aufbau."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/equipment-gartenfeier-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Equipment fuer Gartenfeier mieten in Berlin",
    kicker: "Gartenfeier",
    headline: "Equipment f&uuml;r Gartenfeiern mieten: Pavillon, Bierzeltgarnituren und Getr&auml;nkespender.",
    intro: "F&uuml;r Gartenfeiern kannst du praktische Mietartikel wie Pavillon, Stehtische, Bierzeltgarnituren, Geschirr und Getr&auml;nkespender anfragen.",
    image: "/public/images/pavillon-6x3.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Gartenfeiern brauchen flexible Ausstattung, die schnell aufgebaut und unkompliziert genutzt werden kann."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/equipment-lieferung-aufbau-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Equipment Lieferung und Aufbau Berlin",
    kicker: "Lieferung & Aufbau",
    headline: "Equipment mit Lieferung, Aufbau und Abholung in Berlin anfragen.",
    intro: "Je nach Umfang kann Feiermiete Lieferung, Aufbau, Abholung und Zeitfenster f&uuml;r Mietartikel planen.",
    image: "/public/images/service-photo.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Lieferung und Aufbau sind besonders sinnvoll, wenn mehrere Artikel, gr&ouml;&szlig;ere Mengen oder feste Zeitfenster geplant werden."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/eventservice-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Eventservice Berlin",
    kicker: "Eventservice",
    headline: "Eventservice in Berlin f&uuml;r Equipment, Lieferung, Aufbau und Ablauf.",
    intro: "Feiermiete verbindet Mietartikel, Lieferung, Aufbau, Catering-Koordination und praktische Eventservices.",
    image: "/public/images/services.svg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Eventservice bedeutet, dass Equipment und Ablauf gemeinsam gedacht werden: Was wird gebraucht, wann wird geliefert, wie wird aufgebaut und wann erfolgt die Abholung?"
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});


publicRoutes.get("/buffet-aufbau-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Buffet-Aufbau Berlin",
    kicker: "Buffet-Aufbau",
    headline: "Buffet-Aufbau in Berlin mit Chafing Dishes, Tischen, Geschirr und Getr&auml;nke-Equipment.",
    intro: "F&uuml;r Buffets k&ouml;nnen Chafing Dishes, Buffet-Tische, Geschirr, Besteck und Getr&auml;nkestationen kombiniert werden.",
    image: "/public/images/buffet-photo.jpg",
    canonicalPath: req.path,
    bullets: [
      {
            "title": "Individuell anfragen",
            "text": "Artikel, Mengen, Mietdauer und Ablauf werden passend zum Event abgestimmt."
      },
      {
            "title": "Lieferung m&ouml;glich",
            "text": "Lieferung und Abholung sind je nach Ort, Umfang und Zeitfenster m&ouml;glich."
      },
      {
            "title": "Kombinierbar",
            "text": "Mietartikel k&ouml;nnen mit weiterem Equipment, Buffetartikeln oder Services kombiniert werden."
      },
      {
            "title": "Berlin & Brandenburg",
            "text": "Geeignet f&uuml;r private Feiern, Firmenveranstaltungen, Caterings und Pop-ups."
      }
],
    sections: [
      {
            "kicker": "Einsatz",
            "title": "Wof&uuml;r ist diese Leistung geeignet?",
            "text": "Ein guter Buffet-Aufbau sorgt daf&uuml;r, dass Speisen, Getr&auml;nke und Serviermaterial klar platziert sind und der Ablauf f&uuml;r G&auml;ste einfach bleibt."
      },
      {
            "kicker": "Planung",
            "title": "Was sollte bei der Anfrage angegeben werden?",
            "text": "Wichtig sind Datum, Ort, Uhrzeit, Mietdauer, Personenanzahl, gew&uuml;nschte Artikel und ob Lieferung, Aufbau oder Abholung ben&ouml;tigt werden. Je genauer die Angaben sind, desto besser kann ein passendes Angebot erstellt werden."
      }
],
    faq: [
      {
            "question": "Kann ich diese Leistung kurzfristig anfragen?",
            "answer": "Kurzfristige Anfragen sind je nach Verf&uuml;gbarkeit m&ouml;glich. Je fr&uuml;her Datum, Ort und Umfang feststehen, desto besser kann geplant werden."
      },
      {
            "question": "Kann ich mehrere Artikel kombinieren?",
            "answer": "Ja, Mietartikel k&ouml;nnen passend zum Anlass kombiniert werden, zum Beispiel mit Stehtischen, Pavillon, Geschirr, Chafing Dishes, Getr&auml;nkespendern oder Lieferung."
      },
      {
            "question": "Wie bekomme ich ein Angebot?",
            "answer": "Nutze das Anfrageformular und sende Datum, Ort, Personenanzahl, Mietdauer und gew&uuml;nschte Artikel. Danach wird ein individuelles Angebot erstellt."
      },
      {
            "question": "Gibt es Lieferung und Abholung?",
            "answer": "Lieferung und Abholung sind je nach Umfang, Ort und Zeitfenster m&ouml;glich und werden im Angebot separat ber&uuml;cksichtigt."
      }
],
    relatedLinks: [
      {
            "href": "/event-equipment-mieten-berlin",
            "label": "Event-Equipment mieten in Berlin"
      },
      {
            "href": "/equipmentverleih-berlin",
            "label": "Equipmentverleih Berlin"
      },
      {
            "href": "/party-equipment-mieten-berlin",
            "label": "Party-Equipment mieten in Berlin"
      },
      {
            "href": "/catering-equipment-mieten-berlin",
            "label": "Catering-Equipment mieten in Berlin"
      },
      {
            "href": "/stehtisch-mieten-berlin",
            "label": "Stehtisch mieten in Berlin"
      },
      {
            "href": "/bierzeltgarnitur-mieten-berlin",
            "label": "Bierzeltgarnitur mieten in Berlin"
      },
      {
            "href": "/pavillon-6x3-mieten-berlin",
            "label": "Pavillon 6x3 mieten in Berlin"
      },
      {
            "href": "/chafing-dish-mieten-berlin",
            "label": "Chafing Dish mieten in Berlin"
      }
]
  }));
});

// SEO LANDING PAGES END

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

  console.log(`[INQUIRY] Artikelpositionen für Anfrage #${inquiry.id} gespeichert. Mailjet wird versucht.`);

  let mailStatus = "not_attempted";

  try {
    const savedItems = await prisma.inquiryItem.findMany({
      where: { inquiryId: inquiry.id },
      orderBy: { id: "asc" }
    });

    const mailResult = await sendInquiryNotification(inquiry, savedItems);
    await sendCustomerInquiryConfirmation(inquiry, savedItems);
    mailStatus = mailResult?.status || "sent";
    console.log(`[INQUIRY] Mailjet-Mail für Anfrage #${inquiry.id} Status: ${mailStatus}`);
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
              <a href="/widerruf">Widerruf</a>
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


      <h2>Angaben gem&auml;&szlig; &sect; 5 DDG</h2>

      <p>
        <strong>Edis Gastrobetriebe GmbH &amp; Co. KG</strong><br>
        Goerzallee 299<br>
        14167 Berlin<br>
        Deutschland
      </p>

      <p>
        Telefon: <a href="tel:+4917623374012">0176 23374012</a><br>
        E-Mail: <a href="mailto:info@feiermiete.de">info@feiermiete.de</a>
      </p>

      <h2>Vertreten durch</h2>
      <p>
        Edis Beteiligungs GmbH, diese vertreten durch den Gesch&auml;ftsf&uuml;hrer Edis Mutluer.
      </p>

      <h2>Registereintrag</h2>
      <p>
        Edis Gastrobetriebe GmbH &amp; Co. KG<br>
        Handelsregister: HRA 59626 B<br>
        Registergericht: Amtsgericht Charlottenburg
      </p>

      <h2>Pers&ouml;nlich haftende Gesellschafterin</h2>
      <p>
        Edis Beteiligungs GmbH<br>
        Handelsregister: HRB 237237 B<br>
        Registergericht: Amtsgericht Charlottenburg<br>
        Gesch&auml;ftsf&uuml;hrer: Edis Mutluer
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gem&auml;&szlig; &sect; 27a Umsatzsteuergesetz:<br>
        DE351408498
      </p>

      <h2>Verantwortlich f&uuml;r den Inhalt</h2>
      <p>
        Edis Mutluer<br>
        Goerzallee 299<br>
        14167 Berlin
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung f&uuml;r Inhalte</h2>
      <p>
        Die Inhalte dieser Website wurden mit gr&ouml;&szlig;ter Sorgfalt erstellt. F&uuml;r die Richtigkeit, Vollst&auml;ndigkeit und Aktualit&auml;t der Inhalte &uuml;bernehmen wir jedoch keine Gew&auml;hr. Als Diensteanbieter sind wir f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
      </p>

      <h2>Haftung f&uuml;r Links</h2>
      <p>
        Diese Website kann Links zu externen Websites Dritter enthalten. Auf deren Inhalte haben wir keinen Einfluss. F&uuml;r fremde Inhalte &uuml;bernehmen wir keine Gew&auml;hr. F&uuml;r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die auf dieser Website erstellten Inhalte, Texte, Bilder, Grafiken und Gestaltungen unterliegen dem deutschen Urheberrecht. Eine Verwendung, Vervielf&auml;ltigung oder Weitergabe au&szlig;erhalb der gesetzlichen Grenzen bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers.
      </p>
    `
  }));
});

publicRoutes.get("/datenschutz", (req, res) => {
  res.send(renderLegalPage({
    title: "Datenschutzerkl&auml;rung",
    content: `


      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich f&uuml;r die Datenverarbeitung auf dieser Website ist:
      </p>
      <p>
        <strong>Edis Gastrobetriebe GmbH &amp; Co. KG</strong><br>
        Goerzallee 299<br>
        14167 Berlin<br>
        Deutschland
      </p>
      <p>
        Telefon: <a href="tel:+4917623374012">0176 23374012</a><br>
        E-Mail: <a href="mailto:info@feiermiete.de">info@feiermiete.de</a>
      </p>

      <h2>2. Allgemeine Hinweise zur Datenverarbeitung</h2>
      <p>
        Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung dieser Website, zur Bearbeitung von Anfragen, zur Erstellung von Angeboten, zur Durchf&uuml;hrung von Vertr&auml;gen oder zur Erf&uuml;llung gesetzlicher Pflichten erforderlich ist.
      </p>
      <p>
        Personenbezogene Daten sind alle Informationen, mit denen eine Person direkt oder indirekt identifiziert werden kann, zum Beispiel Name, Firma, Adresse, Telefonnummer, E-Mail-Adresse, Lieferadresse, Veranstaltungsdaten oder Inhalte einer Anfrage.
      </p>

      <h2>3. Hosting und technische Bereitstellung</h2>
      <p>
        Diese Website wird technisch &uuml;ber einen externen Hosting-Anbieter betrieben. Dabei k&ouml;nnen technische Zugriffsdaten verarbeitet werden, zum Beispiel IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seiten, Browsertyp, Betriebssystem und technische Protokolldaten.
      </p>
      <p>
        Die Verarbeitung erfolgt zur sicheren und stabilen Bereitstellung der Website, zur Fehleranalyse und zur Abwehr von Missbrauch. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und funktionsf&auml;higen Internetangebot gem&auml;&szlig; Art. 6 Abs. 1 lit. f DSGVO.
      </p>

      <h2>4. Anfrageformular und Kontaktaufnahme</h2>
      <p>
        Wenn du &uuml;ber das Anfrageformular oder per E-Mail Kontakt mit uns aufnimmst, verarbeiten wir die von dir angegebenen Daten. Dazu k&ouml;nnen insbesondere geh&ouml;ren:
      </p>
      <ul>
        <li>Name</li>
        <li>Firma</li>
        <li>E-Mail-Adresse</li>
        <li>Telefonnummer</li>
        <li>Veranstaltungsdatum</li>
        <li>Lieferadresse oder Veranstaltungsort</li>
        <li>Personenanzahl</li>
        <li>gew&uuml;nschte Mietartikel oder Leistungen</li>
        <li>Mietdauer</li>
        <li>Nachricht und weitere Angaben zur Anfrage</li>
      </ul>
      <p>
        Diese Daten nutzen wir zur Bearbeitung deiner Anfrage, zur Erstellung eines Angebots, zur Abstimmung von Lieferung, Aufbau, Abholung, K&uuml;chennutzung, Catering oder Eventservice sowie zur Durchf&uuml;hrung vorvertraglicher und vertraglicher Ma&szlig;nahmen.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Durchf&uuml;hrung vorvertraglicher Ma&szlig;nahmen oder eines Vertrags erforderlich ist. Soweit die Verarbeitung zur Organisation und Nachweisf&uuml;hrung erforderlich ist, erfolgt sie au&szlig;erdem auf Grundlage unseres berechtigten Interesses gem&auml;&szlig; Art. 6 Abs. 1 lit. f DSGVO.
      </p>

      <h2>5. Kunden- und Vertragsdaten</h2>
      <p>
        Wenn ein Angebot angenommen wird oder ein Vertrag zustande kommt, verarbeiten wir die erforderlichen Kunden-, Rechnungs-, Leistungs- und Zahlungsdaten. Dazu geh&ouml;ren insbesondere Name, Firma, Anschrift, Kontaktdaten, gebuchte Leistungen, Mietartikel, Preise, Kautionen, Zahlungsstatus, Liefer- und R&uuml;ckgabedaten sowie vertragsbezogene Kommunikation.
      </p>
      <p>
        Diese Daten werden zur Vertragsdurchf&uuml;hrung, Rechnungsstellung, Zahlungsabwicklung, Buchhaltung und Erf&uuml;llung gesetzlicher Aufbewahrungspflichten verarbeitet.
      </p>

      <h2>6. E-Mail-Versand</h2>
      <p>
        F&uuml;r den Versand von Anfragebest&auml;tigungen, internen Benachrichtigungen und vertragsbezogener Kommunikation kann ein externer E-Mail-Dienstleister eingesetzt werden. Dabei werden die f&uuml;r den Versand notwendigen Daten verarbeitet, insbesondere E-Mail-Adresse, Name, Anfrageinhalt und technische Versandinformationen.
      </p>

      <h2>7. Cookies und technisch notwendige Funktionen</h2>
      <p>
        Diese Website kann technisch notwendige Cookies oder vergleichbare Technologien verwenden, soweit diese f&uuml;r den Betrieb der Website erforderlich sind. Dazu k&ouml;nnen zum Beispiel Funktionen f&uuml;r Anfragen, Warenkorb/Sammelanfrage, Sicherheit oder Sitzungsverwaltung geh&ouml;ren.
      </p>
      <p>
        Technisch nicht notwendige Tracking- oder Marketing-Cookies werden nach aktuellem Stand nicht eingesetzt. Sollten k&uuml;nftig Analyse-, Marketing- oder Trackingdienste verwendet werden, wird diese Datenschutzerkl&auml;rung entsprechend erg&auml;nzt und, soweit erforderlich, eine Einwilligung eingeholt.
      </p>

      <h2>8. Datenbank und Speicherung</h2>
      <p>
        Anfrage-, Kunden- und Vertragsdaten k&ouml;nnen in einer Datenbank gespeichert werden. Die Speicherung erfolgt nur so lange, wie dies zur Bearbeitung der Anfrage, Durchf&uuml;hrung des Vertrags, Erf&uuml;llung gesetzlicher Pflichten oder Wahrung berechtigter Interessen erforderlich ist.
      </p>

      <h2>9. Zahlungsdaten</h2>
      <p>
        Feiermiete arbeitet grunds&auml;tzlich mit Vorkasse. Zahlungsinformationen werden verarbeitet, soweit dies zur Zuordnung von Zahlungen, Erstellung von Rechnungen, Verwaltung von Kautionen und Durchf&uuml;hrung des Vertrags erforderlich ist.
      </p>

      <h2>10. Empf&auml;nger von Daten</h2>
      <p>
        Eine Weitergabe personenbezogener Daten erfolgt nur, wenn dies zur Bearbeitung der Anfrage oder Durchf&uuml;hrung des Vertrags erforderlich ist, zum Beispiel an Hosting-Anbieter, E-Mail-Dienstleister, Steuerberatung, Zahlungsdienstleister, Transport- oder Servicepartner, soweit diese f&uuml;r die Leistungserbringung notwendig sind.
      </p>
      <p>
        Eine Weitergabe zu Werbezwecken an Dritte erfolgt nicht.
      </p>

      <h2>11. Speicherdauer</h2>
      <p>
        Wir speichern personenbezogene Daten nur so lange, wie dies f&uuml;r die jeweiligen Zwecke erforderlich ist. Vertrags- und Rechnungsdaten werden entsprechend gesetzlicher Aufbewahrungsfristen gespeichert. Anfragedaten k&ouml;nnen gespeichert werden, solange dies zur Bearbeitung, Nachverfolgung oder Angebotsdokumentation erforderlich ist.
      </p>

      <h2>12. Rechte betroffener Personen</h2>
      <p>
        Du hast nach Ma&szlig;gabe der gesetzlichen Voraussetzungen das Recht auf Auskunft, Berichtigung, L&ouml;schung, Einschr&auml;nkung der Verarbeitung, Daten&uuml;bertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen.
      </p>
      <p>
        Du hast au&szlig;erdem das Recht, dich bei einer zust&auml;ndigen Datenschutzaufsichtsbeh&ouml;rde zu beschweren.
      </p>

      <h2>13. Aktualit&auml;t dieser Datenschutzerkl&auml;rung</h2>
      <p>
        Diese Datenschutzerkl&auml;rung wird angepasst, wenn neue Dienste, Tracking-Tools, Zahlungsanbieter, Kartenfunktionen, Social-Media-Einbindungen oder sonstige externe Dienste eingesetzt werden.
      </p>
    `
  }));
});

publicRoutes.get("/agb", (req, res) => {
  res.send(renderLegalPage({
    title: "AGB / Mietbedingungen",
    content: `


      <h2>1. Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Gesch&auml;ftsbedingungen gelten f&uuml;r alle Anfragen, Angebote, Buchungen und Vertr&auml;ge &uuml;ber Mietartikel, Event-Equipment, Lieferung, Aufbau, Abholung, Produktionsk&uuml;che, Catering-Koordination und erg&auml;nzende Eventservices von Feiermiete.
      </p>
      <p>
        Feiermiete richtet sich sowohl an Unternehmer als auch an Verbraucher.
      </p>

      <h2>2. Anfrage und Vertragsschluss</h2>
      <p>
        Die Darstellung von Mietartikeln und Leistungen auf der Website stellt kein verbindliches Angebot dar. Kunden k&ouml;nnen &uuml;ber die Website, per E-Mail, telefonisch oder auf anderem Weg eine unverbindliche Anfrage stellen.
      </p>
      <p>
        Ein Vertrag kommt erst zustande, wenn Feiermiete ein individuelles Angebot erstellt und der Kunde dieses Angebot schriftlich best&auml;tigt. Als schriftliche Best&auml;tigung gilt auch eine Best&auml;tigung per E-Mail oder in sonstiger Textform.
      </p>

      <h2>3. Preise, Kaution und Zahlung</h2>
      <p>
        Alle Preise, Mietpreise, Kautionen, Lieferkosten, Aufbaukosten, Servicekosten und sonstigen Kosten ergeben sich aus dem jeweiligen Angebot.
      </p>
      <p>
        Die Zahlung erfolgt grunds&auml;tzlich per Vorkasse. Feiermiete ist berechtigt, die Herausgabe von Mietartikeln, die Durchf&uuml;hrung von Lieferungen, den Aufbau oder die Bereitstellung von Leistungen von der vollst&auml;ndigen Zahlung des vereinbarten Betrags und der vereinbarten Kaution abh&auml;ngig zu machen.
      </p>
      <p>
        Die Kaution dient als Sicherheit f&uuml;r Sch&auml;den, Verlust, fehlende Teile, starke Verschmutzung, versp&auml;tete R&uuml;ckgabe oder sonstige Forderungen aus dem Mietverh&auml;ltnis.
      </p>

      <h2>4. Mietdauer, &Uuml;bergabe und R&uuml;ckgabe</h2>
      <p>
        Die Mietdauer, der &Uuml;bergabezeitpunkt, der Lieferzeitraum, der Abholzeitraum und der R&uuml;ckgabezeitpunkt werden individuell vereinbart.
      </p>
      <p>
        Mietartikel sind vollst&auml;ndig, p&uuml;nktlich und in ordnungsgem&auml;&szlig;em Zustand zur&uuml;ckzugeben. Normale Gebrauchsspuren sind zul&auml;ssig. Starke Verschmutzungen, Besch&auml;digungen, fehlende Teile oder Verlust werden gesondert berechnet.
      </p>

      <h2>5. Lieferung, Aufbau und Abholung</h2>
      <p>
        Lieferung, Aufbau und Abholung erfolgen nur, wenn sie im Angebot ausdr&uuml;cklich vereinbart sind.
      </p>
      <p>
        Der Kunde hat sicherzustellen, dass am vereinbarten Ort und im vereinbarten Zeitraum eine empfangsberechtigte Person erreichbar ist. Der Kunde muss au&szlig;erdem daf&uuml;r sorgen, dass der Zugang zum Veranstaltungsort m&ouml;glich ist und ausreichende Halte-, Lade- oder Parkm&ouml;glichkeiten bestehen.
      </p>
      <p>
        Wartezeiten, erschwerte Zug&auml;nge, fehlende Parkm&ouml;glichkeiten, nicht erreichbare Ansprechpartner, kurzfristige &Auml;nderungen oder zus&auml;tzlicher Aufwand k&ouml;nnen gesondert berechnet werden.
      </p>

      <h2>6. Reinigung, Sch&auml;den und Verlust</h2>
      <p>
        Mietartikel sind pfleglich zu behandeln. Der Kunde haftet f&uuml;r Besch&auml;digung, Verlust, fehlende Teile, unsachgem&auml;&szlig;e Nutzung und starke Verschmutzung w&auml;hrend des vereinbarten Mietzeitraums.
      </p>
      <p>
        Bei Besch&auml;digung oder Verlust kann Feiermiete Reparaturkosten, Reinigungskosten, Wiederbeschaffungswert, Minderwert oder sonstige erforderliche Kosten berechnen. Offene Forderungen k&ouml;nnen mit der Kaution verrechnet werden.
      </p>

      <h2>7. Stornierung durch den Kunden</h2>
      <p>
        Stornierungen m&uuml;ssen in Textform erfolgen.
      </p>
      <p>
        Es gelten folgende Stornobedingungen, sofern im Angebot nichts anderes vereinbart ist:
      </p>
      <ul>
        <li>bis 14 Tage vor dem vereinbarten Termin: kostenfrei</li>
        <li>13 bis 7 Tage vor dem vereinbarten Termin: 30 % des vereinbarten Gesamtbetrags</li>
        <li>6 bis 2 Tage vor dem vereinbarten Termin: 50 % des vereinbarten Gesamtbetrags</li>
        <li>weniger als 48 Stunden vor dem vereinbarten Termin: 80 % des vereinbarten Gesamtbetrags</li>
        <li>am Veranstaltungstag oder bei Nichterscheinen / Nichtabnahme: 100 % des vereinbarten Gesamtbetrags</li>
      </ul>
      <p>
        Bereits entstandene Fremdkosten, Sonderbeschaffungen, Personal-, Logistik- oder Vorbereitungskosten k&ouml;nnen unabh&auml;ngig vom Stornierungszeitpunkt zus&auml;tzlich berechnet werden, soweit sie nicht mehr vermieden werden k&ouml;nnen.
      </p>

      <h2>8. Produktionsk&uuml;che</h2>
      <p>
        Die Nutzung einer Produktionsk&uuml;che erfolgt nur nach vorheriger Vereinbarung und Einweisung. Der Kunde ist f&uuml;r die Einhaltung der geltenden Hygiene-, Lebensmittel-, Arbeitsschutz- und Nutzungsvorgaben verantwortlich, soweit diese in seinem Einflussbereich liegen.
      </p>
      <p>
        Die K&uuml;che darf nur im vereinbarten Umfang, zur vereinbarten Zeit und durch berechtigte Personen genutzt werden. Eine Weitergabe an Dritte ist ohne vorherige Zustimmung von Feiermiete nicht gestattet.
      </p>
      <p>
        Der Kunde ist verpflichtet, die K&uuml;che, Ger&auml;te, Fl&auml;chen und Ausstattung ordnungsgem&auml;&szlig;, sauber und vollst&auml;ndig zur&uuml;ckzugeben. Sch&auml;den, starke Verschmutzungen, fehlende Gegenst&auml;nde oder zus&auml;tzlicher Reinigungsaufwand werden berechnet.
      </p>

      <h2>9. Catering-Koordination und Eventservice</h2>
      <p>
        Soweit Feiermiete Catering-Koordination, Personal, Aufbau, Buffetservice, Logistik oder Eventservice anbietet, richten sich Umfang, Zeiten, Preise und Verantwortlichkeiten nach dem jeweiligen Angebot.
      </p>
      <p>
        Kurzfristige &Auml;nderungen, zus&auml;tzliche Leistungen oder Mehraufwand k&ouml;nnen gesondert berechnet werden.
      </p>

      <h2>10. R&uuml;ckzahlung der Kaution</h2>
      <p>
        Die Kaution wird nach vollst&auml;ndiger und mangelfreier R&uuml;ckgabe der Mietartikel beziehungsweise nach ordnungsgem&auml;&szlig;er Beendigung der Leistung zur&uuml;ckgezahlt.
      </p>
      <p>
        Die R&uuml;ckzahlung erfolgt in der Regel innerhalb von 7 Werktagen nach Pr&uuml;fung der zur&uuml;ckgegebenen Artikel. Offene Forderungen wegen Sch&auml;den, Verlust, Reinigung, versp&auml;teter R&uuml;ckgabe oder sonstiger Kosten k&ouml;nnen mit der Kaution verrechnet werden.
      </p>

      <h2>11. Haftung</h2>
      <p>
        Feiermiete haftet nach den gesetzlichen Vorschriften f&uuml;r Vorsatz und grobe Fahrl&auml;ssigkeit sowie bei Verletzung von Leben, K&ouml;rper oder Gesundheit.
      </p>
      <p>
        F&uuml;r einfache Fahrl&auml;ssigkeit haftet Feiermiete nur bei Verletzung wesentlicher Vertragspflichten. In diesem Fall ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
      </p>
      <p>
        Die Haftung des Kunden f&uuml;r Sch&auml;den, Verlust, fehlende Mietartikel, starke Verschmutzung oder unsachgem&auml;&szlig;e Nutzung bleibt unber&uuml;hrt.
      </p>

      <h2>12. Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht.
      </p>
      <p>
        Sollten einzelne Bestimmungen dieser Bedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der &uuml;brigen Bestimmungen unber&uuml;hrt.
      </p>
      <p>
        Bei Unternehmern ist Gerichtsstand, soweit zul&auml;ssig, der Sitz von Feiermiete.
      </p>
    `
  }));
});







publicRoutes.get("/widerruf", (req, res) => {
  res.send(renderLegalPage({
    title: "Widerrufsbelehrung",
    content: `


      <h2>1. Verbraucherhinweis</h2>
      <p>
        Verbrauchern kann bei Fernabsatzvertr&auml;gen grunds&auml;tzlich ein gesetzliches Widerrufsrecht zustehen.
      </p>
      <p>
        Ein Widerrufsrecht kann nach gesetzlichen Vorschriften ausgeschlossen sein oder nicht bestehen, insbesondere wenn es sich um Dienstleistungen im Zusammenhang mit Freizeitbet&auml;tigungen handelt und f&uuml;r die Vertragserf&uuml;llung ein spezifischer Termin oder Zeitraum vorgesehen ist.
      </p>
      <p>
        Da Feiermiete h&auml;ufig terminbezogene Leistungen f&uuml;r Veranstaltungen, Feiern, Lieferungen, Aufbauten, Abholungen, Mietzeitr&auml;ume oder K&uuml;chennutzungen erbringt, wird im jeweiligen Angebot gesondert darauf hingewiesen, ob ein Widerrufsrecht besteht oder ausgeschlossen ist.
      </p>

      <h2>2. Widerrufsrecht, soweit es besteht</h2>
      <p>
        Soweit ein gesetzliches Widerrufsrecht besteht und nicht ausgeschlossen ist, haben Verbraucher das Recht, binnen vierzehn Tagen ohne Angabe von Gr&uuml;nden einen Vertrag zu widerrufen.
      </p>
      <p>
        Die Widerrufsfrist betr&auml;gt vierzehn Tage ab dem Tag des Vertragsschlusses.
      </p>

      <h2>3. Aus&uuml;bung des Widerrufs</h2>
      <p>
        Um das Widerrufsrecht auszu&uuml;ben, muss der Verbraucher Feiermiete mittels einer eindeutigen Erkl&auml;rung, zum Beispiel per E-Mail oder Brief, &uuml;ber den Entschluss informieren, den Vertrag zu widerrufen.
      </p>
      <p>
        Der Widerruf kann gerichtet werden an:
      </p>
      <p>
        Edis Gastrobetriebe GmbH &amp; Co. KG<br>
        Goerzallee 299<br>
        14167 Berlin<br>
        E-Mail: <a href="mailto:info@feiermiete.de">info@feiermiete.de</a>
      </p>
      <p>
        Zur Wahrung der Widerrufsfrist reicht es aus, dass die Mitteilung &uuml;ber die Aus&uuml;bung des Widerrufsrechts vor Ablauf der Widerrufsfrist abgesendet wird.
      </p>

      <h2>4. Folgen des Widerrufs</h2>
      <p>
        Wenn der Vertrag wirksam widerrufen wird, erstatten wir alle Zahlungen, die wir vom Verbraucher erhalten haben, sp&auml;testens binnen vierzehn Tagen ab dem Tag, an dem die Mitteilung &uuml;ber den Widerruf bei uns eingegangen ist. F&uuml;r die R&uuml;ckzahlung verwenden wir dasselbe Zahlungsmittel, das bei der urspr&uuml;nglichen Zahlung eingesetzt wurde, sofern nichts anderes vereinbart wurde.
      </p>
      <p>
        Hat der Verbraucher verlangt, dass die Dienstleistung w&auml;hrend der Widerrufsfrist beginnen soll, so hat er einen angemessenen Betrag zu zahlen, der dem Anteil der bis zum Zeitpunkt des Widerrufs bereits erbrachten Leistungen entspricht.
      </p>

      <h2>5. Muster-Widerrufsformular</h2>
      <p>
        Wenn du den Vertrag widerrufen willst, kannst du den folgenden Text verwenden:
      </p>
      <p>
        An Edis Gastrobetriebe GmbH &amp; Co. KG, Goerzallee 299, 14167 Berlin, E-Mail: info@feiermiete.de
      </p>
      <p>
        Hiermit widerrufe ich den von mir abgeschlossenen Vertrag &uuml;ber folgende Leistung / Mietartikel:<br>
        Bestellt / angefragt am:<br>
        Name des Verbrauchers:<br>
        Anschrift des Verbrauchers:<br>
        Datum:
      </p>
    `
  }));
});
