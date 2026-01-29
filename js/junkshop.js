// js/junkshop.js - JUNKSHOP DASHBOARD FUNCTIONS

// Global Variables
let selectedListingId = null;
let serviceAreaMap = null;
let serviceAreaCircle = null;
let mainMap = null;

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main map
    if (document.getElementById('map')) {
        initMainMap();
    }
    
    // Setup user dropdown
    setupUserDropdown();
    
    // Setup navigation
    setupNavigation();
    
    // Setup form event listeners
    setupForms();
    
    // Initialize date pickers
    setupDatePickers();
    
    // Initialize service area modal
    if (document.getElementById('serviceAreaModal')) {
        initServiceAreaModal();
    }
});

// Initialize main map
function initMainMap() {
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }
    
    // Shop location (Quezon City)
    const shopLocation = [14.6760, 121.0437];
    
    // Create map
    mainMap = L.map('map').setView(shopLocation, 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mainMap);
    
    // Add shop marker
    const shopIcon = L.divIcon({
        html: '<i class="fas fa-store" style="color: white; font-size: 18px; background: #d4af37; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 0 0 3px #d4af37;"></i>',
        iconSize: [50, 50],
        className: 'shop-marker'
    });
    
    L.marker(shopLocation, { icon: shopIcon })
        .addTo(mainMap)
        .bindPopup('<b>Green Junk Shop</b><br>Your location')
        .openPopup();
    
    // Add service area circle (10km radius)
    serviceAreaCircle = L.circle(shopLocation, {
        color: '#1a472a',
        fillColor: 'rgba(26, 71, 42, 0.2)',
        fillOpacity: 0.3,
        radius: 10000 // 10km in meters
    }).addTo(mainMap);
    
    // Add sample listing markers
    addListingMarkers();
}

// Add sample listing markers to map
function addListingMarkers() {
    const listings = [
        {
            id: 1,
            coords: [14.6800, 121.0400],
            type: 'plastic',
            title: 'Plastic Bottles',
            distance: '2.3 km',
            user: 'Sarah J.',
            weight: '12 kg',
            posted: '2h ago',
            price: '₱300-₱400'
        },
        {
            id: 2,
            coords: [14.6720, 121.0500],
            type: 'paper',
            title: 'Old Newspapers',
            distance: '3.1 km',
            user: 'Juan D.',
            weight: '8 kg',
            posted: '5h ago',
            price: '₱160-₱200'
        },
        {
            id: 3,
            coords: [14.6700, 121.0350],
            type: 'metal',
            title: 'Aluminum Cans',
            distance: '4.5 km',
            user: 'Maria R.',
            weight: '5 kg',
            posted: '1d ago',
            price: '₱250-₱300'
        },
        {
            id: 4,
            coords: [14.6850, 121.0450],
            type: 'glass',
            title: 'Glass Bottles',
            distance: '1.8 km',
            user: 'Carlos L.',
            weight: '15 kg',
            posted: '3h ago',
            price: '₱225-₱300'
        }
    ];
    
    const typeColors = {
        plastic: '#3498db',
        paper: '#2ecc71',
        metal: '#e74c3c',
        glass: '#9b59b6'
    };
    
    listings.forEach(listing => {
        const markerColor = typeColors[listing.type] || '#3498db';
        
        const markerIcon = L.divIcon({
            html: `<div style="background-color: ${markerColor}; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); cursor: pointer;" onclick="focusOnListing(${listing.id})">
                     <i class="fas fa-${getListingIcon(listing.type)}"></i>
                   </div>`,
            iconSize: [35, 35],
            className: 'listing-marker'
        });
        
        const marker = L.marker(listing.coords, { 
            icon: markerIcon,
            listingId: listing.id
        })
        .addTo(mainMap)
        .bindPopup(`
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; color: #1a472a;">${listing.title}</h4>
                <p style="margin: 5px 0;"><i class="fas fa-user"></i> ${listing.user}</p>
                <p style="margin: 5px 0;"><i class="fas fa-weight-hanging"></i> ${listing.weight}</p>
                <p style="margin: 5px 0;"><i class="fas fa-map-marker-alt"></i> ${listing.distance} away</p>
                <p style="margin: 5px 0;"><i class="fas fa-money-bill-wave"></i> ${listing.price}</p>
                <button onclick="makeOffer(${listing.id})" style="background-color: #1a472a; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold; margin-top: 10px;">
                    Make Offer
                </button>
            </div>
        `);
        
        // Store reference
        listing.marker = marker;
    });
    
    // Store listings globally for reference
    window.junkshopListings = listings;
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

// Setup navigation
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

// Setup forms
function setupForms() {
    // Offer amount calculation
    const offerAmountInput = document.getElementById('offerAmount');
    if (offerAmountInput) {
        offerAmountInput.addEventListener('input', updatePriceBreakdown);
    }
}

// Setup date pickers
function setupDatePickers() {
    // Set minimum date to tomorrow
    const pickupDateInput = document.getElementById('pickupDate');
    if (pickupDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        pickupDateInput.min = tomorrow.toISOString().split('T')[0];
        
        // Set default to tomorrow
        pickupDateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

// Initialize service area modal
function initServiceAreaModal() {
    if (typeof L === 'undefined') return;
    
    const shopLocation = [14.6760, 121.0437];
    
    serviceAreaMap = L.map('serviceAreaMap').setView(shopLocation, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(serviceAreaMap);
    
    // Add shop marker
    const shopIcon = L.divIcon({
        html: '<i class="fas fa-store" style="color: white; font-size: 20px; background: #d4af37; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 0 0 4px #d4af37;"></i>',
        iconSize: [60, 60]
    });
    
    L.marker(shopLocation, { icon: shopIcon })
        .addTo(serviceAreaMap)
        .bindPopup('<b>Your Junkshop</b>')
        .openPopup();
    
    // Add initial service area circle
    updateServiceRadius(10);
}

// Update service radius
function updateServiceRadius(radius) {
    document.getElementById('radiusValue').textContent = radius;
    
    if (serviceAreaMap && serviceAreaCircle) {
        serviceAreaMap.removeLayer(serviceAreaCircle);
    }
    
    const shopLocation = [14.6760, 121.0437];
    serviceAreaCircle = L.circle(shopLocation, {
        color: '#1a472a',
        fillColor: 'rgba(26, 71, 42, 0.2)',
        fillOpacity: 0.3,
        radius: radius * 1000 // Convert km to meters
    }).addTo(serviceAreaMap);
}

// Filter listings by material
function filterListings(material) {
    console.log('Filtering listings by material:', material);
    
    if (material === 'all') {
        // Show all listings
        if (window.junkshopListings) {
            window.junkshopListings.forEach(listing => {
                if (listing.marker) {
                    mainMap.addLayer(listing.marker);
                }
            });
        }
    } else {
        // Filter by material
        if (window.junkshopListings) {
            window.junkshopListings.forEach(listing => {
                if (listing.marker) {
                    if (listing.type === material) {
                        mainMap.addLayer(listing.marker);
                    } else {
                        mainMap.removeLayer(listing.marker);
                    }
                }
            });
        }
    }
}

// Sort listings
function sortListings(sortBy) {
    console.log('Sorting listings by:', sortBy);
    alert(`Listings sorted by ${sortBy}`);
}

// Refresh map
function refreshMap() {
    if (mainMap) {
        mainMap.setView([14.6760, 121.0437], 12);
        alert('Map refreshed!');
    }
}

// Focus on specific listing
function focusOnListing(listingId) {
    if (!window.junkshopListings) return;
    
    const listing = window.junkshopListings.find(l => l.id === listingId);
    if (listing && listing.marker) {
        mainMap.setView(listing.coords, 15);
        listing.marker.openPopup();
    }
}

// View details of a listing
function viewDetails(listingId) {
    if (!window.junkshopListings) return;
    
    const listing = window.junkshopListings.find(l => l.id === listingId);
    if (listing) {
        alert(`Viewing details for:\n${listing.title}\nWeight: ${listing.weight}\nPosted: ${listing.posted}\nPrice Range: ${listing.price}\nDistance: ${listing.distance}\nUser: ${listing.user}`);
    }
}

// Show make offer modal
function makeOffer(listingId) {
    selectedListingId = listingId;
    
    if (!window.junkshopListings) return;
    
    const listing = window.junkshopListings.find(l => l.id === listingId);
    if (listing) {
        // Update modal with listing info
        document.getElementById('offerListingTitle').textContent = `${listing.title} (${listing.weight})`;
        document.getElementById('offerListingUser').textContent = listing.user;
        document.getElementById('offerListingDistance').textContent = `${listing.distance} away`;
        
        // Set suggested price
        const priceRange = listing.price.replace('₱', '').split('-');
        const suggestedPrice = priceRange.length > 1 ? 
            Math.round((parseInt(priceRange[0]) + parseInt(priceRange[1])) / 2) : 
            parseInt(priceRange[0]);
        
        document.getElementById('offerAmount').value = suggestedPrice;
        updatePriceBreakdown();
        
        // Show modal
        showMakeOfferModal();
    }
}

// Show make offer modal
function showMakeOfferModal() {
    const modal = document.getElementById('makeOfferModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close make offer modal
function closeMakeOfferModal() {
    const modal = document.getElementById('makeOfferModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedListingId = null;
}

// Update price breakdown
function updatePriceBreakdown() {
    const offerAmount = document.getElementById('offerAmount').value;
    if (!offerAmount || isNaN(offerAmount)) return;
    
    if (!window.junkshopListings || !selectedListingId) return;
    
    const listing = window.junkshopListings.find(l => l.id === selectedListingId);
    if (!listing) return;
    
    // Extract weight from string (e.g., "12 kg" -> 12)
    const weight = parseFloat(listing.weight);
    
    if (weight > 0) {
        const pricePerKg = (offerAmount / weight).toFixed(2);
        document.getElementById('pricePerKg').textContent = `₱${pricePerKg}`;
        document.getElementById('totalPrice').textContent = `₱${offerAmount}`;
    }
}

// Submit offer
function submitOffer(event) {
    event.preventDefault();
    
    const offerAmount = document.getElementById('offerAmount').value;
    const offerMessage = document.getElementById('offerMessage').value;
    const pickupDate = document.getElementById('pickupDate').value;
    const pickupTime = document.getElementById('pickupTime').value;
    
    if (!selectedListingId) {
        alert('No listing selected');
        return;
    }
    
    if (!offerAmount || offerAmount <= 0) {
        alert('Please enter a valid offer amount');
        return;
    }
    
    // In a real app, this would send to server
    console.log('Submitting offer:', {
        listingId: selectedListingId,
        amount: offerAmount,
        message: offerMessage,
        pickupDate,
        pickupTime
    });
    
    // Simulate API call
    setTimeout(() => {
        alert(`Offer of ₱${offerAmount} submitted successfully!`);
        closeMakeOfferModal();
        
        // Reset form
        document.getElementById('offerForm').reset();
    }, 1000);
}

// Show service area modal
function viewServiceArea() {
    const modal = document.getElementById('serviceAreaModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Refresh map size
    setTimeout(() => {
        if (serviceAreaMap) {
            serviceAreaMap.invalidateSize();
        }
    }, 100);
}

// Close service area modal
function closeServiceAreaModal() {
    const modal = document.getElementById('serviceAreaModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Save service area
function saveServiceArea() {
    const radius = document.getElementById('serviceRadius').value;
    const areas = document.getElementById('serviceAreas').value;
    
    // In a real app, this would save to server
    console.log('Saving service area:', { radius, areas });
    
    setTimeout(() => {
        alert(`Service area updated to ${radius}km radius!`);
        closeServiceAreaModal();
        
        // Update main map service area
        if (serviceAreaCircle) {
            serviceAreaCircle.setRadius(radius * 1000);
        }
    }, 1000);
}

// Show terms and conditions
function showTerms() {
    alert('Terms and conditions would be displayed here.');
    // In real app, show terms modal
}

// Edit offer
function editOffer(offerId) {
    alert(`Editing offer #${offerId}`);
    // In real app, open edit modal
}

// Withdraw offer
function withdrawOffer(offerId) {
    if (confirm('Are you sure you want to withdraw this offer?')) {
        alert(`Offer #${offerId} withdrawn`);
        // In real app, send withdrawal to server
    }
}

// Schedule pickup
function schedulePickup(offerId) {
    alert(`Scheduling pickup for offer #${offerId}`);
    // In real app, open scheduling modal
}

// Respond to counter offer
function respondToCounter(offerId) {
    const response = prompt('Enter your response amount (₱):');
    if (response && !isNaN(response)) {
        alert(`Response of ₱${response} sent!`);
        // In real app, send response to server
    }
}

// Show route to pickup
function showRoute(pickupId) {
    if (!mainMap) return;
    
    // Sample pickup locations
    const pickupLocations = [
        [14.6800, 121.0400], // Plastic bottles
        [14.6720, 121.0500], // Newspapers
        [14.6850, 121.0450]  // Glass bottles
    ];
    
    const index = pickupId - 1;
    if (pickupLocations[index]) {
        const shopLocation = [14.6760, 121.0437];
        
        // Show route line
        const routeLine = L.polyline([
            shopLocation,
            pickupLocations[index]
        ], {
            color: '#1a472a',
            weight: 4,
            dashArray: '10, 10',
            opacity: 0.7
        }).addTo(mainMap);
        
        // Center map on route
        const bounds = L.latLngBounds([shopLocation, pickupLocations[index]]);
        mainMap.fitBounds(bounds);
        
        // Remove route after 10 seconds
        setTimeout(() => {
            if (routeLine) {
                mainMap.removeLayer(routeLine);
            }
        }, 10000);
        
        alert('Route displayed on map. The line will disappear in 10 seconds.');
    }
}

// Call customer
function callCustomer(pickupId) {
    alert(`In a real app, this would call the customer for pickup #${pickupId}`);
}

// New offer modal (from welcome banner)
function showNewOfferModal() {
    alert('Opening new offer creation. You can browse listings on the map or table to make offers.');
    // In real app, you might highlight the listings section
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const makeOfferModal = document.getElementById('makeOfferModal');
    const serviceAreaModal = document.getElementById('serviceAreaModal');
    
    if (event.target === makeOfferModal) {
        closeMakeOfferModal();
    }
    
    if (event.target === serviceAreaModal) {
        closeServiceAreaModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const makeOfferModal = document.getElementById('makeOfferModal');
        const serviceAreaModal = document.getElementById('serviceAreaModal');
        
        if (makeOfferModal.style.display === 'flex') {
            closeMakeOfferModal();
        }
        
        if (serviceAreaModal.style.display === 'flex') {
            closeServiceAreaModal();
        }
    }
});
