export function renderServicesSection() {
  return `
    <section class="info-section services-section" id="services">
      <div class="wide-inner">
        <div class="section-head">
          <div>
            <div class="section-kicker">Unsere Services</div>
            <h2>Mehr als nur Equipment.</h2>
          </div>
          <p>
            Feiermiete unterstützt private Feiern, Firmenveranstaltungen und Caterings mit Equipment, Logistik und auf Wunsch passenden Catering-Lösungen.
          </p>
        </div>

        <div class="service-grid">
          <article class="service-card red-card">
            <div class="service-image service-equipment"></div>
            <div class="service-content">
              <h3>Equipment-Verleih</h3>
              <p>
                Pavillons, Stehtische, Bierzeltgarnituren, Geschirr, Buffet-Equipment und Zubehör für Feiern jeder Größe.
              </p>
            </div>
          </article>

          <article class="service-card red-card">
            <div class="service-image service-catering"></div>
            <div class="service-content">
              <h3>Catering-Koordination</h3>
              <p>
                Auf Wunsch arbeiten wir mit passenden Cateringfirmen zusammen, damit Equipment, Speisen und Ablauf sinnvoll geplant werden.
              </p>
            </div>
          </article>

          <article class="service-card red-card">
            <div class="service-image service-logistics"></div>
            <div class="service-content">
              <h3>Lieferung & Aufbau</h3>
              <p>
                Wir liefern zum vereinbarten Zeitpunkt, unterstützen beim Aufbau und holen das Equipment nach der Feier wieder ab.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;
}
