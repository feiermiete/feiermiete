import express from "express";
import { prisma } from "../lib/prisma.js";
import { renderHomePage } from "../views/homeView.js";

export const publicRoutes = express.Router();

publicRoutes.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "asc" }
    });

    res.send(renderHomePage({ products }));
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler beim Laden der Startseite.");
  }
});

publicRoutes.get("/anfrage", async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Anfrage senden - Feiermiete</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f7f3ec;
            color: #1f1f1f;
            padding: 40px;
          }

          .box {
            max-width: 720px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            padding: 34px;
            box-shadow: 0 18px 50px rgba(0,0,0,0.07);
          }

          a {
            color: #111;
            font-weight: 800;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Anfrage senden</h1>
          <p>Das Anfrageformular bauen wir als Nächstes sauber mit eigener Route und Datenbankspeicherung.</p>
          <p>Bis dahin: <a href="mailto:info@feiermiete.de">info@feiermiete.de</a></p>
          <p><a href="/">Zurück zur Startseite</a></p>
        </div>
      </body>
    </html>
  `);
});
