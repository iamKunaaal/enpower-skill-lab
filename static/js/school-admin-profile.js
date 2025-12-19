// School Admin Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form Edit Mode Toggle
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const profileForm = document.getElementById('profileForm');
    const formInputs = profileForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"]');
    const genderSelect = document.getElementById('gender');

    let isEditMode = false;
    let originalValues = {};

    // Save original values
    function saveOriginalValues() {
        formInputs.forEach(input => {
            originalValues[input.id] = input.value;
        });
        originalValues['gender'] = genderSelect.value;
    }

    // Restore original values
    function restoreOriginalValues() {
        formInputs.forEach(input => {
            input.value = originalValues[input.id] || '';
        });
        genderSelect.value = originalValues['gender'] || '';
    }

    saveOriginalValues();

    editBtn.addEventListener('click', function() {
        isEditMode = true;
        profileForm.classList.add('profile-edit-mode');

        // Enable all inputs except email (email should remain read-only for security)
        formInputs.forEach(input => {
            if (input.id !== 'email') {
                input.removeAttribute('readonly');
            }
        });
        genderSelect.removeAttribute('disabled');

        // Toggle buttons
        editBtn.style.display = 'none';
        saveBtn.style.display = 'flex';
        cancelBtn.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', function() {
        isEditMode = false;
        profileForm.classList.remove('profile-edit-mode');

        // Restore original values
        restoreOriginalValues();

        // Disable all inputs
        formInputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
            input.classList.remove('error');
        });
        genderSelect.setAttribute('disabled', 'disabled');

        // Clear all errors
        document.querySelectorAll('.profile-error-message').forEach(error => {
            error.style.display = 'none';
        });

        // Toggle buttons
        editBtn.style.display = 'flex';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    });

    // Form Validation
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            // Submit the form
            profileForm.submit();
        }
    });

    function validateForm() {
        let isValid = true;

        // Validate Full Name
        const fullName = document.getElementById('fullName');
        if (!fullName.value.trim()) {
            showError('fullName', 'Full name is required');
            isValid = false;
        } else if (fullName.value.trim().length < 2) {
            showError('fullName', 'Full name must be at least 2 characters');
            isValid = false;
        } else {
            clearError('fullName');
        }

        // Validate Email
        const email = document.getElementById('email');
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.value.trim()) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('email');
        }

        // Validate Phone
        const phone = document.getElementById('phone');
        const cleanPhone = phone.value.replace(/\D/g, '');
        if (!phone.value.trim()) {
            showError('phone', 'Phone number is required');
            isValid = false;
        } else if (cleanPhone.length !== 10) {
            showError('phone', 'Phone number must be 10 digits');
            isValid = false;
        } else {
            clearError('phone');
        }

        // Validate Alternate Phone (optional)
        const alternatePhone = document.getElementById('alternatePhone');
        if (alternatePhone.value.trim()) {
            const cleanAltPhone = alternatePhone.value.replace(/\D/g, '');
            if (cleanAltPhone.length !== 10) {
                showError('alternatePhone', 'Phone number must be 10 digits');
                isValid = false;
            } else {
                clearError('alternatePhone');
            }
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    // Photo Upload Preview
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');

    profilePhotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPG or PNG)');
                profilePhotoInput.value = '';
                return;
            }

            // Validate file size (2MB max)
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File size should not exceed 2MB. Your file is ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB');
                profilePhotoInput.value = '';
                return;
            }

            // Preview image
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePhotoPreview.innerHTML = '<img src="' + event.target.result + '" alt="Profile Photo">';
            };
            reader.readAsDataURL(file);
        }
    });

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    });

    // Set active menu item for profile
    const navProfile = document.getElementById('nav-my-profile');
    if (navProfile) {
        navProfile.classList.add('active');

        const accountDropdown = document.getElementById('account-dropdown');
        if (accountDropdown) {
            const dropdown = accountDropdown.closest('.sidebar-dropdown');
            if (dropdown) {
                dropdown.classList.add('active');
            }
        }
    }
});
