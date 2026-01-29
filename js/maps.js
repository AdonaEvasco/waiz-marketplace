// js/maps.js - SHARED MAP FUNCTIONS (Optional)

// This file contains map-related functions that could be shared
// between household and junkshop dashboards

// Map configuration
const MAP_CONFIG = {
    defaultCenter: [14.6760, 121.0437], // Quezon City
    defaultZoom: 13,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
};

// Create a basic map
function createMap(elementId, center = MAP_CONFIG.defaultCenter, zoom = MAP_CONFIG.defaultZoom) {
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return null;
    }
    
    const map = L.map(elementId).setView(center, zoom);
    
    L.tileLayer(MAP_CONFIG.tileLayer, {
        attribution: MAP_CONFIG.attribution
    }).addTo(map);
    
    return map;
}

// Create a marker with custom icon
function createMarker(map, coords, options = {}) {
    const defaultOptions = {
        icon: L.divIcon({
            html: '<i class="fas fa-map-marker-alt" style="color: #e74c3c; font-size: 30px;"></i>',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        }),
        draggable: false
    };
    
    const markerOptions = { ...defaultOptions, ...options };
    const marker = L.marker(coords, markerOptions).addTo(map);
    
    return marker;
}

// Create a circle (for service areas)
function createCircle(map, center, radius, options = {}) {
    const defaultOptions = {
        color: '#1a472a',
        fillColor: 'rgba(26, 71, 42, 0.2)',
        fillOpacity: 0.3
    };
    
    const circleOptions = { ...defaultOptions, ...options };
    const circle = L.circle(center, {
        ...circleOptions,
        radius: radius * 1000 // Convert km to meters
    }).addTo(map);
    
    return circle;
}

// Get user's current location
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
}

// Calculate distance between two coordinates (in km)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Format distance for display
function formatDistance(distanceInKm) {
    if (distanceInKm < 1) {
        return `${Math.round(distanceInKm * 1000)} m`;
    } else {
        return `${distanceInKm.toFixed(1)} km`;
    }
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createMap,
        createMarker,
        createCircle,
        getCurrentLocation,
        calculateDistance,
        formatDistance
    };
}
