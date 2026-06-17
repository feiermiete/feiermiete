export function renderFaqSection() {
  const faqs = [
    ["Kann ich auch nur einzelne Artikel mieten?", "Ja. Du kannst einzelne Artikel wie Stehtische, Pavillons oder Chafing Dishes anfragen. Wir prüfen dann Verfügbarkeit und Lieferaufwand."],
    ["Bietet ihr auch Catering an?", "Feiermiete selbst steht für Equipment und Eventlogistik. Auf Wunsch koordinieren wir passende Catering-Lösungen über unser Netzwerk."],
    ["Gibt es eine Kaution?", "Bei bestimmten Artikeln kann eine Kaution anfallen. Die genaue Höhe wird im Angebot transparent ausgewiesen."],
    ["Liefert ihr auch außerhalb von Berlin?", "Ja, nach Absprache liefern wir auch in Brandenburg und Umgebung. Die Lieferkosten hängen von Entfernung und Aufwand ab."],
    ["Kann ich kurzfristig anfragen?", "Kurzfristige Anfragen sind möglich. Ob wir liefern können, hängt von Verfügbarkeit, Menge und Entfernung ab."],
    ["Kann ich Equipment selbst abholen?", "Selbstabholung kann je nach Artikel und Termin möglich sein. Das klären wir individuell in der Anfrage."]
  ];

  const items = faqs.map(([question, answer]) => `
    <details class="faq-item">
      <summary>${question}</summary>
      <p>${answer}</p>
    </details>
  `).join("");

  return `
    <section class="faq-section">
      <div class="wide-inner">
        <div class="section-head">
          <div>
            <div class="section-kicker">Fragen & Antworten</div>
            <h2>Gut zu wissen.</h2>
          </div>
          <p>
            Hier findest du die wichtigsten Informationen zur Miete, Lieferung, Kaution und Catering-Koordination.
          </p>
        </div>

        <div class="faq-grid">
          ${items}
        </div>
      </div>
    </section>
  `;
}
