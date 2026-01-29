// js/landing.js - LANDING PAGE SPECIFIC FUNCTIONS

// Scroll to signup section
function scrollToSignup() {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
        signupSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show video modal
function showVideo() {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // In real implementation, you would play a video
    console.log('Playing demo video...');
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Toggle mobile menu (will be implemented with CSS)
function toggleMobileMenu() {
    alert('Mobile menu will be implemented');
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'var(--shadow)';
        }
    });
});

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const videoModal = document.getElementById('videoModal');
    if (event.target === videoModal) {
        closeVideoModal();
    }
});

// Close video modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const videoModal = document.getElementById('videoModal');
        if (videoModal.style.display === 'flex') {
            closeVideoModal();
        }
    }
});
