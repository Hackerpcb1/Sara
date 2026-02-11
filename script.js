// JavaScript for Apartment Rental Website

// Function to filter apartments on listings page
function filterApartments() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const priceFilter = document.getElementById('price-filter').value;
    const cityFilter = document.getElementById('city-filter').value;
    const neighborhoodFilter = document.getElementById('neighborhood-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const apartments = document.querySelectorAll('.apartment-card');

    apartments.forEach(apartment => {
        const title = apartment.querySelector('h3').textContent.toLowerCase();
        const location = apartment.querySelector('p').textContent.toLowerCase();
        const price = parseInt(apartment.dataset.price);
        const city = apartment.dataset.city;
        const neighborhood = apartment.dataset.neighborhood;
        const type = apartment.dataset.type;

        let showApartment = true;

        // Filter by search term
        if (searchTerm && !title.includes(searchTerm) && !location.includes(searchTerm)) {
            showApartment = false;
        }

        // Filter by price
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(p => parseInt(p) || Infinity);
            if (price < min || (max && price > max)) {
                showApartment = false;
            }
        }

        // Filter by city
        if (cityFilter && city !== cityFilter) {
            showApartment = false;
        }

        // Filter by neighborhood
        if (neighborhoodFilter && neighborhood !== neighborhoodFilter) {
            showApartment = false;
        }

        // Filter by type
        if (typeFilter && type !== typeFilter) {
            showApartment = false;
        }

        apartment.style.display = showApartment ? 'block' : 'none';
    });
}

// Function to clear all filters
function clearFilters() {
    document.getElementById('search').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('city-filter').value = '';
    document.getElementById('neighborhood-filter').value = '';
    document.getElementById('type-filter').value = '';
    filterApartments();
}

// Function to change main image on apartment detail page
function changeImage(src) {
    document.getElementById('main-image').src = src;
}

// Function to contact owner - redirects to contact form with apartment info
function contactOwner() {
    const apartmentTitle = document.getElementById('apartment-title').textContent;
    const apartmentLocation = document.getElementById('apartment-location').textContent.replace('Ubicación: ', '');
    const apartmentId = getUrlParameter('id');

    // Redirect to contact page with apartment information
    window.location.href = `contacto.html?id=${apartmentId}&name=${encodeURIComponent(apartmentTitle)}&area=${encodeURIComponent(apartmentLocation)}`;
}

// Function to get URL parameter
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to load apartment images based on ID
function loadApartmentImages() {
    const apartmentId = getUrlParameter('id');
    if (apartmentId) {
        const mainImage = document.getElementById('main-image');
        const thumbnails = document.querySelectorAll('.thumbnail-images img');

        // Set main image
        const mainSrc = `images/apartment${apartmentId}.jpg`;
        mainImage.src = mainSrc;
        mainImage.onerror = function() {
            this.src = 'https://via.placeholder.com/600x400?text=Apartamento+Principal';
        };

        // Set thumbnails (assuming up to 3 images per apartment: apartment{id}.jpg, apartment{id}-1.jpg, etc.)
        thumbnails.forEach((thumbnail, index) => {
            const thumbSrc = `images/apartment${apartmentId}${index > 0 ? '-' + index : ''}.jpg`;
            thumbnail.src = thumbSrc;
            thumbnail.onerror = function() {
                this.src = `https://via.placeholder.com/150x100?text=Imagen+${index + 1}`;
            };
        });
    }
}

// Slideshow variables
let slideIndex = 1;
let slideTimer = null;

// Function to show slides
function showSlides(n) {
    let i;
    const slides = document.querySelectorAll('.thumbnail-images img');
    const dots = document.querySelectorAll('.dot');

    if (!slides || slides.length === 0) return;

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}

    for (i = 0; i < slides.length; i++) {
        slides[i].className = slides[i].className.replace(" active", "");
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].className += " active";
    if (dots[slideIndex-1]) {
        dots[slideIndex-1].className += " active";
    }

    // Update main image to match current slide
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = slides[slideIndex-1].src;
    }
}

// Function to auto-advance slides
function autoSlides() {
    const slides = document.querySelectorAll('.thumbnail-images img');
    if (!slides || slides.length === 0) return;

    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    showSlides(slideIndex);

    // Continue auto-play every 3 seconds
    slideTimer = setTimeout(autoSlides, 3000);
}

// Function to change slide (manual control)
function changeSlide(n) {
    // Clear auto-play timer when manually changing
    if (slideTimer) {
        clearTimeout(slideTimer);
    }
    showSlides(slideIndex += n);
    // Restart auto-play
    slideTimer = setTimeout(autoSlides, 3000);
}

// Function to set current slide
function currentSlide(n) {
    // Clear auto-play timer when manually selecting
    if (slideTimer) {
        clearTimeout(slideTimer);
    }
    showSlides(slideIndex = n);
    // Restart auto-play
    slideTimer = setTimeout(autoSlides, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for filters if on listings page
    const searchInput = document.getElementById('search');
    const priceFilter = document.getElementById('price-filter');

    if (searchInput && priceFilter) {
        searchInput.addEventListener('input', filterApartments);
        priceFilter.addEventListener('change', filterApartments);
    }

    // Load apartment images if on detail page
    if (document.getElementById('main-image')) {
        loadApartmentImages();
        // Initialize slideshow after loading images
        setTimeout(() => {
            showSlides(slideIndex);
            // Start auto-play after 3 seconds
            slideTimer = setTimeout(autoSlides, 3000);
        }, 100);

        // Add event listeners for thumbnail images if on detail page
        const thumbnails = document.querySelectorAll('.thumbnail-images img');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function() {
                currentSlide(index + 1);
            });
        });
    }

    // Add event listener for user menu button
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openAuthModal();
        });
    }

    // Close modal when clicking outside
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
});

// ===== SEARCH FUNCTIONALITY =====

// Search from hero section
function searchFromHero() {
    const location = document.getElementById('heroLocationSearch').value;
    const price = document.getElementById('heroPriceSearch').value;

    // Build query string
    let queryParams = [];
    if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
    if (price) queryParams.push(`maxPrice=${price}`);

    // Redirect to listings page with search parameters
    const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
    window.location.href = `listings.html${queryString}`;
}

// ===== AUTHENTICATION MODAL FUNCTIONS =====

// Open authentication modal
function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
        showLoginForm(); // Show login form by default
    }
}

// Close authentication modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show login form
function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
}

// Show register form
function showRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Simple validation
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Store user session (in a real app, this would be handled by a backend)
    const user = {
        email: email,
        loginDate: new Date().toISOString()
    };

    if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    // Close modal and show success message
    closeAuthModal();
    alert('¡Inicio de sesión exitoso! Bienvenido de vuelta.');

    // Update UI to show logged in state
    updateUserUI(email);
}

// Handle register form submission
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Por favor, completa todos los campos');
        return;
    }

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (!acceptTerms) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }

    // Store user data (in a real app, this would be handled by a backend)
    const user = {
        name: name,
        email: email,
        registerDate: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(user));

    // Close modal and show success message
    closeAuthModal();
    alert('¡Registro exitoso! Bienvenido a RentaApartamentos.');

    // Update UI to show logged in state
    updateUserUI(email);
}

// Update UI to show logged in user
function updateUserUI(email) {
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        const userName = email.split('@')[0];
        userMenuBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>${userName}</span>
        `;
    }
}

// Social login functions (placeholders for future implementation)
function loginWithGoogle() {
    alert('Inicio de sesión con Google próximamente disponible.\n\nEsta funcionalidad requiere integración con Google OAuth.');
}

function loginWithFacebook() {
    alert('Inicio de sesión con Facebook próximamente disponible.\n\nEsta funcionalidad requiere integración con Facebook Login.');
}

function loginWithApple() {
    alert('Inicio de sesión con Apple próximamente disponible.\n\nEsta funcionalidad requiere integración con Sign in with Apple.');
}
