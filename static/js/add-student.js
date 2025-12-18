// Onboard Student JavaScript - Multi-step form with validation

// Helper functions for generating dummy data
function generateRandomFirstName() {
    const names = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan', 'Krishna', 'Ishaan',
                   'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Anika', 'Navya', 'Pari', 'Ira', 'Myra'];
    return names[Math.floor(Math.random() * names.length)];
}

function generateRandomLastName() {
    const names = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Reddy', 'Joshi', 'Iyer', 'Nair',
                   'Mehta', 'Shah', 'Desai', 'Rao', 'Kulkarni', 'Agarwal', 'Pandey', 'Mishra', 'Das', 'Roy'];
    return names[Math.floor(Math.random() * names.length)];
}

function generateRandomPhone() {
    const prefixes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(10000000 + Math.random() * 90000000);
    return prefix + number.toString();
}

function generateRandomEmail(name) {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'school.edu'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 999) + '@' + domain;
}

function generateRandomDate(startYear, endYear) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

function generateRandomAadhar() {
    let aadhar = '';
    for (let i = 0; i < 12; i++) {
        aadhar += Math.floor(Math.random() * 10);
        if ((i + 1) % 4 === 0 && i < 11) aadhar += ' ';
    }
    return aadhar;
}

function generateRandomAddress() {
    const streets = ['MG Road', 'Park Street', 'Main Street', 'Station Road', 'Church Road', 'Gandhi Road'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad'];
    const houseNo = Math.floor(1 + Math.random() * 999);
    const street = streets[Math.floor(Math.random() * streets.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    return `${houseNo} ${street}, ${city} - 400001`;
}

// Auto-fill form with dummy data
function autoFillForm() {
    const firstName = generateRandomFirstName();
    const lastName = generateRandomLastName();
    const fullName = firstName + ' ' + lastName;

    // Step 1: Basic Information
    document.getElementById('firstName').value = firstName;
    document.getElementById('middleName').value = ['Kumar', 'Singh', 'Raj', 'Dev', ''][Math.floor(Math.random() * 5)];
    document.getElementById('lastName').value = lastName;
    document.getElementById('gender').value = ['male', 'female', 'other'][Math.floor(Math.random() * 3)];
    document.getElementById('dateOfBirth').value = generateRandomDate(2005, 2015);

    // Trigger age calculation
    const dobEvent = new Event('change');
    document.getElementById('dateOfBirth').dispatchEvent(dobEvent);

    document.getElementById('nationality').value = 'Indian';
    document.getElementById('motherTongue').value = ['Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali'][Math.floor(Math.random() * 5)];
    document.getElementById('bloodGroup').value = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)];
    document.getElementById('aadharNumber').value = generateRandomAadhar();

    // Step 2: Academic Details
    const schoolSelect = document.getElementById('schoolName');
    if (schoolSelect && schoolSelect.options.length > 1) {
        schoolSelect.selectedIndex = Math.floor(1 + Math.random() * (schoolSelect.options.length - 1));
    }
    document.getElementById('schoolBranch').value = ['Main Campus', 'North Branch', 'South Branch', ''][Math.floor(Math.random() * 4)];
    document.getElementById('class').value = Math.floor(1 + Math.random() * 12).toString();
    document.getElementById('division').value = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    document.getElementById('rollNumber').value = Math.floor(1 + Math.random() * 50).toString();
    document.getElementById('academicYear').value = ['2024-2025', '2025-2026'][Math.floor(Math.random() * 2)];
    document.getElementById('grNumber').value = 'GR' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('previousSchool').value = ['ABC School', 'XYZ Academy', 'PQR Public School', ''][Math.floor(Math.random() * 4)];
    document.getElementById('stream').value = ['science', 'commerce', 'arts', 'na'][Math.floor(Math.random() * 4)];
    document.getElementById('schoolBoard').value = ['CBSE', 'ICSE', 'SSC', 'IB'][Math.floor(Math.random() * 4)];

    // Step 3: Contact Details
    document.getElementById('studentMobile').value = generateRandomPhone();
    document.getElementById('schoolEmail').value = generateRandomEmail(fullName);
    document.getElementById('personalEmail').value = fullName.toLowerCase().replace(/\s/g, '.') + '@gmail.com';
    
    // Handle address field - temporarily remove readonly if needed
    const addressField = document.getElementById('address');
    if (addressField) {
        const wasReadonly = addressField.hasAttribute('readonly');
        if (wasReadonly) addressField.removeAttribute('readonly');
        addressField.value = generateRandomAddress();
        if (wasReadonly) addressField.setAttribute('readonly', 'readonly');
    }

    // Step 4: Skill Lab Specific Details
    document.getElementById('enrollmentDate').value = generateRandomDate(2024, 2025);
    document.getElementById('skillsEnrolled').value = ['Critical Thinking', 'Problem Solving', 'Communication'][Math.floor(Math.random() * 3)];
    document.getElementById('currentSkillLevel').value = ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)];
    
    // Handle assignedTrainer - check if it's a select or input
    const trainerField = document.getElementById('assignedTrainer');
    if (trainerField) {
        if (trainerField.tagName === 'SELECT') {
            const options = trainerField.options;
            if (options.length > 1) {
                trainerField.selectedIndex = Math.floor(1 + Math.random() * (options.length - 1));
            }
        } else {
            trainerField.value = generateRandomFirstName() + ' ' + generateRandomLastName();
        }
    }
    
    document.getElementById('batchTiming').value = ['Mon-Wed 10:00 AM - 12:00 PM', 'Tue-Thu 2:00 PM - 4:00 PM'][Math.floor(Math.random() * 2)];
    document.getElementById('learningStyle').value = ['visual', 'auditory', 'kinesthetic', 'mixed'][Math.floor(Math.random() * 4)];
    document.getElementById('interestsAptitude').value = ['Mathematics', 'Science', 'Arts', 'Sports'][Math.floor(Math.random() * 4)];
    document.getElementById('preferredLanguage').value = ['english', 'hindi', 'marathi'][Math.floor(Math.random() * 3)];
    document.getElementById('attendanceStatus').value = 'active';

    // Step 5: Health & Safety
    document.getElementById('medicalConditions').value = ['None', 'Asthma', 'Diabetes', ''][Math.floor(Math.random() * 4)];
    document.getElementById('allergies').value = ['None', 'Peanut Allergy', 'Dust Allergy', ''][Math.floor(Math.random() * 4)];
    document.getElementById('emergencyInstructions').value = 'Call parents immediately in case of emergency';
    document.getElementById('doctorName').value = 'Dr. ' + generateRandomFirstName() + ' ' + generateRandomLastName();
    document.getElementById('doctorContact').value = generateRandomPhone();
    document.getElementById('physicalLimitations').value = ['None', 'Cannot run long distances', ''][Math.floor(Math.random() * 3)];

    // Step 6: Emergency Contact
    document.getElementById('emergencyName').value = generateRandomFirstName() + ' ' + lastName;
    document.getElementById('emergencyRelationship').value = ['father', 'mother', 'guardian'][Math.floor(Math.random() * 3)];
    document.getElementById('emergencyMobile').value = generateRandomPhone();
    document.getElementById('emergencyAltMobile').value = generateRandomPhone();
    document.getElementById('emergencyAddress').value = generateRandomAddress();

    // Step 7: Family Details
    if (Math.random() > 0.5) {
        document.getElementById('sibling1Name').value = generateRandomFirstName() + ' ' + lastName;
        document.getElementById('sibling1ClassSchool').value = 'Class ' + Math.floor(1 + Math.random() * 12) + ', ABC School';
        document.getElementById('sibling1SkillLabId').value = Math.random() > 0.5 ? 'SKILL2024' + Math.floor(100000 + Math.random() * 900000) : '';
    }

    if (Math.random() > 0.7) {
        document.getElementById('sibling2Name').value = generateRandomFirstName() + ' ' + lastName;
        document.getElementById('sibling2ClassSchool').value = 'Class ' + Math.floor(1 + Math.random() * 12) + ', XYZ School';
        document.getElementById('sibling2SkillLabId').value = '';
    }

    alert('✅ Form auto-filled with random dummy data!');
}

document.addEventListener('DOMContentLoaded', function() {
    // State management
    let currentStep = 1;
    const totalSteps = 7;

    // Get all elements
    const form = document.getElementById('addStudentForm');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const stepContents = document.querySelectorAll('.step-content');
    const stepIndicators = document.querySelectorAll('.step');

    // Photo upload functionality
    const photoInput = document.getElementById('studentPhoto');
    const photoPreview = document.getElementById('photoPreview');
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');

    if (uploadPhotoBtn && photoInput) {
        uploadPhotoBtn.addEventListener('click', function() {
            photoInput.click();
        });

        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!validTypes.includes(file.type)) {
                    alert('Please upload a valid image file (JPG or PNG)');
                    photoInput.value = '';
                    return;
                }

                // Validate file size (2MB max)
                const maxSize = 2 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert('File size should not exceed 2MB. Your file is ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB');
                    photoInput.value = '';
                    return;
                }

                // Preview image
                const reader = new FileReader();
                reader.onload = function(event) {
                    photoPreview.innerHTML = '<img src="' + event.target.result + '" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="Student Photo">';
                };
                reader.readAsDataURL(file);
            }
        });

        // Also allow clicking on preview to upload
        photoPreview.addEventListener('click', function() {
            photoInput.click();
        });
    }

    // Age calculation from Date of Birth
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    const ageInput = document.getElementById('age');

    if (dateOfBirthInput && ageInput) {
        dateOfBirthInput.addEventListener('change', function() {
            const dob = new Date(this.value);
            const today = new Date();

            if (dob > today) {
                showError('dateOfBirth', 'Date of birth cannot be in the future');
                ageInput.value = '';
                return;
            }

            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            ageInput.value = age + ' years';
            clearError('dateOfBirth');
        });
    }

    // Aadhar number formatting (XXXX XXXX XXXX)
    const aadharInput = document.getElementById('aadharNumber');
    if (aadharInput) {
        aadharInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');

            if (value.length > 12) {
                value = value.slice(0, 12);
            }

            // Add spaces after every 4 digits
            const formatted = value.match(/.{1,4}/g);
            e.target.value = formatted ? formatted.join(' ') : '';
        });

        aadharInput.addEventListener('blur', function() {
            const value = this.value.replace(/\s/g, '');
            if (value.length > 0 && value.length !== 12) {
                showError('aadharNumber', 'Aadhar number must be 12 digits');
            } else {
                clearError('aadharNumber');
            }
        });
    }

    // Phone number formatting (10 digits only)
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });

        input.addEventListener('blur', function() {
            if (this.value && this.value.length !== 10) {
                showError(this.id, 'Phone number must be 10 digits');
            } else {
                clearError(this.id);
            }
        });
    });

    // Email validation
    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    // Validation functions
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        if (field) {
            field.classList.add('error');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        if (field) {
            field.classList.remove('error');
        }
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Validate current step
    function validateStep(step) {
        let isValid = true;

        // Clear all errors first
        const currentStepElement = document.getElementById('step' + step);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');

        inputs.forEach(input => {
            clearError(input.id);

            // Check if field is empty
            if (!input.value.trim()) {
                showError(input.id, 'This field is required');
                isValid = false;
                return;
            }

            // Email validation
            if (input.type === 'email' && !isValidEmail(input.value)) {
                showError(input.id, 'Please enter a valid email address');
                isValid = false;
                return;
            }

            // Phone validation
            if (input.type === 'tel' && input.value && input.value.length !== 10) {
                showError(input.id, 'Phone number must be 10 digits');
                isValid = false;
                return;
            }
        });

        // Step-specific validations
        if (step === 1) {
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');

            if (firstName && firstName.value.trim().length < 2) {
                showError('firstName', 'First name must be at least 2 characters');
                isValid = false;
            }

            if (lastName && lastName.value.trim().length < 2) {
                showError('lastName', 'Last name must be at least 2 characters');
                isValid = false;
            }
        }

        if (step === 3) {
            const schoolEmail = document.getElementById('schoolEmail');
            const personalEmail = document.getElementById('personalEmail');

            if (schoolEmail && !isValidEmail(schoolEmail.value)) {
                showError('schoolEmail', 'Please enter a valid school email');
                isValid = false;
            }

            if (personalEmail && personalEmail.value && !isValidEmail(personalEmail.value)) {
                showError('personalEmail', 'Please enter a valid personal email');
                isValid = false;
            }
        }

        return isValid;
    }

    // Update step UI
    function updateStepUI() {
        // Hide all step contents
        stepContents.forEach(content => {
            content.style.display = 'none';
        });

        // Show current step
        const currentStepElement = document.getElementById('step' + currentStep);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }

        // Update step indicators
        stepIndicators.forEach((indicator, index) => {
            const stepNumber = index + 1;

            indicator.classList.remove('active', 'completed');

            if (stepNumber === currentStep) {
                indicator.classList.add('active');
            } else if (stepNumber < currentStep) {
                indicator.classList.add('completed');
            }
        });

        // Update buttons
        if (currentStep === 1) {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'flex';
        }

        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Next button handler
    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepUI();
            }
        }
    });

    // Back button handler
    backBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateStepUI();
        }
    });

    // Step indicator click handler (allow navigation to completed steps)
    stepIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            const targetStep = index + 1;

            // Allow navigation to any previous step or current step
            if (targetStep <= currentStep) {
                currentStep = targetStep;
                updateStepUI();
            } else {
                // Validate all steps up to target step
                let canNavigate = true;
                for (let i = currentStep; i < targetStep; i++) {
                    if (!validateStep(i)) {
                        canNavigate = false;
                        break;
                    }
                }

                if (canNavigate) {
                    currentStep = targetStep;
                    updateStepUI();
                }
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all steps
        let allValid = true;
        for (let i = 1; i <= totalSteps; i++) {
            if (!validateStep(i)) {
                allValid = false;
                // Navigate to first invalid step
                currentStep = i;
                updateStepUI();
                alert('Please fill in all required fields correctly in Step ' + i);
                return;
            }
        }

        if (allValid) {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Submitting...';

            // Submit the form
            form.submit();
        }
    });

    // Cancel button handler
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
            window.location.href = '/super-admin/dashboard/';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Alt + Right Arrow = Next
        if (e.altKey && e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentStep < totalSteps) {
                nextBtn.click();
            }
        }

        // Alt + Left Arrow = Back
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentStep > 1) {
                backBtn.click();
            }
        }

        // Ctrl + Enter = Submit (on last step)
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (currentStep === totalSteps) {
                submitBtn.click();
            }
        }
    });

    // Auto-save to localStorage (optional - can be enabled if needed)
    /*
    function saveFormData() {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'student_photo') { // Don't save file input
                data[key] = value;
            }
        }
        localStorage.setItem('studentOnboardingData', JSON.stringify(data));
    }

    function loadFormData() {
        const savedData = localStorage.getItem('studentOnboardingData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.elements[key];
                if (input && input.type !== 'file') {
                    input.value = data[key];
                }
            });
        }
    }

    // Auto-save every 30 seconds
    setInterval(saveFormData, 30000);

    // Load saved data on page load
    loadFormData();
    */

    // Auto-fill with dummy data functionality
    const autoFillBtn = document.getElementById('autoFillBtn');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', function() {
            autoFillForm();
        });
    }

    // Initialize UI
    updateStepUI();

    // Set active menu item for sidebar
    const navStudents = document.getElementById('nav-students');
    if (navStudents) {
        navStudents.classList.add('active');
    }
});
