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
        <td style="padding:10px;border-bottom:1px solid #eee;"><strong>${escapeHtml(item.name || "Artikel")}</strong></td>
        <td style="padding:10px;border-bottom:1px solid #eee;">${escapeHtml(item.category || "-")}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;">${quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;">${escapeHtml(price)}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;">${escapeHtml(deposit)}</td>
      </tr>
    `;
  }).join("");

  return `
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;border:1px solid #eee;">
      <thead>
        <tr style="background:#f7f3ee;">
          <th align="left" style="padding:10px;">Artikel</th>
          <th align="left" style="padding:10px;">Kategorie</th>
          <th align="left" style="padding:10px;">Menge</th>
          <th align="left" style="padding:10px;">Mietpreis</th>
          <th align="left" style="padding:10px;">Kaution</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function getEventDate(inquiry) {
  return inquiry.eventDate
    ? new Date(inquiry.eventDate).toLocaleDateString("de-DE")
    : "-";
}

function getAdminLink(inquiry) {
  const baseUrl = process.env.APP_URL || process.env.PUBLIC_URL || "https://feiermiete-production.up.railway.app";
  return `${baseUrl}/admin/inquiries/${inquiry.id}`;
}

function getMailjetConfig() {
  return {
    apiKey: process.env.MAILJET_API_KEY,
    secretKey: process.env.MAILJET_SECRET_KEY,
    fromEmail: process.env.MAIL_FROM_EMAIL,
    fromName: process.env.MAIL_FROM_NAME || "Feiermiete",
    toEmail: process.env.MAIL_TO_EMAIL
  };
}

async function sendMailjetMessage(message) {
  const { apiKey, secretKey } = getMailjetConfig();
  const auth = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      Messages: [message]
    })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Mailjet Fehler:", result);
    throw new Error(`Mailjet Versand fehlgeschlagen: ${response.status}`);
  }

  return result;
}

export async function sendInquiryNotification(inquiry, items = []) {
  const { apiKey, secretKey, fromEmail, fromName, toEmail } = getMailjetConfig();

  if (!apiKey || !secretKey || !fromEmail || !toEmail) {
    console.warn("Mailjet nicht vollständig konfiguriert. Interne Anfrage-Mail wird übersprungen.");
    return { ok: false, status: "skipped", reason: "missing_config" };
  }

  const eventDate = getEventDate(inquiry);
  const adminLink = getAdminLink(inquiry);

  const textPart = `
Neue Anfrage über Feiermiete

Es ist eine neue Anfrage über die Website eingegangen.

Anfrage-Nr.: ${inquiry.id}

Kundendaten
Name / Ansprechpartner: ${inquiry.customerName || "-"}
Firma: ${inquiry.companyName || "-"}
E-Mail: ${inquiry.email || "-"}
Telefon: ${inquiry.phone || "-"}
Eventdatum: ${eventDate}
Ort / Lieferadresse: ${inquiry.deliveryAddress || "-"}

Angefragte Artikel / Leistungen
${buildItemsText(items)}

Nachricht / Zusatzangaben
${inquiry.message || "-"}

Interne Bearbeitung
Die Anfrage wurde im Admin-Bereich gespeichert und kann dort geprüft, ergänzt und für die Vertragserstellung vorbereitet werden.

Anfrage öffnen:
${adminLink}
`.trim();

  const htmlPart = `
    <div style="font-family:Arial,sans-serif;background:#f7f3ee;padding:28px;color:#111;">
      <div style="max-width:760px;margin:0 auto;background:#fff;padding:30px;border-radius:18px;">
        <h2 style="margin:0 0 8px;color:#d40016;">Neue Anfrage über Feiermiete</h2>
        <p style="margin:0 0 24px;color:#555;">Es ist eine neue Anfrage über die Website eingegangen.</p>

        <p style="background:#111;color:#fff;padding:12px 16px;border-radius:10px;">
          <strong>Anfrage-Nr.:</strong> ${inquiry.id}
        </p>

        <h3>Kundendaten</h3>
        <p style="line-height:1.8;">
          <strong>Name / Ansprechpartner:</strong> ${escapeHtml(inquiry.customerName || "-")}<br>
          <strong>Firma:</strong> ${escapeHtml(inquiry.companyName || "-")}<br>
          <strong>E-Mail:</strong> ${escapeHtml(inquiry.email || "-")}<br>
          <strong>Telefon:</strong> ${escapeHtml(inquiry.phone || "-")}<br>
          <strong>Eventdatum:</strong> ${escapeHtml(eventDate)}<br>
          <strong>Ort / Lieferadresse:</strong> ${escapeHtml(inquiry.deliveryAddress || "-")}
        </p>

        <h3>Angefragte Artikel / Leistungen</h3>
        ${buildItemsHtml(items)}

        <h3>Nachricht / Zusatzangaben</h3>
        <pre style="font-family:Arial,sans-serif;white-space:pre-wrap;background:#f7f3ee;padding:16px;border-radius:10px;">${escapeHtml(inquiry.message || "-")}</pre>

        <p style="margin-top:24px;">
          <a href="${escapeHtml(adminLink)}" style="display:inline-block;background:#d40016;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:bold;">
            Anfrage im Admin öffnen
          </a>
        </p>
      </div>
    </div>
  `;

  await sendMailjetMessage({
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
    Subject: `Neue Anfrage über Feiermiete #${inquiry.id}`,
    TextPart: textPart,
    HTMLPart: htmlPart
  });

  console.log(`Mailjet interne Anfrage-Mail gesendet für Anfrage #${inquiry.id}`);
  return { ok: true, status: "sent" };
}

export async function sendCustomerInquiryConfirmation(inquiry, items = []) {
  const { apiKey, secretKey, fromEmail, fromName } = getMailjetConfig();

  if (!apiKey || !secretKey || !fromEmail || !inquiry.email) {
    console.warn("Kunden-Bestätigung kann nicht gesendet werden: Mailjet oder Kunden-E-Mail fehlt.");
    return { ok: false, status: "skipped", reason: "missing_config_or_email" };
  }

  const eventDate = getEventDate(inquiry);

  const textPart = `
Hallo ${inquiry.customerName || ""},

vielen Dank für deine Anfrage bei Feiermiete.

Wir haben deine Anfrage erhalten und prüfen nun Verfügbarkeit, Mietdauer, Lieferung, Aufbau, Kaution und passende Zusatzleistungen. Anschließend melden wir uns mit einem passenden Angebot bei dir.

Anfrage-Nr.: ${inquiry.id}
Eventdatum: ${eventDate}
Ort / Lieferadresse: ${inquiry.deliveryAddress || "-"}

Deine angefragten Artikel / Leistungen:
${buildItemsText(items)}

Deine Nachricht:
${inquiry.message || "-"}

Wichtig:
Diese Nachricht ist noch keine verbindliche Buchungsbestätigung. Die Buchung wird erst verbindlich, wenn wir die Anfrage geprüft und schriftlich bestätigt haben.

Viele Grüße
Dein Feiermiete-Team
`.trim();

  const htmlPart = `
    <div style="font-family:Arial,sans-serif;background:#f7f3ee;padding:28px;color:#111;">
      <div style="max-width:760px;margin:0 auto;background:#fff;padding:30px;border-radius:18px;">
        <h2 style="margin:0 0 8px;color:#d40016;">Danke für deine Anfrage bei Feiermiete</h2>
        <p style="margin:0 0 24px;color:#555;">Wir haben deine Anfrage erhalten.</p>

        <p>Hallo ${escapeHtml(inquiry.customerName || "")},</p>

        <p style="line-height:1.7;">
          vielen Dank für deine Anfrage. Wir prüfen nun Verfügbarkeit, Mietdauer,
          Lieferung, Aufbau, Kaution und passende Zusatzleistungen.
          Anschließend melden wir uns mit einem passenden Angebot bei dir.
        </p>

        <p style="background:#f7f3ee;padding:16px;border-radius:10px;line-height:1.8;">
          <strong>Anfrage-Nr.:</strong> ${inquiry.id}<br>
          <strong>Eventdatum:</strong> ${escapeHtml(eventDate)}<br>
          <strong>Ort / Lieferadresse:</strong> ${escapeHtml(inquiry.deliveryAddress || "-")}
        </p>

        <h3>Deine angefragten Artikel / Leistungen</h3>
        ${buildItemsHtml(items)}

        <h3>Deine Nachricht</h3>
        <pre style="font-family:Arial,sans-serif;white-space:pre-wrap;background:#f7f3ee;padding:16px;border-radius:10px;">${escapeHtml(inquiry.message || "-")}</pre>

        <p style="background:#fff4d8;border-left:4px solid #d40016;padding:14px 16px;line-height:1.6;">
          <strong>Wichtig:</strong> Diese Nachricht ist noch keine verbindliche Buchungsbestätigung.
          Die Buchung wird erst verbindlich, wenn wir die Anfrage geprüft und schriftlich bestätigt haben.
        </p>

        <p style="margin-top:24px;">
          Viele Grüße<br>
          <strong>Dein Feiermiete-Team</strong>
        </p>
      </div>
    </div>
  `;

  await sendMailjetMessage({
    From: {
      Email: fromEmail,
      Name: fromName
    },
    To: [
      {
        Email: inquiry.email,
        Name: inquiry.customerName || "Kunde"
      }
    ],
    Subject: `Wir haben deine Anfrage erhalten – Feiermiete #${inquiry.id}`,
    TextPart: textPart,
    HTMLPart: htmlPart
  });

  console.log(`Mailjet Kunden-Bestätigung gesendet für Anfrage #${inquiry.id}`);
  return { ok: true, status: "sent" };
}

export async function sendMailjetTestEmail() {
  const { apiKey, secretKey, fromEmail, fromName, toEmail } = getMailjetConfig();

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

  const result = await sendMailjetMessage({
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
    TextPart: "Das ist eine Test-Mail von Feiermiete über Mailjet.",
    HTMLPart: "<h2>Feiermiete Mailjet Test</h2><p>Wenn du diese Mail siehst, funktioniert Mailjet.</p>"
  });

  return {
    ok: true,
    statusCode: 200,
    statusText: "OK",
    config,
    mailjetResponse: result
  };
}
