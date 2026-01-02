// School Admin Onboarding Form JavaScript

let currentStep = 1;
const totalSteps = 3;
const formData = {};

// Comprehensive validators object
const validators = {
    fullName: {
        validate: (value) => {
            if (!value.trim()) return 'Full name is required';
            if (value.trim().length < 2) return 'Full name must be at least 2 characters';
            if (value.trim().length > 100) return 'Full name cannot exceed 100 characters';
            if (!/^[a-zA-Z\s.'-]+$/.test(value)) return 'Full name can only contain letters, spaces, dots, hyphens, and apostrophes';
            return '';
        }
    },
    email: {
        validate: (value) => {
            if (!value.trim()) return 'Email address is required';
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            if (value.length > 100) return 'Email cannot exceed 100 characters';
            return '';
        }
    },
    phone: {
        validate: (value) => {
            if (!value.trim()) return 'Phone number is required';
            const cleanPhone = value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) return 'Phone number must be exactly 10 digits';
            if (!/^[6-9]\d{9}$/.test(cleanPhone)) return 'Please enter a valid Indian mobile number';
            return '';
        }
    },
    school: {
        validate: (value) => {
            if (!value) return 'Please select a school';
            return '';
        }
    },
    gender: {
        validate: (value) => {
            if (!value) return 'Gender is required';
            return '';
        }
    },
    address: {
        validate: (value) => {
            // Optional field - only validate if value is provided
            if (!value || value.trim() === '') return '';
            if (value.trim().length < 10) return 'Address must be at least 10 characters';
            if (value.trim().length > 300) return 'Address cannot exceed 300 characters';
            return '';
        }
    }
};

// Helper function to show error
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Helper function to clear error
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    if (field && errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Helper functions to generate random data
function generateRandomName() {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Anjali', 'Suresh', 'Kavita', 'Ramesh', 'Deepa', 'Rohan', 'Neha'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Nair', 'Gupta', 'Verma', 'Rao', 'Desai'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

function generateRandomEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
    return `${name.toLowerCase().replace(/\s+/g, '.')}${Math.floor(Math.random() * 999)}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function generateRandomPhone() {
    return '9' + Math.floor(100000000 + Math.random() * 900000000);
}

function generateRandomDate(startYear, endYear) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

function generateRandomCity() {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
    return cities[Math.floor(Math.random() * cities.length)];
}

function generateRandomState() {
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];
    return states[Math.floor(Math.random() * states.length)];
}

function generateRandomPincode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Auto-fill function
function autoFillForm() {
    const name = generateRandomName();
    const city = generateRandomCity();
    const state = generateRandomState();

    // Step 1: Personal Details
    document.getElementById('fullName').value = name;
    document.getElementById('email').value = generateRandomEmail(name);
    document.getElementById('phone').value = generateRandomPhone();

    // Step 2: School Selection
    // Note: School will need to be selected manually via search in Step 2

    // Step 3: Additional Info
    document.getElementById('gender').value = ['male', 'female', 'other', 'prefer-not-to-say'][Math.floor(Math.random() * 4)];
    document.getElementById('dateOfBirth').value = generateRandomDate(1970, 2000);
    document.getElementById('address').value = `${Math.floor(1 + Math.random() * 999)} ${city} Street, ${city}`;
    document.getElementById('city').value = city;
    document.getElementById('state').value = state;
    document.getElementById('pincode').value = generateRandomPincode();

    alert('✅ Form auto-filled with random dummy data!');
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add real-time validation listeners for all fields
    Object.keys(validators).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            // Validate on blur
            field.addEventListener('blur', function () {
                const error = validators[fieldName].validate(this.value);
                if (error) {
                    showError(fieldName, error);
                } else {
                    clearError(fieldName);
                }
            });

            // Clear error on input
            field.addEventListener('input', function () {
                clearError(fieldName);
            });
        }
    });

    // Initialize
    updateStepDisplay();

    // Auto-Fill button handler
    const autoFillBtn = document.getElementById('autoFillBtn');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', function() {
            autoFillForm();
        });
    }

    // Next button handler
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            if (validateCurrentStep()) {
                saveCurrentStepData();
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateStepDisplay();
                }
            }
        });
    }

    // Back button handler
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            if (currentStep > 1) {
                currentStep--;
                updateStepDisplay();
            }
        });
    }

    // Form submission handler
    const schoolAdminForm = document.getElementById('schoolAdminForm');
    if (schoolAdminForm) {
        schoolAdminForm.addEventListener('submit', function (e) {
            // Only validate, don't prevent default submission
            if (!validateCurrentStep()) {
                e.preventDefault();
                return false;
            }
            // If validation passes, allow normal form submission to Django
            saveCurrentStepData();
            console.log('Form is valid, submitting to Django...');
            // Form will submit normally to the action URL
        });
    }

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    }

    // Pincode formatting
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 6) {
                value = value.slice(0, 6);
            }
            e.target.value = value;
        });
    }

    // Photo Upload Functionality
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const profilePhoto = document.getElementById('profilePhoto');
    const photoPreview = document.getElementById('photoPreview');

    if (uploadPhotoBtn && profilePhoto && photoPreview) {
        uploadPhotoBtn.addEventListener('click', function () {
            profilePhoto.click();
        });

        profilePhoto.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
                    profilePhoto.value = '';
                    return;
                }

                // Validate file size (2MB = 2 * 1024 * 1024 bytes)
                const maxSize = 2 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert('File size should not exceed 2MB. Your file is ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB');
                    profilePhoto.value = '';
                    return;
                }

                // Show preview
                const reader = new FileReader();
                reader.onload = function (event) {
                    photoPreview.style.backgroundImage = `url(${event.target.result})`;
                    photoPreview.style.backgroundSize = 'cover';
                    photoPreview.style.backgroundPosition = 'center';
                    photoPreview.innerHTML = '';
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

function updateStepDisplay() {
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (stepElement) {
            stepElement.style.display = 'none';
        }
    }

    // Show current step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (currentStepElement) {
        currentStepElement.style.display = 'block';
    }

    // Update stepper UI
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });

    // Update buttons
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (backBtn) backBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'flex' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';
}

function validateCurrentStep() {
    let isValid = true;
    const currentStepElement = document.getElementById(`step${currentStep}`);

    if (!currentStepElement) return true;

    // Get all fields with validators in the current step
    const fieldsToValidate = currentStepElement.querySelectorAll('input[id], select[id]');

    fieldsToValidate.forEach(field => {
        const fieldId = field.id;
        if (validators[fieldId]) {
            const error = validators[fieldId].validate(field.value);
            if (error) {
                showError(fieldId, error);
                isValid = false;
            } else {
                clearError(fieldId);
            }
        }
    });

    return isValid;
}

function saveCurrentStepData() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return;

    const inputs = currentStepElement.querySelectorAll('input, select');

    inputs.forEach(input => {
        if (input.name && input.type !== 'file') {
            formData[input.name] = input.value;
        }
    });
}

// School Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('schoolSearchInput');
    const searchBtn = document.getElementById('searchSchoolBtn');
    const searchResults = document.getElementById('schoolSearchResults');
    const resultsList = document.getElementById('resultsList');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const searchLoading = document.getElementById('searchLoading');
    const schoolHiddenInput = document.getElementById('school');
    const selectedSchoolCard = document.getElementById('selectedSchoolCard');
    const schoolSearchContainer = document.getElementById('schoolSearchContainer');
    const clearSchoolBtn = document.getElementById('clearSchoolBtn');

    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

    // Debounce timer for live search
    let searchTimeout = null;

    // Function to get school initials
    function getSchoolInitials(schoolName) {
        const words = schoolName.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        } else {
            return schoolName.substring(0, 2).toUpperCase();
        }
    }

    // Function to get badge color
    function getBadgeColor(schoolName) {
        return colors[schoolName.charCodeAt(0) % colors.length];
    }

    // Function to perform search
    function performSearch() {
        const query = searchInput.value.trim();

        if (!query) {
            // Hide results if search is cleared
            searchResults.style.display = 'none';
            noResults.style.display = 'none';
            searchLoading.style.display = 'none';
            return;
        }

        // Show loading
        searchLoading.style.display = 'block';
        searchResults.style.display = 'none';
        noResults.style.display = 'none';

        // Get CSRF token
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Make AJAX request
        fetch(`/super-admin/api/search-schools/?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            searchLoading.style.display = 'none';

            if (data.schools && data.schools.length > 0) {
                displayResults(data.schools);
            } else {
                noResults.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            searchLoading.style.display = 'none';
            alert('Error searching schools. Please try again.');
        });
    }

    // Function to display results
    function displayResults(schools) {
        resultsList.innerHTML = '';
        resultsCount.textContent = `${schools.length} school${schools.length !== 1 ? 's' : ''} found`;

        schools.forEach(school => {
            const schoolCard = document.createElement('div');
            schoolCard.className = 'school-result-card';

            // Add disabled class if school already has admin
            if (school.has_admin) {
                schoolCard.classList.add('school-assigned');
            }

            const initials = getSchoolInitials(school.school_name);
            const badgeColor = getBadgeColor(school.school_name);
            const location = school.city && school.state ? `${school.city}, ${school.state}` : (school.city || school.state || 'Location not specified');

            // Add "Assigned" tag if school has admin
            const assignedTag = school.has_admin ? '<span class="school-assigned-tag">Assigned</span>' : '';

            schoolCard.innerHTML = `
                <div class="school-result-badge" style="background-color: ${badgeColor};">
                    ${initials}
                </div>
                <div class="school-result-info">
                    <h4>${school.school_name} ${assignedTag}</h4>
                    <p>${location}</p>
                    ${school.school_code ? `<span class="school-result-code">Code: ${school.school_code}</span>` : ''}
                </div>
            `;

            // Only allow click if school doesn't have an admin assigned
            if (!school.has_admin) {
                schoolCard.addEventListener('click', function() {
                    selectSchool(school, initials, badgeColor, location);
                });
            }

            resultsList.appendChild(schoolCard);
        });

        searchResults.style.display = 'block';
    }

    // Function to select a school
    function selectSchool(school, initials, badgeColor, location) {
        // Set hidden input value
        schoolHiddenInput.value = school.id;

        // Update selected school card
        document.getElementById('selectedSchoolBadge').style.backgroundColor = badgeColor;
        document.getElementById('selectedSchoolBadge').textContent = initials;
        document.getElementById('selectedSchoolName').textContent = school.school_name;
        document.getElementById('selectedSchoolLocation').textContent = location;
        document.getElementById('selectedSchoolCode').textContent = school.school_code ? `Code: ${school.school_code}` : '';

        // Show selected card, hide search container
        selectedSchoolCard.style.display = 'flex';
        schoolSearchContainer.style.display = 'none';

        // Clear any error
        clearError('school');
    }

    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Live search - search as user types (with debouncing)
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            // Clear previous timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            // Set new timeout for debouncing (wait 500ms after user stops typing)
            searchTimeout = setTimeout(() => {
                performSearch();
            }, 500);
        });

        // Search on Enter key (immediate search without waiting)
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Clear timeout and search immediately
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                performSearch();
            }
        });
    }

    // Clear selection button
    if (clearSchoolBtn) {
        clearSchoolBtn.addEventListener('click', function() {
            // Clear hidden input
            schoolHiddenInput.value = '';

            // Hide selected card, show search container
            selectedSchoolCard.style.display = 'none';
            schoolSearchContainer.style.display = 'block';

            // Clear search input and results
            searchInput.value = '';
            searchResults.style.display = 'none';
            noResults.style.display = 'none';
        });
    }
});
