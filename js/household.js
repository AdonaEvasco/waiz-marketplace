// js/household.js - HOUSEHOLD DASHBOARD FUNCTIONS

// Global Variables
let currentStep = 1;
let selectedMaterial = null;

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map if element exists
    if (document.getElementById('map')) {
        initHouseholdMap();
    }
    
    // Setup user dropdown toggle
    setupUserDropdown();
    
    // Setup navigation active states
    setupNavigation();
    
    // Setup form step indicators
    setupFormSteps();
});

// Initialize household map
function initHouseholdMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }
    
    // Default coordinates (Quezon City)
    const userLocation = [14.6760, 121.0437];
    
    // Create map
    const map = L.map('map').setView(userLocation, 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add user location marker
    const userIcon = L.divIcon({
        html: '<i class="fas fa-home" style="color: white; font-size: 18px; background: #1a472a; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 0 0 3px #1a472a;"></i>',
        iconSize: [40, 40],
        className: 'user-marker'
    });
    
    L.marker(userLocation, { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Your Location</b><br>Quezon City')
        .openPopup();
    
    // Add sample junkshop markers
    addJunkshopMarkers(map);
    
    // Add sample listing markers
    addListingMarkers(map);
    
    // Store map in global variable
    window.householdMap = map;
}

// Add sample junkshop markers to map
function addJunkshopMarkers(map) {
    const junkshops = [
        {
            id: 1,
            coords: [14.6800, 121.0400],
            name: 'Green Junk Shop',
            rating: 4.7,
            distance: '2.3 km'
        },
        {
            id: 2,
            coords: [14.6720, 121.0500],
            name: 'Metro Recycling',
            rating: 4.2,
            distance: '3.1 km'
        },
        {
            id: 3,
            coords: [14.6700, 121.0350],
            name: 'Eco Collectors',
            rating: 4.5,
            distance: '1.8 km'
        }
    ];
    
    junkshops.forEach(shop => {
        const markerIcon = L.divIcon({
            html: `<div style="background-color: #d4af37; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                     <i class="fas fa-store"></i>
                   </div>`,
            iconSize: [40, 40]
        });
        
        const marker = L.marker(shop.coords, { icon: markerIcon })
            .addTo(map)
            .bindPopup(`
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 10px 0; color: #1a472a;">${shop.name}</h4>
                    <p style="margin: 5px 0;"><i class="fas fa-star" style="color: #d4af37;"></i> ${shop.rating}/5.0</p>
                    <p style="margin: 5px 0;"><i class="fas fa-map-marker-alt"></i> ${shop.distance} away</p>
                    <button onclick="viewJunkshop(${shop.id})" style="background-color: #1a472a; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold; margin-top: 10px;">
                        View Details
                    </button>
                </div>
            `);
        
        // Store marker reference
        shop.marker = marker;
    });
}

// Add sample listing markers to map
function addListingMarkers(map) {
    const listings = [
        {
            id: 1,
            coords: [14.6780, 121.0420],
            type: 'plastic',
            title: 'Plastic Bottles'
        },
        {
            id: 2,
            coords: [14.6765, 121.0445],
            type: 'paper',
            title: 'Old Newspapers'
        }
    ];
    
    const typeColors = {
        plastic: '#3498db',
        paper: '#2ecc71'
    };
    
    listings.forEach(listing => {
        const markerColor = typeColors[listing.type] || '#3498db';
        
        const markerIcon = L.divIcon({
            html: `<div style="background-color: ${markerColor}; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                     <i class="fas fa-${getListingIcon(listing.type)}"></i>
                   </div>`,
            iconSize: [35, 35]
        });
        
        L.marker(listing.coords, { icon: markerIcon })
            .addTo(map)
            .bindPopup(`
                <div style="min-width: 180px;">
                    <h4 style="margin: 0 0 10px 0; color: #1a472a;">${listing.title}</h4>
                    <p style="margin: 5px 0;">Your listing</p>
                </div>
            `);
    });
}

// Get icon for listing type
function getListingIcon(type) {
    const icons = {
        plastic: 'recycle',
        paper: 'newspaper',
        metal: 'cube',
        glass: 'glass-whiskey'
    };
    return icons[type] || 'box';
}

// Setup user dropdown
function setupUserDropdown() {
    const userProfile = document.querySelector('.user-profile');
    const dropdown = document.querySelector('.user-dropdown');
    
    if (userProfile && dropdown) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function() {
            dropdown.style.display = 'none';
        });
    }
}

// Setup navigation active states
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // In a real app, you would load content here
            console.log('Navigating to:', this.querySelector('span').textContent);
        });
    });
}

// Setup form steps
function setupFormSteps() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.dataset.step);
            if (stepNumber <= currentStep) {
                goToStep(stepNumber);
            }
        });
    });
}

// New Listing Modal Functions
function showNewListingModal() {
    const modal = document.getElementById('newListingModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Reset form
    resetNewListingForm();
}

function closeNewListingModal() {
    const modal = document.getElementById('newListingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function resetNewListingForm() {
    currentStep = 1;
    selectedMaterial = null;
    
    // Reset step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('.step[data-step="1"]').classList.add('active');
    
    // Show step 1
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    
    // Clear material selection
    document.querySelectorAll('.material-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Clear form fields
    document.getElementById('weight').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('location').value = '';
    document.getElementById('availability').value = 'weekdays';
}

// Form step navigation
function nextStep() {
    // Validate current step
    if (!validateCurrentStep()) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Update step indicator
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Move to next step
    currentStep++;
    
    // Show next step
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update step indicator
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Initialize map on step 3
    if (currentStep === 3 && !window.listingMap) {
        initListingMap();
    }
}

function prevStep() {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Update step indicator
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Move to previous step
    currentStep--;
    
    // Show previous step
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update step indicator
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
}

function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 3) return;
    
    // Validate all previous steps
    for (let i = 1; i < stepNumber; i++) {
        if (!validateStep(i)) {
            alert('Please complete previous steps first');
            return;
        }
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    for (let i = 1; i <= stepNumber; i++) {
        document.querySelector(`.step[data-step="${i}"]`).classList.add('active');
    }
    
    // Show target step
    currentStep = stepNumber;
    document.getElementById(`step${currentStep}`).classList.add('active');
}

// Step validation
function validateCurrentStep() {
    return validateStep(currentStep);
}

function validateStep(stepNumber) {
    switch(stepNumber) {
        case 1:
            const weight = document.getElementById('weight').value;
            if (!selectedMaterial) {
                alert('Please select a material type');
                return false;
            }
            if (!weight || weight <= 0) {
                alert('Please enter a valid weight');
                return false;
            }
            return true;
            
        case 2:
            // Step 2 validation (if any)
            return true;
            
        case 3:
            const location = document.getElementById('location').value;
            if (!location.trim()) {
                alert('Please enter a pickup location');
                return false;
            }
            return true;
            
        default:
            return true;
    }
}

// Material selection
function selectMaterial(material) {
    selectedMaterial = material;
    
    // Remove selection from all options
    document.querySelectorAll('.material-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    event.currentTarget.classList.add('selected');
}

// Initialize listing map (for step 3)
function initListingMap() {
    if (typeof L === 'undefined') {
        console.error('Leaflet not loaded');
        return;
    }
    
    const userLocation = [14.6760, 121.0437];
    const map = L.map('listingMap').setView(userLocation, 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add draggable marker
    const markerIcon = L.divIcon({
        html: '<i class="fas fa-map-marker-alt" style="color: #e74c3c; font-size: 40px;"></i>',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });
    
    window.listingMarker = L.marker(userLocation, {
        icon: markerIcon,
        draggable: true
    }).addTo(map);
    
    // Store map reference
    window.listingMap = map;
}

// Use current location for listing
function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const coords = [position.coords.latitude, position.coords.longitude];
                
                if (window.listingMap && window.listingMarker) {
                    window.listingMap.setView(coords, 16);
                    window.listingMarker.setLatLng(coords);
                }
                
                // Update location field
                document.getElementById('location').value = 'Current Location (GPS)';
                
                alert('Location updated to your current position!');
            },
            function(error) {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please enter address manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Trigger image upload
function triggerImageUpload() {
    document.getElementById('imageUpload').click();
}

// Filter junkshops by distance
function filterJunkshops(distance) {
    console.log('Filtering junkshops within', distance, 'km');
    // In a real app, this would filter markers on the map
    alert(`Showing junkshops within ${distance} km`);
}

// Offer Actions
function acceptOffer(offerId) {
    if (confirm('Accept this offer?')) {
        // Update UI
        const offerCard = event.target.closest('.offer-card');
        offerCard.classList.add('accepted');
        
        // Disable buttons
        const buttons = offerCard.querySelectorAll('button');
        buttons.forEach(btn => btn.disabled = true);
        
        // Change accept button text
        event.target.innerHTML = '<i class="fas fa-check"></i> Accepted';
        event.target.classList.remove('btn-success');
        event.target.classList.add('btn-outline');
        
        alert('Offer accepted! The junkshop will contact you for pickup details.');
    }
}

function declineOffer(offerId) {
    if (confirm('Decline this offer?')) {
        const offerCard = event.target.closest('.offer-card');
        offerCard.style.opacity = '0.5';
        offerCard.style.pointerEvents = 'none';
        
        alert('Offer declined.');
    }
}

function counterOffer(offerId) {
    const counterAmount = prompt('Enter your counter offer amount (₱):');
    if (counterAmount && !isNaN(counterAmount)) {
        alert(`Counter offer of ₱${counterAmount} sent!`);
        // In real app, send to server
    }
}

// View offers for a listing
function viewOffers(listingId) {
    alert(`Viewing offers for listing #${listingId}`);
    // In real app, navigate to offers page
}

// Edit listing
function editListing(listingId) {
    alert(`Editing listing #${listingId}`);
    // In real app, open edit modal
}

// View pickup details
function viewPickupDetails(listingId) {
    alert(`Viewing pickup details for listing #${listingId}`);
    // In real app, show pickup details
}

// View junkshop details
function viewJunkshop(junkshopId) {
    alert(`Viewing details for junkshop #${junkshopId}`);
    // In real app, show junkshop profile
}

// Submit new listing
function submitListing() {
    if (!validateCurrentStep()) {
        return;
    }
    
    const material = selectedMaterial;
    const weight = document.getElementById('weight').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const location = document.getElementById('location').value;
    const availability = document.getElementById('availability').value;
    
    // In a real app, this would send to server
    console.log('Submitting listing:', {
        material,
        weight,
        description,
        price,
        location,
        availability
    });
    
    // Simulate API call
    setTimeout(() => {
        alert('Listing created successfully!');
        closeNewListingModal();
        
        // In real app, refresh listings
    }, 1000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const newListingModal = document.getElementById('newListingModal');
    if (event.target === newListingModal) {
        closeNewListingModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const newListingModal = document.getElementById('newListingModal');
        if (newListingModal.style.display === 'flex') {
            closeNewListingModal();
        }
    }
});
