// Dynamic loading of latest installations for homepage
// Fetches translated content based on current page language
(function () {
  // Find the installations grid on the homepage
  const grid = document.querySelector('#latest-installations-grid');
  if (!grid) return; // Not on a page with installations grid

  // Detect current language from URL path
  const path = window.location.pathname || '/';
  const lang = path.startsWith('/fr/') ? 'fr'
            : path.startsWith('/es/') ? 'es'
            : path.startsWith('/de/') ? 'de'
            : 'en';

  // Fetch 3 latest installations in card format with proper language
  const apiUrl = `/.netlify/functions/installations-public?format=cards&limit=3&lang=${lang}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch installations');
      return response.json();
    })
    .then(data => {
      const installations = data.installations;
      if (!Array.isArray(installations) || installations.length === 0) return;

      // Build HTML for installation cards
      const html = installations.map(installation => {
        // Handle image
        const imageHtml = installation.image && installation.image.src
          ? `<img src="${installation.image.src}" alt="${(installation.image.alt || installation.title || '').replace(/"/g, '&quot;')}" loading="lazy">`
          : '<div class="no-image">No image available</div>';

        // Format date based on language
        let dateStr = '';
        if (installation.installationDate) {
          const date = new Date(installation.installationDate);
          const options = { year: 'numeric', month: 'long' };
          dateStr = date.toLocaleDateString(
            lang === 'fr' ? 'fr-FR' :
            lang === 'es' ? 'es-ES' :
            lang === 'de' ? 'de-DE' : 'en-GB',
            options
          );
        }

        // Localized "Read More" text
        const readMoreText = lang === 'fr' ? 'En savoir plus →'
                          : lang === 'es' ? 'Leer más →'
                          : lang === 'de' ? 'Mehr erfahren →'
                          : 'Read More →';

        // Truncate excerpt if needed
        const excerpt = installation.excerpt || '';
        const displayExcerpt = excerpt.length > 150
          ? excerpt.substring(0, 150) + '...'
          : excerpt;

        // Build the card HTML matching existing structure
        return `
          <div class="installation-card" onclick="window.location.href='${installation.url}'">
            <div class="installation-image">
              ${imageHtml}
            </div>
            <div class="installation-content">
              <div class="installation-meta">
                ${dateStr ? `<span class="installation-date">${dateStr}</span>` : ''}
                ${installation.application ? `<span class="installation-application">${installation.application}</span>` : ''}
              </div>
              <h3 class="installation-title">${installation.title || ''}</h3>
              ${installation.locationText ? `<p class="installation-location">📍 ${installation.locationText}</p>` : ''}
              <div class="installation-description">
                <p>${displayExcerpt}</p>
              </div>
              <a href="${installation.url}" class="read-more-btn" onclick="event.stopPropagation()">
                ${readMoreText}
              </a>
            </div>
          </div>
        `;
      }).join('');

      // Replace grid content
      grid.innerHTML = html;

      // Re-apply animations
      const cards = grid.querySelectorAll('.installation-card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 150);
      });
    })
    .catch(error => {
      // Silent fail - leave existing content in place
      console.error('Failed to load latest installations:', error);
    });
})();