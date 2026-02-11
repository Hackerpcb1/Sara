// Contact Form JavaScript

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Load apartment data from URL or localStorage
function loadApartmentData() {
    const apartmentId = getUrlParameter('id');
    const apartmentName = getUrlParameter('name');
    const apartmentArea = getUrlParameter('area');
    
    if (apartmentId) {
        // Try to get from localStorage first
        const apartments = JSON.parse(localStorage.getItem('apartments') || '[]');
        const apartment = apartments.find(apt => apt.id == apartmentId);
        
        if (apartment) {
            document.getElementById('apartmentName').value = apartment.name;
            document.getElementById('apartmentArea').value = apartment.location;
        } else if (apartmentName && apartmentArea) {
            // Use URL parameters as fallback
            document.getElementById('apartmentName').value = apartmentName;
            document.getElementById('apartmentArea').value = apartmentArea;
        }
    } else if (apartmentName && apartmentArea) {
        document.getElementById('apartmentName').value = apartmentName;
        document.getElementById('apartmentArea').value = apartmentArea;
    }
}

// Show/hide pets details
document.getElementById('hasPets').addEventListener('change', function() {
    const petsDetailsGroup = document.getElementById('petsDetailsGroup');
    if (this.value === 'si') {
        petsDetailsGroup.style.display = 'block';
        document.getElementById('petsDetails').required = true;
    } else {
        petsDetailsGroup.style.display = 'none';
        document.getElementById('petsDetails').required = false;
    }
});

// Form submission
document.getElementById('rentalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        // Personal Information
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dni: document.getElementById('dni').value,
        birthDate: document.getElementById('birthDate').value,
        nationality: document.getElementById('nationality').value,
        
        // Apartment Information
        apartmentName: document.getElementById('apartmentName').value,
        apartmentArea: document.getElementById('apartmentArea').value,
        moveInDate: document.getElementById('moveInDate').value,
        rentalPeriod: document.getElementById('rentalPeriod').value,
        
        // Employment Information
        occupation: document.getElementById('occupation').value,
        workplace: document.getElementById('workplace').value,
        monthlyIncome: document.getElementById('monthlyIncome').value,
        employmentType: document.getElementById('employmentType').value,
        
        // Additional Information
        numOccupants: document.getElementById('numOccupants').value,
        hasPets: document.getElementById('hasPets').value,
        petsDetails: document.getElementById('petsDetails').value,
        emergencyContact: document.getElementById('emergencyContact').value,
        references: document.getElementById('references').value,
        additionalComments: document.getElementById('additionalComments').value,
        
        // Timestamp
        submittedAt: new Date().toISOString()
    };
    
    // Save to localStorage (in a real app, this would be sent to a server)
    const submissions = JSON.parse(localStorage.getItem('rentalSubmissions') || '[]');
    submissions.push(formData);
    localStorage.setItem('rentalSubmissions', JSON.stringify(submissions));
    
    // Show success message
    document.querySelector('.rental-form').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('Form submitted:', formData);
});

// Set minimum date for move-in date (today)
const today = new Date().toISOString().split('T')[0];
document.getElementById('moveInDate').setAttribute('min', today);

// Set maximum date for birth date (18 years ago)
const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
document.getElementById('birthDate').setAttribute('max', eighteenYearsAgo.toISOString().split('T')[0]);

// Initialize
loadApartmentData();

