export function renderKitchenRentalSection() {
  return `
    <section class="kitchen-section" id="kueche">
      <div class="wide-inner kitchen-grid">
        <div class="kitchen-content">
          <div class="section-kicker">Produktionsküche mieten</div>
          <h2>Küche für Stunden oder ganze Tage mieten.</h2>
          <p>
            Du brauchst eine professionelle Küche für Vorbereitung, Produktion, Catering, Food-Startups oder größere Veranstaltungen?
            Bei Feiermiete kannst du eine Produktionsküche flexibel stundenweise oder tageweise anfragen.
          </p>

          <div class="kitchen-list">
            <div>
              <strong>Für Caterer & Food-Startups</strong>
              <span>Ideal für Produktion, Vorbereitung, Testläufe oder kurzfristige Engpässe.</span>
            </div>
            <div>
              <strong>Für Events & Feiern</strong>
              <span>Praktisch, wenn Speisen vorbereitet, verpackt oder organisiert werden müssen.</span>
            </div>
            <div>
              <strong>Flexible Nutzung</strong>
              <span>Stundenweise, tageweise oder nach individueller Absprache.</span>
            </div>
          </div>

          <a class="button primary" href="/anfrage?kategorie=kueche">Küche anfragen</a>
        </div>

        <div class="kitchen-visual">
          <div class="kitchen-panel">
            <span>Produktionsküche</span>
            <strong>Vorbereiten. Produzieren. Liefern.</strong>
            <p>
              Für Catering, Eventvorbereitung, Meal Prep, Pop-up-Konzepte und größere Bestellungen.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}
