// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const icon = this.querySelector('.material-symbols-outlined');

        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility_off';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility';
        }
    });
});

// Password strength checker
const newPasswordInput = document.getElementById('newPassword');
const passwordStrength = document.getElementById('passwordStrength');
const passwordRequirements = document.getElementById('passwordRequirements');
const strengthBarFill = document.getElementById('strengthBarFill');
const strengthText = document.getElementById('strengthText');

const requirements = {
    length: { regex: /.{8,}/, element: document.getElementById('req-length') },
    uppercase: { regex: /[A-Z]/, element: document.getElementById('req-uppercase') },
    lowercase: { regex: /[a-z]/, element: document.getElementById('req-lowercase') },
    number: { regex: /[0-9]/, element: document.getElementById('req-number') },
    special: { regex: /[!@#$%^&*(),.?":{}|<>]/, element: document.getElementById('req-special') }
};

if (newPasswordInput) {
    newPasswordInput.addEventListener('focus', function () {
        if (passwordRequirements) {
            passwordRequirements.classList.add('visible');
        }
    });

    newPasswordInput.addEventListener('input', function () {
        const password = this.value;

        if (password.length === 0) {
            if (passwordStrength) passwordStrength.classList.remove('visible');
            if (passwordRequirements) passwordRequirements.classList.remove('visible');
            return;
        }

        if (passwordStrength) passwordStrength.classList.add('visible');
        if (passwordRequirements) passwordRequirements.classList.add('visible');

        let metCount = 0;

        // Check each requirement
        Object.keys(requirements).forEach(key => {
            const req = requirements[key];
            if (req.element) {
                const met = req.regex.test(password);

                if (met) {
                    req.element.classList.add('met');
                    const icon = req.element.querySelector('.material-symbols-outlined');
                    if (icon) icon.textContent = 'check_circle';
                    metCount++;
                } else {
                    req.element.classList.remove('met');
                    const icon = req.element.querySelector('.material-symbols-outlined');
                    if (icon) icon.textContent = 'cancel';
                }
            }
        });

        // Update strength indicator
        if (strengthBarFill && strengthText) {
            strengthBarFill.className = 'strength-bar-fill';
            strengthText.className = 'strength-text';

            if (metCount <= 2) {
                strengthBarFill.classList.add('weak');
                strengthText.classList.add('weak');
                strengthText.textContent = 'Weak password';
            } else if (metCount <= 4) {
                strengthBarFill.classList.add('medium');
                strengthText.classList.add('medium');
                strengthText.textContent = 'Medium strength';
            } else {
                strengthBarFill.classList.add('strong');
                strengthText.classList.add('strong');
                strengthText.textContent = 'Strong password';
            }
        }
    });
}

// Form validation and submission
const form = document.getElementById('changePasswordForm');
const currentPasswordInput = document.getElementById('currentPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    if (field && errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
}

// Clear errors on input
if (currentPasswordInput) {
    currentPasswordInput.addEventListener('input', function () {
        clearError(this.id);
    });
}

if (newPasswordInput) {
    newPasswordInput.addEventListener('input', function () {
        clearError(this.id);
    });
}

if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', function () {
        clearError(this.id);
    });
}

// Form submission with client-side validation
if (form) {
    form.addEventListener('submit', function (e) {
        // Clear all errors
        clearError('currentPassword');
        clearError('newPassword');
        clearError('confirmPassword');

        const currentPassword = currentPasswordInput ? currentPasswordInput.value : '';
        const newPassword = newPasswordInput ? newPasswordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

        let isValid = true;

        // Validate current password
        if (!currentPassword) {
            showError('currentPassword', 'Current password is required');
            isValid = false;
            e.preventDefault();
        }

        // Validate new password
        if (!newPassword) {
            showError('newPassword', 'New password is required');
            isValid = false;
            e.preventDefault();
        } else {
            // Check all requirements
            let allRequirementsMet = true;
            Object.keys(requirements).forEach(key => {
                if (!requirements[key].regex.test(newPassword)) {
                    allRequirementsMet = false;
                }
            });

            if (!allRequirementsMet) {
                showError('newPassword', 'Password does not meet all requirements');
                isValid = false;
                e.preventDefault();
            }

            // Check if new password is same as current
            if (newPassword === currentPassword) {
                showError('newPassword', 'New password must be different from current password');
                isValid = false;
                e.preventDefault();
            }
        }

        // Validate confirm password
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your new password');
            isValid = false;
            e.preventDefault();
        } else if (newPassword !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
            e.preventDefault();
        }

        // If all validations pass, form will submit normally to Django backend
        if (isValid) {
            // Optionally show loading state
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span>Changing Password...';
            }
        }
    });
}

// Cancel button
const cancelBtn = document.getElementById('cancelBtn');
if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.location.href = document.referrer || '/coordinator/profile/';
        }
    });
}

// Auto-hide success message after 5 seconds
const successMessage = document.getElementById('successMessage');
if (successMessage && successMessage.classList.contains('visible')) {
    setTimeout(() => {
        successMessage.classList.remove('visible');
    }, 5000);
}
