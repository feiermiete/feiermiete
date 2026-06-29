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


publicRoutes.get("/chafing-dish-mieten-berlin", (req, res) => {
  res.send(renderSeoLandingPage({
    title: "Chafing Dish mieten in Berlin",
    kicker: "Buffet und Warmhalten",
    headline: "Chafing Dishes mieten f&uuml;r Buffets, Catering und warme Speisen.",
    intro: "Chafing Dishes eignen sich f&uuml;r warme Buffets, Business-Lunches, Caterings und Veranstaltungen, bei denen Speisen warmgehalten werden sollen.",
    image: "/public/images/chafing-dish.jpg",
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
    title: "Gl?hweinbeh?lter mieten in Berlin",
    kicker: "Winterevent und Ausschank",
    headline: "Gl&uuml;hweinbeh&auml;lter mieten f&uuml;r Weihnachtsfeiern, Winterevents und Ausschank.",
    intro: "Gl&uuml;hweinbeh&auml;lter sind ideal f&uuml;r Weihnachtsfeiern, Firmenhof-Events, Winterm&auml;rkte und Ausschankstationen in Berlin und Brandenburg.",
    image: "/public/images/gluehweinbehaelter.jpg",
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
    title: "Produktionsk?che mieten in Berlin",
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





