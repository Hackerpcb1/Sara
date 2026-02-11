// Admin Panel JavaScript
// Login credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Sara2020';

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadApartments();
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('loginError').style.display = 'none';
        showDashboard();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
});

// Initialize apartments in localStorage if not exists
function initializeApartments() {
    if (!localStorage.getItem('apartments')) {
        const defaultApartments = [
            {
                id: 1,
                name: 'Apartamento Moderno',
                location: 'Centro, Madrid',
                price: 1200,
                bedrooms: 2,
                bathrooms: 2,
                size: 85,
                image: 'images/apartment1.jpg',
                description: 'Hermoso apartamento en el centro de la ciudad',
                badge: 'Destacado'
            },
            {
                id: 2,
                name: 'Apartamento Espacioso',
                location: 'Salamanca, Madrid',
                price: 1500,
                bedrooms: 3,
                bathrooms: 2,
                size: 120,
                image: 'images/apartment2.jpg',
                description: 'Amplio apartamento con excelente ubicación',
                badge: 'Nuevo'
            },
            {
                id: 3,
                name: 'Apartamento Céntrico',
                location: 'Sol, Madrid',
                price: 950,
                bedrooms: 1,
                bathrooms: 1,
                size: 60,
                image: 'images/apartment3.jpg',
                description: 'Perfecto para profesionales',
                badge: ''
            }
        ];
        localStorage.setItem('apartments', JSON.stringify(defaultApartments));
    }
}

// Load and display apartments
function loadApartments() {
    initializeApartments();
    const apartments = JSON.parse(localStorage.getItem('apartments'));
    const container = document.getElementById('apartmentsList');
    
    container.innerHTML = apartments.map(apt => `
        <div class="apartment-admin-card">
            <img src="${apt.image}" alt="${apt.name}" onerror="this.src='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop'">
            <div class="apartment-admin-info">
                <h3>${apt.name}</h3>
                <p class="location">📍 ${apt.location}</p>
                <p class="features">🛏️ ${apt.bedrooms} hab. • 🚿 ${apt.bathrooms} baños • 📐 ${apt.size}m²</p>
                <p class="price">$${apt.price}/mes</p>
                ${apt.badge ? `<span class="badge-small ${apt.badge === 'Nuevo' ? 'new' : ''}">${apt.badge}</span>` : ''}
            </div>
            <div class="apartment-admin-actions">
                <button class="btn-edit" onclick="editApartment(${apt.id})">✏️ Editar</button>
                <button class="btn-delete" onclick="deleteApartment(${apt.id})">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Modal handlers
const modal = document.getElementById('apartmentModal');
const addNewBtn = document.getElementById('addNewBtn');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.getElementById('cancelBtn');

addNewBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Agregar Nuevo Apartamento';
    document.getElementById('apartmentForm').reset();
    document.getElementById('apartmentId').value = '';
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Save apartment (add or edit)
document.getElementById('apartmentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const apartments = JSON.parse(localStorage.getItem('apartments'));
    const id = document.getElementById('apartmentId').value;

    const apartmentData = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('aptName').value,
        location: document.getElementById('aptLocation').value,
        price: parseInt(document.getElementById('aptPrice').value),
        bedrooms: parseInt(document.getElementById('aptBedrooms').value),
        bathrooms: parseInt(document.getElementById('aptBathrooms').value),
        size: parseInt(document.getElementById('aptSize').value),
        image: document.getElementById('aptImage').value,
        description: document.getElementById('aptDescription').value,
        badge: document.getElementById('aptBadge').value
    };

    if (id) {
        // Edit existing
        const index = apartments.findIndex(apt => apt.id === parseInt(id));
        apartments[index] = apartmentData;
    } else {
        // Add new
        apartments.push(apartmentData);
    }

    localStorage.setItem('apartments', JSON.stringify(apartments));
    modal.style.display = 'none';
    loadApartments();
});

// Edit apartment
function editApartment(id) {
    const apartments = JSON.parse(localStorage.getItem('apartments'));
    const apartment = apartments.find(apt => apt.id === id);

    if (apartment) {
        document.getElementById('modalTitle').textContent = 'Editar Apartamento';
        document.getElementById('apartmentId').value = apartment.id;
        document.getElementById('aptName').value = apartment.name;
        document.getElementById('aptLocation').value = apartment.location;
        document.getElementById('aptPrice').value = apartment.price;
        document.getElementById('aptBedrooms').value = apartment.bedrooms;
        document.getElementById('aptBathrooms').value = apartment.bathrooms;
        document.getElementById('aptSize').value = apartment.size;
        document.getElementById('aptImage').value = apartment.image;
        document.getElementById('aptDescription').value = apartment.description || '';
        document.getElementById('aptBadge').value = apartment.badge || '';
        modal.style.display = 'flex';
    }
}

// Delete apartment
function deleteApartment(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este apartamento?')) {
        let apartments = JSON.parse(localStorage.getItem('apartments'));
        apartments = apartments.filter(apt => apt.id !== id);
        localStorage.setItem('apartments', JSON.stringify(apartments));
        loadApartments();
    }
}

// Initialize on page load
checkAuth();

