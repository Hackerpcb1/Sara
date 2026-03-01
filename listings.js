// ===== APARTMENTS DATA =====
// Load from localStorage if available, otherwise use default data
let apartmentsData = [
    {
        id: 1,
        name: "Apartamento Moderno en el Centro",
        price: 1200,
        city: "Madrid",
        location: "Madrid, España",
        neighborhood: "Centro",
        bedrooms: 2,
        bathrooms: 2,
        size: 85,
        image: "images/apartment1.jpg",
        rating: 5.0,
        reviews: 24,
        type: "Apartamento"
    },
    {
        id: 2,
        name: "Apartamento Espacioso con Vista",
        price: 1500,
        city: "Barcelona",
        location: "Barcelona, España",
        neighborhood: "Eixample",
        bedrooms: 3,
        bathrooms: 2,
        size: 120,
        image: "images/apartment2.jpg",
        rating: 4.5,
        reviews: 18,
        type: "Apartamento"
    },
    {
        id: 3,
        name: "Apartamento Céntrico y Acogedor",
        price: 1000,
        city: "Valencia",
        location: "Valencia, España",
        neighborhood: "Ruzafa",
        bedrooms: 1,
        bathrooms: 1,
        size: 60,
        image: "images/apartment3.jpg",
        rating: 4.0,
        reviews: 12,
        type: "Apartamento"
    },
    {
        id: 4,
        name: "Loft Moderno en Malasaña",
        price: 1800,
        city: "Madrid",
        location: "Madrid, España",
        neighborhood: "Malasaña",
        bedrooms: 2,
        bathrooms: 2,
        size: 95,
        image: "images/apartment4.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
        rating: 4.8,
        reviews: 32,
        type: "Loft"
    },
    {
        id: 5,
        name: "Dúplex Acogedor",
        price: 900,
        city: "Sevilla",
        location: "Sevilla, España",
        neighborhood: "Triana",
        bedrooms: 2,
        bathrooms: 1,
        size: 75,
        image: "images/apartment5.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
        rating: 4.3,
        reviews: 15,
        type: "Dúplex"
    },
    {
        id: 6,
        name: "Penthouse con Vistas al Mar",
        price: 2200,
        city: "Barcelona",
        location: "Barcelona, España",
        neighborhood: "Barceloneta",
        bedrooms: 3,
        bathrooms: 3,
        size: 150,
        image: "images/apartment6.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
        rating: 4.9,
        reviews: 45,
        type: "Penthouse"
    },
    {
        id: 7,
        name: "Estudio Minimalista",
        price: 750,
        city: "Madrid",
        location: "Madrid, España",
        neighborhood: "Lavapiés",
        bedrooms: 1,
        bathrooms: 1,
        size: 45,
        image: "images/apartment7.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
        rating: 4.2,
        reviews: 8,
        type: "Estudio"
    },
    {
        id: 8,
        name: "Casa con Jardín",
        price: 2500,
        city: "Valencia",
        location: "Valencia, España",
        neighborhood: "Campanar",
        bedrooms: 4,
        bathrooms: 3,
        size: 200,
        image: "images/apartment8.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
        rating: 4.7,
        reviews: 28,
        type: "Casa"
    },
    {
        id: 9,
        name: "Apartamento Cerca del Hospital",
        price: 1100,
        city: "Madrid",
        location: "Madrid, España",
        neighborhood: "Chamberí",
        bedrooms: 2,
        bathrooms: 1,
        size: 70,
        image: "images/apartment9.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
        rating: 4.6,
        reviews: 21,
        type: "Apartamento"
    },
    {
        id: 10,
        name: "Apartamento Luminoso",
        price: 1350,
        city: "Barcelona",
        location: "Barcelona, España",
        neighborhood: "Gràcia",
        bedrooms: 2,
        bathrooms: 1,
        size: 75,
        image: "images/apartment10.jpg",
        fallbackImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
        rating: 4.4,
        reviews: 19,
        type: "Apartamento"
    }
];

// Load from localStorage, or save defaults if nothing stored yet
function loadApartmentsFromStorage() {
    const storedApartments = localStorage.getItem('apartments');
    if (storedApartments) {
        const parsed = JSON.parse(storedApartments);
        if (parsed.length > 0) {
            apartmentsData = parsed;
        }
    } else {
        // Primera vez: guardar los datos por defecto en localStorage
        // para que el dashboard y listados compartan la misma fuente
        localStorage.setItem('apartments', JSON.stringify(apartmentsData));
    }
}

// Call on load
loadApartmentsFromStorage();

// ===== FILTER AND RENDER FUNCTIONS =====

let currentFilters = {
    location: '',
    maxPrice: '',
    city: ''
};

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const locationParam = urlParams.get('location');
    const maxPriceParam = urlParams.get('maxPrice');

    // Set filters from URL parameters
    if (locationParam) {
        document.getElementById('search').value = locationParam;
        currentFilters.location = locationParam.toLowerCase();
    }

    if (maxPriceParam) {
        document.getElementById('price-filter').value = maxPriceParam;
        currentFilters.maxPrice = maxPriceParam;
    }

    // Add event listeners to filters
    document.getElementById('search').addEventListener('input', applyFilters);
    document.getElementById('price-filter').addEventListener('change', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearAllFilters);

    // Initial render
    renderApartments(filterApartments());
});

// Filter apartments based on current filters
function filterApartments() {
    return apartmentsData.filter(apartment => {
        // Location filter (searches in name, city, neighborhood, and location)
        if (currentFilters.location) {
            const searchTerm = currentFilters.location.toLowerCase();
            const matchesLocation =
                (apartment.name || '').toLowerCase().includes(searchTerm) ||
                (apartment.city || '').toLowerCase().includes(searchTerm) ||
                (apartment.neighborhood || '').toLowerCase().includes(searchTerm) ||
                (apartment.location || '').toLowerCase().includes(searchTerm);

            if (!matchesLocation) return false;
        }

        // Price filter
        if (currentFilters.maxPrice) {
            const maxPrice = parseInt(currentFilters.maxPrice);
            if (apartment.price > maxPrice) return false;
        }

        // City filter
        if (currentFilters.city) {
            if (apartment.city !== currentFilters.city) return false;
        }

        return true;
    });
}

// Apply filters when user changes inputs
function applyFilters() {
    currentFilters.location = document.getElementById('search').value.toLowerCase();
    currentFilters.maxPrice = document.getElementById('price-filter').value;
    currentFilters.city = '';

    const filteredApartments = filterApartments();
    renderApartments(filteredApartments);
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('search').value = '';
    document.getElementById('price-filter').value = '';

    currentFilters = {
        location: '',
        maxPrice: '',
        city: ''
    };

    // Update URL to remove parameters
    window.history.pushState({}, '', 'listings.html');

    renderApartments(apartmentsData);
}

// Render apartments to the page
function renderApartments(apartments) {
    const container = document.getElementById('apartments-list');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');

    // Clear container
    container.innerHTML = '';

    // Update results count
    if (apartments.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'flex';
        resultsCount.textContent = 'No se encontraron apartamentos';
    } else {
        container.style.display = 'grid';
        noResults.style.display = 'none';
        resultsCount.textContent = `Mostrando ${apartments.length} apartamento${apartments.length !== 1 ? 's' : ''}`;

        // Render each apartment
        apartments.forEach(apartment => {
            const card = createApartmentCard(apartment);
            container.appendChild(card);
        });
    }
}

// Create apartment card HTML element
function createApartmentCard(apartment) {
    const card = document.createElement('div');
    card.className = 'apartment-card';

    // Rating: puede no existir en apartamentos creados desde el dashboard
    const rating = apartment.rating || null;
    const reviews = apartment.reviews || null;
    let starsHTML = '';
    let ratingHTML = '';

    if (rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < fullStars; i++) starsHTML += '<span class="star filled">★</span>';
        if (hasHalfStar) starsHTML += '<span class="star half">★</span>';
        for (let i = 0; i < emptyStars; i++) starsHTML += '<span class="star">★</span>';
        ratingHTML = `<div class="card-rating">
                    <div class="stars">${starsHTML}</div>
                    <span class="rating-text">${rating.toFixed(1)}${reviews ? ' (' + reviews + ' reseñas)' : ''}</span>
                </div>`;
    }

    // Badge (del dashboard) o ninguno
    const badgeHTML = apartment.badge
        ? `<div class="card-badge${apartment.badge === 'Nuevo' ? ' new' : ''}">${apartment.badge}</div>`
        : '';

    // Imagen con fallback
    const imageUrl = apartment.image || '';
    const fallback = apartment.fallbackImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop';

    card.innerHTML = `
        ${badgeHTML}
        <img src="${imageUrl}" alt="${apartment.name}" onerror="this.src='${fallback}'">
        <div class="card-content">
            <div class="card-header">
                <h3>${apartment.name}</h3>
                <div class="card-location">📍 ${apartment.location}</div>
                ${ratingHTML}
            </div>
            <div class="card-features">
                <span>🛏️ ${apartment.bedrooms} Habitación${apartment.bedrooms !== 1 ? 'es' : ''}</span>
                <span>🚿 ${apartment.bathrooms} Baño${apartment.bathrooms !== 1 ? 's' : ''}</span>
                <span>📐 ${apartment.size} m²</span>
            </div>
            <div class="card-footer">
                <div class="price">$${apartment.price.toLocaleString()}<span>/mes</span></div>
                <a href="apartment-detail.html?id=${apartment.id}" class="btn btn-small">Ver Detalles</a>
            </div>
        </div>
    `;

    return card;
}

