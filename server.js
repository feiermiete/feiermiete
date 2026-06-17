import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Feiermiete - Equipment für deine Feier mieten</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f7f3ec;
            color: #1f1f1f;
          }
          .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            text-align: center;
          }
          .box {
            max-width: 760px;
            background: white;
            padding: 50px;
            border-radius: 28px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          }
          h1 {
            font-size: 52px;
            margin: 0 0 20px;
          }
          p {
            font-size: 20px;
            line-height: 1.6;
            margin: 0 0 30px;
          }
          .button {
            display: inline-block;
            background: #111;
            color: white;
            padding: 16px 28px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: bold;
          }
          .items {
            margin-top: 30px;
            color: #555;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <section class="hero">
          <div class="box">
            <h1>Feiermiete</h1>
            <p>Equipment für Geburtstage, Firmenfeiern, Buffets und Events in Berlin mieten.</p>
            <a class="button" href="mailto:info@feiermiete.de">Anfrage senden</a>
            <div class="items">
              Pavillons · Stehtische · Bierzeltgarnituren · Chafing Dishes · Geschirr · Buffet-Equipment
            </div>
          </div>
        </section>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Feiermiete läuft auf Port ${port}`);
});
