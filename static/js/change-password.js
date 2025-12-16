// Change Password Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeChangePassword();
});

function initializeChangePassword() {
    // Password visibility toggle
    document.querySelectorAll('.cp-toggle-password').forEach(button => {
        button.addEventListener('click', function() {
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
        newPasswordInput.addEventListener('focus', function() {
            if (passwordRequirements) {
                passwordRequirements.classList.add('visible');
            }
        });

        newPasswordInput.addEventListener('input', function() {
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
                        req.element.querySelector('.material-symbols-outlined').textContent = 'check_circle';
                        metCount++;
                    } else {
                        req.element.classList.remove('met');
                        req.element.querySelector('.material-symbols-outlined').textContent = 'cancel';
                    }
                }
            });

            // Update strength indicator
            if (strengthBarFill && strengthText) {
                strengthBarFill.className = 'cp-strength-fill';
                strengthText.className = 'cp-strength-text';

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

    // Form validation
    const form = document.getElementById('changePasswordForm');
    const currentPasswordInput = document.getElementById('currentPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        if (field) field.classList.add('cp-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        if (field) field.classList.remove('cp-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
    }

    // Clear errors on input
    [currentPasswordInput, newPasswordInput, confirmPasswordInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                clearError(this.id);
            });
        }
    });

    // Form submission validation
    if (form) {
        form.addEventListener('submit', function(e) {
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
            }

            // Validate new password
            if (!newPassword) {
                showError('newPassword', 'New password is required');
                isValid = false;
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
                }

                // Check if new password is same as current
                if (newPassword === currentPassword) {
                    showError('newPassword', 'New password must be different from current password');
                    isValid = false;
                }
            }

            // Validate confirm password
            if (!confirmPassword) {
                showError('confirmPassword', 'Please confirm your new password');
                isValid = false;
            } else if (newPassword !== confirmPassword) {
                showError('confirmPassword', 'Passwords do not match');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }
}
