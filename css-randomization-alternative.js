// Alternative CSS-based randomization approach
// This avoids DOM manipulation entirely
function randomizeColorCardsCSS() {
    const colorCards = document.querySelectorAll('.color-card');
    const gridContainer = document.querySelector('.color-grid');
    
    if (!gridContainer || !colorCards.length) return;
    
    // Create a shuffled order array
    const indices = Array.from({length: colorCards.length}, (_, i) => i);
    
    // Shuffle the indices using Fisher-Yates algorithm
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Apply CSS order property to each card
    colorCards.forEach((card, index) => {
        card.style.order = indices[index];
    });
    
    // Ensure the grid container has flex display
    gridContainer.style.display = 'flex';
    gridContainer.style.flexWrap = 'wrap';
    gridContainer.style.gap = '30px';
}

// Use this instead of the DOM manipulation approach
// randomizeColorCardsCSS();