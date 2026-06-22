function formatMoney(cents) {
  const value = Number(cents || 0) / 100;
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR"
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildItemsText(items = []) {
  if (!items.length) return "Keine Artikelpositionen gespeichert.";

  return items.map((item) => {
    const quantity = Number(item.quantity || 1);
    const price = item.priceCents ? formatMoney(item.priceCents) : (item.priceText || "auf Anfrage");
    const deposit = item.depositCents ? formatMoney(item.depositCents) : (item.depositText || "auf Anfrage");

    return `- ${quantity} x ${item.name || "Artikel"} | Mietpreis: ${price} | Kaution: ${deposit}`;
  }).join("\n");
}

function buildItemsHtml(items = []) {
  if (!items.length) {
    return "<p>Keine Artikelpositionen gespeichert.</p>";
  }

  const rows = items.map((item) => {
    const quantity = Number(item.quantity || 1);
    const price = item.priceCents ? formatMoney(item.priceCents) : (item.priceText || "auf Anfrage");
    const deposit = item.depositCents ? formatMoney(item.depositCents) : (item.depositText || "auf Anfrage");

    return `
      <tr>
        <td>${escapeHtml(item.name || "Artikel")}</td>
        <td>${escapeHtml(item.category || "-")}</td>
        <td>${quantity}</td>
        <td>${escapeHtml(price)}</td>
        <td>${escapeHtml(deposit)}</td>
      </tr>
    `;
  }).join("");

  return `
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
      <thead>
        <tr>
          <th align="left">Artikel</th>
          <th align="left">Kategorie</th>
          <th align="left">Menge</th>
          <th align="left">Mietpreis</th>
          <th align="left">Kaution</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

export async function sendInquiryNotification(inquiry, items = []) {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const fromEmail = process.env.MAIL_FROM_EMAIL;
  const fromName = process.env.MAIL_FROM_NAME || "Feiermiete";
  const toEmail = process.env.MAIL_TO_EMAIL;

  if (!apiKey || !secretKey || !fromEmail || !toEmail) {
    console.warn("Mailjet nicht vollständig konfiguriert. Anfrage-Mail wird übersprungen.");
    return;
  }

  const eventDate = inquiry.eventDate
    ? new Date(inquiry.eventDate).toLocaleDateString("de-DE")
    : "-";

  const subject = `Neue Feiermiete-Anfrage #${inquiry.id}`;

  const textPart = `
Neue Feiermiete-Anfrage

Anfrage-Nr.: ${inquiry.id}
Name: ${inquiry.customerName || "-"}
Firma: ${inquiry.companyName || "-"}
E-Mail: ${inquiry.email || "-"}
Telefon: ${inquiry.phone || "-"}
Eventdatum: ${eventDate}
Lieferadresse / Ort: ${inquiry.deliveryAddress || "-"}

Artikel:
${buildItemsText(items)}

Nachricht:
${inquiry.message || "-"}
`.trim();

  const htmlPart = `
    <h2>Neue Feiermiete-Anfrage</h2>
    <p><strong>Anfrage-Nr.:</strong> ${inquiry.id}</p>

    <h3>Kundendaten</h3>
    <p>
      <strong>Name:</strong> ${escapeHtml(inquiry.customerName || "-")}<br>
      <strong>Firma:</strong> ${escapeHtml(inquiry.companyName || "-")}<br>
      <strong>E-Mail:</strong> ${escapeHtml(inquiry.email || "-")}<br>
      <strong>Telefon:</strong> ${escapeHtml(inquiry.phone || "-")}<br>
      <strong>Eventdatum:</strong> ${escapeHtml(eventDate)}<br>
      <strong>Lieferadresse / Ort:</strong> ${escapeHtml(inquiry.deliveryAddress || "-")}
    </p>

    <h3>Artikel</h3>
    ${buildItemsHtml(items)}

    <h3>Nachricht</h3>
    <pre style="font-family:Arial,sans-serif;white-space:pre-wrap;">${escapeHtml(inquiry.message || "-")}</pre>
  `;

  const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName
          },
          To: [
            {
              Email: toEmail,
              Name: "Feiermiete"
            }
          ],
          Subject: subject,
          TextPart: textPart,
          HTMLPart: htmlPart
        }
      ]
    })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Mailjet Fehler:", result);
    throw new Error(`Mailjet Versand fehlgeschlagen: ${response.status}`);
  }

  console.log(`Mailjet Anfrage-Mail gesendet für Anfrage #${inquiry.id}`);
}


export async function sendMailjetTestEmail() {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const fromEmail = process.env.MAIL_FROM_EMAIL;
  const fromName = process.env.MAIL_FROM_NAME || "Feiermiete";
  const toEmail = process.env.MAIL_TO_EMAIL;

  const config = {
    MAILJET_API_KEY: apiKey ? "gesetzt" : "FEHLT",
    MAILJET_SECRET_KEY: secretKey ? "gesetzt" : "FEHLT",
    MAIL_FROM_EMAIL: fromEmail || "FEHLT",
    MAIL_FROM_NAME: fromName || "FEHLT",
    MAIL_TO_EMAIL: toEmail || "FEHLT"
  };

  if (!apiKey || !secretKey || !fromEmail || !toEmail) {
    return {
      ok: false,
      status: "missing_config",
      config
    };
  }

  const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName
          },
          To: [
            {
              Email: toEmail,
              Name: "Feiermiete Test"
            }
          ],
          Subject: "Feiermiete Mailjet Test",
          TextPart: "Das ist eine Test-Mail von Feiermiete ?ber Mailjet.",
          HTMLPart: "<h2>Feiermiete Mailjet Test</h2><p>Wenn du diese Mail siehst, funktioniert Mailjet.</p>"
        }
      ]
    })
  });

  const bodyText = await response.text();

  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    body = bodyText;
  }

  return {
    ok: response.ok,
    statusCode: response.status,
    statusText: response.statusText,
    config,
    mailjetResponse: body
  };
}

