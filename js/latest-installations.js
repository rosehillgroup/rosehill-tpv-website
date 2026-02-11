// Dynamic loading of latest installations for homepage
// Fetches translated content based on current page language
(function () {
  // Escape helper for defence-in-depth against XSS in API data
  function esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

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
        const safeUrl = esc(installation.url);
        return `
          <div class="installation-card" data-href="${safeUrl}" style="cursor:pointer">
            <div class="installation-image">
              ${imageHtml}
            </div>
            <div class="installation-content">
              <div class="installation-meta">
                ${dateStr ? `<span class="installation-date">${esc(dateStr)}</span>` : ''}
                ${installation.application ? `<span class="installation-application">${esc(installation.application)}</span>` : ''}
              </div>
              <h3 class="installation-title">${esc(installation.title)}</h3>
              ${installation.locationText ? `<p class="installation-location">📍 ${esc(installation.locationText)}</p>` : ''}
              <div class="installation-description">
                <p>${esc(displayExcerpt)}</p>
              </div>
              <a href="${safeUrl}" class="read-more-btn">
                ${readMoreText}
              </a>
            </div>
          </div>
        `;
      }).join('');

      // Replace grid content
      grid.innerHTML = html;

      // Event delegation for card clicks (only internal URLs)
      grid.addEventListener('click', function (e) {
        const card = e.target.closest('.installation-card');
        if (!card) return;
        if (e.target.closest('.read-more-btn')) return; // let the <a> handle itself
        const href = card.dataset.href;
        if (href && href.startsWith('/')) window.location.href = href;
      });

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