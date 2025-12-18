/**
 * Onboard Teacher Form JavaScript
 * Handles multi-step form navigation, validation, and auto-fill functionality
 */

// Multi-Step Form Navigation
let currentStep = 1;
const totalSteps = 8;
const formData = {};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    updateStepDisplay();
    initializeValidation();
    initializeFormatting();
    generateEmployeeID();
    initializeAgeCalculation();
    initializeAadharFormatting();
    initializePhotoUpload();
    initializeAutoFill();
});

// Generate Employee ID
function generateEmployeeID() {
    const year = new Date().getFullYear();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'EMP' + year;
    for (let i = 0; i < 6; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const employeeIdField = document.getElementById('employeeId');
    if (employeeIdField) {
        employeeIdField.value = id;
    }
    return id;
}

// Age auto-calculation from Date of Birth
function initializeAgeCalculation() {
    const dobInput = document.getElementById('dateOfBirth');
    const ageInput = document.getElementById('age');

    if (dobInput && ageInput) {
        dobInput.addEventListener('change', function () {
            const dob = new Date(this.value);
            const today = new Date();

            if (this.value && dob < today) {
                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                    age--;
                }

                ageInput.value = age + ' years';
            } else {
                ageInput.value = '';
            }
        });
    }
}

// Aadhar number formatting (XXXX XXXX XXXX)
function initializeAadharFormatting() {
    const aadharInput = document.getElementById('aadharNumber');

    if (aadharInput) {
        aadharInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 12) {
                value = value.slice(0, 12);
            }

            // Format as XXXX XXXX XXXX
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            e.target.value = formatted;
        });
    }
}

// Photo Upload Functionality
function initializePhotoUpload() {
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

                // Validate file size (2MB max)
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
}

// Navigation Functions
function updateStepDisplay() {
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        const stepContent = document.getElementById(`step${i}`);
        if (stepContent) {
            stepContent.style.display = 'none';
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

    if (backBtn) backBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Next Button Handler
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

// Back Button Handler
const backBtn = document.getElementById('backBtn');
if (backBtn) {
    backBtn.addEventListener('click', function () {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    });
}

// Step Click Handler (allow clicking on completed steps)
document.querySelectorAll('.step').forEach((step, index) => {
    step.addEventListener('click', function () {
        const stepNumber = index + 1;
        if (stepNumber < currentStep || stepNumber === currentStep) {
            currentStep = stepNumber;
            updateStepDisplay();
        }
    });
});

// Cancel Button Handler
const cancelBtn = document.getElementById('cancelBtn');
if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
            window.location.href = '/superadmin/teachers/';
        }
    });
}

// Validation Functions
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return true;

    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim() && input.type !== 'file') {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }
    });

    if (!isValid) {
        const firstError = currentStepElement.querySelector('.input-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    return isValid;
}

function saveCurrentStepData() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return;

    const inputs = currentStepElement.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.name && input.type !== 'file') {
            formData[input.name] = input.value;
        }
    });
}

// Error Display Functions
function showError(input, message) {
    clearError(input);
    input.classList.add('input-error');

    // Find or create error message element
    let errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(input) {
    input.classList.remove('input-error');
    input.classList.remove('input-success');

    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Initialize Validation
function initializeValidation() {
    const allInputs = document.querySelectorAll('input, select');

    allInputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function () {
            if (this.hasAttribute('required') && !this.value.trim() && this.type !== 'file') {
                showError(this, 'This field is required');
            } else {
                clearError(this);
            }
        });

        // Clear error on input
        input.addEventListener('input', function () {
            if (this.classList.contains('input-error')) {
                clearError(this);
            }
        });
    });
}

// Input Formatting
function initializeFormatting() {
    // Mobile number formatting
    const mobileInputs = document.querySelectorAll('input[type="tel"]');
    mobileInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    });

    // PIN code formatting
    const pincodeInput = document.getElementById('pinCode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 6) {
                value = value.slice(0, 6);
            }
            e.target.value = value;
        });
    }

    // PAN number formatting (uppercase)
    const panInput = document.getElementById('panNumber');
    if (panInput) {
        panInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.toUpperCase();
        });
    }

    // IFSC code formatting (uppercase)
    const ifscInput = document.getElementById('ifscCode');
    if (ifscInput) {
        ifscInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.toUpperCase();
        });
    }
}

// Auto-Fill with Dummy Data
function initializeAutoFill() {
    const autoFillBtn = document.getElementById('autoFillBtn');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', fillDummyData);
    }
}

function fillDummyData() {
    // Generate random data
    const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Deepak', 'Kavita', 'Rajesh', 'Neha'];
    const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Verma', 'Gupta', 'Joshi', 'Mehta', 'Reddy', 'Nair'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Gujarat'];

    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];

    // Generate random date of birth (25-50 years old)
    const today = new Date();
    const minAge = 25;
    const maxAge = 50;
    const randomAge = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const birthYear = today.getFullYear() - randomAge;
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const dob = `${birthYear}-${birthMonth}-${birthDay}`;

    // Generate random joining date (within last 5 years)
    const joiningYear = today.getFullYear() - Math.floor(Math.random() * 5);
    const joiningMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const joiningDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const joiningDate = `${joiningYear}-${joiningMonth}-${joiningDay}`;

    // Generate random phone number
    const phonePrefix = ['98', '97', '96', '95', '94', '93', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '71', '70'];
    const randomPhone = phonePrefix[Math.floor(Math.random() * phonePrefix.length)] + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

    // Generate random Aadhar
    const randomAadhar = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    const formattedAadhar = randomAadhar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');

    // Fill Step 1: Basic Information
    setFieldValue('fullName', `${randomFirst} ${randomLast}`);
    setFieldValue('gender', ['male', 'female'][Math.floor(Math.random() * 2)]);
    setFieldValue('dateOfBirth', dob);
    setFieldValue('bloodGroup', ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)]);
    setFieldValue('nationality', 'Indian');
    setFieldValue('aadharNumber', formattedAadhar);
    setFieldValue('panNumber', generateRandomPAN());

    // Trigger age calculation
    const dobInput = document.getElementById('dateOfBirth');
    if (dobInput) {
        dobInput.dispatchEvent(new Event('change'));
    }

    // Fill Step 2: Professional Details
    setFieldValue('designation', ['enpower-trainer', 'school-teacher', 'head-teacher'][Math.floor(Math.random() * 3)]);
    setFieldValue('qualification', ['M.A., B.Ed.', 'M.Sc., B.Ed.', 'Ph.D., M.Ed.', 'B.A., B.Ed.'][Math.floor(Math.random() * 4)]);
    setFieldValue('specialization', ['Mathematics', 'Science', 'English', 'Social Studies'][Math.floor(Math.random() * 4)]);
    setFieldValue('totalExperience', `${Math.floor(Math.random() * 15) + 2} years`);
    setFieldValue('skillTrainingExperience', `${Math.floor(Math.random() * 5) + 1} years`);
    setFieldValue('previousOrganizations', 'ABC School, XYZ Academy');
    setFieldValue('certifications', 'TET, CTET, B.Ed.');
    setFieldValue('languagesKnown', 'English, Hindi, Marathi');
    setFieldValue('gradesTaught', '5th to 10th');
    setFieldValue('trainingStyle', ['interactive', 'conceptual', 'activity-based', 'mixed'][Math.floor(Math.random() * 4)]);

    // Fill Step 3: Contact Information
    setFieldValue('mobileNumber', randomPhone);
    setFieldValue('alternateNumber', phonePrefix[Math.floor(Math.random() * phonePrefix.length)] + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'));
    setFieldValue('officialEmail', `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}@enpowerskilllab.com`);
    setFieldValue('personalEmail', `${randomFirst.toLowerCase()}${Math.floor(Math.random() * 100)}@gmail.com`);

    // Fill Step 4: Address Details
    setFieldValue('currentAddress', `${Math.floor(Math.random() * 500) + 1}, Sample Street, ${randomCity}`);
    setFieldValue('permanentAddress', `${Math.floor(Math.random() * 500) + 1}, Home Street, ${randomCity}`);
    setFieldValue('city', randomCity);
    setFieldValue('state', randomState);
    setFieldValue('pinCode', String(Math.floor(Math.random() * 900000) + 100000));

    // Fill Step 5: Skill Lab Work Details
    setFieldValue('skillLabCenter', 'ENpower Skill Lab - Main Center');
    setFieldValue('branchLocation', randomCity);
    setFieldValue('batchTimings', '9:00 AM - 3:00 PM');
    setFieldValue('weeklyTimetable', 'Mon-Fri, 9 AM - 3 PM');
    setFieldValue('studentGroups', 'Group A, Group B');
    setFieldValue('modulesAssigned', 'Critical Thinking, Communication, Problem Solving');
    setFieldValue('activeClasses', '5A, 6B, 7C, 8A');
    setFieldValue('totalStudents', String(Math.floor(Math.random() * 100) + 20));
    setFieldValue('dashboardRole', ['coach', 'senior-coach', 'coordinator'][Math.floor(Math.random() * 3)]);
    setFieldValue('joiningDate', joiningDate);
    setFieldValue('employmentType', ['full-time', 'part-time', 'contract'][Math.floor(Math.random() * 3)]);

    // Fill Step 6: Emergency Information
    setFieldValue('emergencyContactName', `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`);
    setFieldValue('emergencyRelation', ['spouse', 'parent', 'sibling'][Math.floor(Math.random() * 3)]);
    setFieldValue('emergencyMobile', phonePrefix[Math.floor(Math.random() * phonePrefix.length)] + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'));
    setFieldValue('emergencySecondary', phonePrefix[Math.floor(Math.random() * phonePrefix.length)] + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'));
    setFieldValue('healthNotes', 'No known health issues');

    // Fill Step 7: Compliance & Documentation
    setFieldValue('idProofSubmitted', 'both');
    setFieldValue('addressProofSubmitted', 'yes');
    setFieldValue('policeVerification', 'verified');
    setFieldValue('contractUploaded', 'yes');
    setFieldValue('panAadharLinked', 'yes');
    setFieldValue('bankDetailsSubmitted', 'yes');
    setFieldValue('ifscCode', 'SBIN0001234');
    setFieldValue('bankAccountNumber', String(Math.floor(Math.random() * 9000000000) + 1000000000));
    setFieldValue('bankName', ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'][Math.floor(Math.random() * 4)]);
    setFieldValue('branchName', `${randomCity} Main Branch`);

    // Fill Step 8: Additional Optional Data
    setFieldValue('hobbies', 'Reading, Music, Sports');
    setFieldValue('strengthAreas', 'Communication, Problem Solving, Leadership');
    setFieldValue('improvementAreas', 'Time Management');
    setFieldValue('trainingResources', 'Videos, Books, Workshops');
    setFieldValue('achievements', 'Best Teacher Award 2022, Excellence in Teaching Certificate');

    alert('Dummy data filled successfully! You can now navigate through steps and submit.');
}

function setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = value;
        // Trigger change event for select elements
        if (field.tagName === 'SELECT') {
            field.dispatchEvent(new Event('change'));
        }
    }
}

function generateRandomPAN() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let pan = '';
    for (let i = 0; i < 5; i++) {
        pan += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
        pan += Math.floor(Math.random() * 10);
    }
    pan += letters.charAt(Math.floor(Math.random() * letters.length));
    return pan;
}

// Keyboard Navigation
document.addEventListener('keydown', function (e) {
    // Alt + Right Arrow - Next
    if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentStep < totalSteps) {
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.click();
        }
    }

    // Alt + Left Arrow - Back
    if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentStep > 1) {
            const backBtn = document.getElementById('backBtn');
            if (backBtn) backBtn.click();
        }
    }
});
