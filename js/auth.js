// js/auth.js - AUTHENTICATION FUNCTIONS

// Show authentication modal
function showAuthModal(type = 'login') {
    const modal = document.getElementById('authModal');
    const content = document.getElementById('authContent');
    
    if (type === 'login') {
        content.innerHTML = `
            <div class="auth-form">
                <h2>Welcome Back</h2>
                <p>Sign in to your WAIZ account</p>
                
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" class="form-control" placeholder="your@email.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" class="form-control" placeholder="••••••••" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="userType">I am a:</label>
                        <select id="userType" class="form-control" required>
                            <option value="household">Household User</option>
                            <option value="junkshop">Junkshop Owner</option>
                        </select>
                    </div>
                    
                    <div class="form-options">
                        <label>
                            <input type="checkbox" checked>
                            Remember me
                        </label>
                        <a href="#" class="forgot-link">Forgot password?</a>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Sign In
                    </button>
                </form>
                
                <div class="auth-footer">
                    <p>Don't have an account? <a href="#" onclick="showAuthModal('register')">Sign up</a></p>
                </div>
            </div>
        `;
    } else if (type === 'register') {
        content.innerHTML = `
            <div class="auth-form">
                <h2>Join WAIZ</h2>
                <p>Create your account to get started</p>
                
                <form id="registerForm" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label for="regUserType">I want to join as:</label>
                        <select id="regUserType" class="form-control" required onchange="updateRegisterForm()">
                            <option value="">Select type</option>
                            <option value="household">Household User</option>
                            <option value="junkshop">Junkshop Owner</option>
                        </select>
                    </div>
                    
                    <div id="householdFields" style="display: none;">
                        <div class="form-group">
                            <label for="fullName">Full Name</label>
                            <input type="text" id="fullName" class="form-control" placeholder="John Doe">
                        </div>
                    </div>
                    
                    <div id="junkshopFields" style="display: none;">
                        <div class="form-group">
                            <label for="shopName">Junkshop Name</label>
                            <input type="text" id="shopName" class="form-control" placeholder="Green Junkshop">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="regEmail">Email Address</label>
                        <input type="email" id="regEmail" class="form-control" placeholder="your@email.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="regPassword">Password</label>
                        <input type="password" id="regPassword" class="form-control" placeholder="••••••••" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" class="form-control" placeholder="••••••••" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input type="text" id="location" class="form-control" placeholder="City, Country">
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" id="terms" required>
                        <label for="terms">I agree to the <a href="#">Terms & Conditions</a></label>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                        Create Account
                    </button>
                </form>
                
                <div class="auth-footer">
                    <p>Already have an account? <a href="#" onclick="showAuthModal('login')">Sign in</a></p>
                </div>
            </div>
        `;
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close authentication modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real app, this would send data to a server
    console.log('Logging in:', { email, userType });
    
    // Simulate API call
    setTimeout(() => {
        // Redirect based on user type
        if (userType === 'household') {
            window.location.href = 'household.html';
        } else {
            window.location.href = 'junkshop.html';
        }
        
        closeAuthModal();
    }, 1000);
}

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    const userType = document.getElementById('regUserType').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!userType) {
        alert('Please select account type');
        return;
    }
    
    if (!email || !password) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // In a real app, this would send data to a server
    console.log('Registering:', { userType, email });
    
    // Simulate API call
    setTimeout(() => {
        alert('Account created successfully! Please check your email to verify your account.');
        
        // Redirect to login
        showAuthModal('login');
    }, 1000);
}

// Update registration form based on user type
function updateRegisterForm() {
    const userType = document.getElementById('regUserType').value;
    const householdFields = document.getElementById('householdFields');
    const junkshopFields = document.getElementById('junkshopFields');
    
    if (householdFields && junkshopFields) {
        householdFields.style.display = userType === 'household' ? 'block' : 'none';
        junkshopFields.style.display = userType === 'junkshop' ? 'block' : 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAuthModal();
    }
});
