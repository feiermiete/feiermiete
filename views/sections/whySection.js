export function renderWhySection() {
  const items = [
    ["Alles aus einer Hand", "Equipment, Lieferung, Aufbau und auf Wunsch Catering-Koordination."],
    ["Für privat & Firma", "Geeignet für Geburtstage, Gartenfeiern, Hochzeiten, Sommerfeste und Business-Events."],
    ["Faire Kalkulation", "Klare Preise, transparente Kautionen und nachvollziehbare Lieferkosten."],
    ["Flexible Pakete", "Einzelne Artikel oder komplette Pakete passend zur Veranstaltung."],
    ["Schnelle Abstimmung", "Kurze Wege, direkte Kommunikation und schnelle Rückmeldung."],
    ["Berlin & Umgebung", "Lieferung in Berlin, Brandenburg und nach Absprache auch darüber hinaus."]
  ];

  const rows = items.map(([title, text]) => `
    <div class="why-item">
      <div>
        <strong>${title}</strong>
        <p>${text}</p>
      </div>
      <span>+</span>
    </div>
  `).join("");

  return `
    <section class="info-section why-section">
      <div class="wide-inner">
        <div class="why-intro">
          <div>
            <div class="section-kicker">Warum Feiermiete?</div>
            <h2>Weil gute Feiern Planung brauchen.</h2>
          </div>
          <p>
            Wir möchten Event-Equipment einfach, verständlich und zuverlässig verfügbar machen – für Privatkunden, Firmen und Caterer.
          </p>
        </div>

        <div class="why-grid">
          ${rows}
        </div>
      </div>
    </section>
  `;
}
