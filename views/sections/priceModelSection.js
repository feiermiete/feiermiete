export function renderPriceModelSection() {
  const items = [
    ["Mietpreis", "Jeder Artikel hat einen klaren Mietpreis. Bei größeren Mengen oder Paketen erstellen wir ein individuelles Angebot."],
    ["Lieferung", "Die Lieferkosten hängen von Entfernung, Menge, Zeitfenster und Aufwand ab."],
    ["Kaution", "Für bestimmte Artikel kann eine Kaution anfallen. Diese wird nach ordnungsgemäßer Rückgabe erstattet."],
    ["Reinigung", "Je nach Artikel und Vereinbarung ist Reinigung inklusive oder wird separat berechnet."],
    ["Aufbau", "Auf Wunsch unterstützen wir beim Aufbau, bei Buffetstationen und bei der sinnvollen Platzierung."],
    ["Pakete", "Für Gartenfeiern, Firmenfeiern oder Buffets können passende Komplettpakete zusammengestellt werden."]
  ];

  const cards = items.map(([title, text]) => `
    <div class="price-card">
      <div class="price-icon">↗</div>
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `).join("");

  return `
    <section class="price-section">
      <div class="wide-inner">
        <div class="center-head">
          <div class="section-kicker">Transparent planen</div>
          <h2>Unser Preismodell</h2>
          <p>
            Jede Feier ist anders. Deshalb kombinieren wir klare Mietpreise mit fairer, individueller Kalkulation für Lieferung, Aufbau und Zusatzleistungen.
          </p>
        </div>

        <div class="price-grid">
          ${cards}
        </div>
      </div>
    </section>
  `;
}
