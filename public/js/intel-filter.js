document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterClass = document.getElementById('filterClass');
    const filterLoc = document.getElementById('filterLoc');
    const filterAuthor = document.getElementById('filterAuthor');
    const resetBtn = document.getElementById('resetFilters');
    
    // Nav Toggle
    const navToggle = document.getElementById('navFilterToggle');
    const filterContent = document.getElementById('navFilterPanel');

    if (navToggle && filterContent) {
        navToggle.addEventListener('click', () => {
            filterContent.classList.toggle('active');
            if (filterContent.classList.contains('active')) {
                navToggle.style.color = "var(--text-main)";
                navToggle.style.borderColor = "var(--text-main)";
            } else {
                navToggle.style.color = "";
                navToggle.style.borderColor = "";
            }
        });
    }
    
    // Only run if we are on the archive page with filters
    if (!searchInput) return;

    const cards = document.querySelectorAll('.post-card');
    const filterTickers = document.querySelectorAll('.active-filter-ticker');

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const fClass = filterClass.value.toLowerCase();
        const fLoc = filterLoc.value.toLowerCase();
        const fAuthor = filterAuthor.value.toLowerCase();

        let activeFilters = [];
        if (query) activeFilters.push(`QUERY:"${query}"`);
        if (fClass) activeFilters.push(`SEC:${fClass}`);
        if (fLoc) activeFilters.push(`LOC:${fLoc}`);
        if (fAuthor) activeFilters.push(`AUTH:${fAuthor}`);

        let visibleCount = 0;

        cards.forEach(card => {
            const data = card.dataset;
            const matchesQuery = query === '' || 
                data.title.includes(query) || 
                data.tags.includes(query) || 
                data.author.includes(query);
            const matchesClass = fClass === '' || data.classification === fClass;
            const matchesLoc = fLoc === '' || data.location === fLoc;
            const matchesAuthor = fAuthor === '' || data.author === fAuthor;

            if (matchesQuery && matchesClass && matchesLoc && matchesAuthor) {
                card.style.display = ''; // Reset to default
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateTicker(activeFilters, visibleCount);
    }

    function updateTicker(activeFilters, visibleCount) {
        if (activeFilters.length > 0) {
            const statusText = `/// ACTIVE_FILTERS: [ ${activeFilters.join(" | ").toUpperCase()} ] /// MATCHES_FOUND: ${visibleCount}`;
            filterTickers.forEach(ticker => {
                ticker.textContent = statusText;
                ticker.style.display = 'inline-block';
            });
            // Add a high-alert color class to the body if filters are active
            document.body.classList.add('filtering-active');
        } else {
            filterTickers.forEach(ticker => {
                ticker.style.display = 'none';
            });
            document.body.classList.remove('filtering-active');
        }
    }

    // Event Listeners
    searchInput.addEventListener('input', applyFilters);
    filterClass.addEventListener('change', applyFilters);
    filterLoc.addEventListener('change', applyFilters);
    filterAuthor.addEventListener('change', applyFilters);

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterClass.value = '';
        filterLoc.value = '';
        filterAuthor.value = '';
        applyFilters();
    });
});
