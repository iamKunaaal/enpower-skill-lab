// School Onboarding Form JavaScript

let currentStep = 1;
const totalSteps = 9;
const formData = {};

// Comprehensive validators object
const validators = {
    // Step 1: School Basic Information
    schoolName: {
        validate: (value) => {
            if (!value.trim()) return 'School name is required';
            if (value.trim().length < 3) return 'School name must be at least 3 characters';
            if (value.trim().length > 200) return 'School name cannot exceed 200 characters';
            return '';
        }
    },
    schoolCode: {
        validate: (value) => {
            if (!value.trim()) return 'School code / UDISE code is required';
            if (value.trim().length < 3) return 'School code must be at least 3 characters';
            return '';
        }
    },
    board: {
        validate: (value) => {
            if (!value) return 'School board is required';
            return '';
        }
    },
    schoolType: {
        validate: (value) => {
            if (!value) return 'Type of school is required';
            return '';
        }
    },
    medium: {
        validate: (value) => {
            if (!value) return 'Medium of instruction is required';
            return '';
        }
    },
    schoolEmail: {
        validate: (value) => {
            if (!value.trim()) return 'School email is required';
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        }
    },
    schoolPhone: {
        validate: (value) => {
            if (!value.trim()) return 'School contact number is required';
            const cleanPhone = value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) return 'Phone number must be 10 digits';
            return '';
        }
    },
    principalName: {
        validate: (value) => {
            if (!value.trim()) return 'Principal name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return '';
        }
    },
    principalPhone: {
        validate: (value) => {
            if (!value.trim()) return 'Principal contact number is required';
            const cleanPhone = value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) return 'Phone number must be 10 digits';
            return '';
        }
    },
    principalEmail: {
        validate: (value) => {
            if (!value.trim()) return 'Principal email is required';
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        }
    },
    // Step 2: Branch Details
    branchAddress: {
        validate: (value) => {
            if (!value.trim()) return 'Branch address is required';
            if (value.trim().length < 10) return 'Please provide a complete address';
            return '';
        }
    },
    city: {
        validate: (value) => {
            if (!value.trim()) return 'City is required';
            if (!/^[a-zA-Z\s.-]+$/.test(value)) return 'City name can only contain letters';
            return '';
        }
    },
    state: {
        validate: (value) => {
            if (!value.trim()) return 'State is required';
            if (!/^[a-zA-Z\s.-]+$/.test(value)) return 'State name can only contain letters';
            return '';
        }
    },
    pincode: {
        validate: (value) => {
            if (!value.trim()) return 'Pincode is required';
            if (!/^\d{6}$/.test(value)) return 'Pincode must be exactly 6 digits';
            return '';
        }
    },
    // Step 6: Administrative Information
    billingEmail: {
        validate: (value) => {
            if (!value.trim()) return 'Billing email is required';
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        }
    },
    gstNumber: {
        validate: (value) => {
            if (!value || value.trim() === '') return '';
            if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value.toUpperCase())) {
                return 'Please enter a valid GST number';
            }
            return '';
        }
    },
    // Step 8: Emergency Information
    emergencyContactPerson: {
        validate: (value) => {
            if (!value.trim()) return 'Emergency contact person is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return '';
        }
    },
    emergencyPhone: {
        validate: (value) => {
            if (!value.trim()) return 'Emergency phone number is required';
            const cleanPhone = value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) return 'Phone number must be 10 digits';
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

// Random data generators
function generateRandomSchoolName() {
    const prefixes = ['St.', 'Holy', 'Sacred', 'Modern', 'Delhi', 'Mumbai', 'Bangalore', 'National', 'International', 'Global'];
    const middles = ['Public', 'High', 'Senior Secondary', 'International', 'Model', 'Convent'];
    const suffixes = ['School', 'Academy', 'Institute', 'Educational Center'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${middles[Math.floor(Math.random() * middles.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

function generateRandomCode() {
    return 'SCH-' + Math.floor(100000 + Math.random() * 900000);
}

function generateRandomEmail(schoolName) {
    const domain = schoolName.toLowerCase().replace(/[^a-z]/g, '');
    return `info@${domain.substring(0, 10)}.edu.in`;
}

function generateRandomPhone() {
    return '9' + Math.floor(100000000 + Math.random() * 900000000);
}

function generateRandomName() {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Anjali', 'Suresh', 'Kavita', 'Ramesh', 'Deepa'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Nair', 'Gupta', 'Verma', 'Rao', 'Desai'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
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

function autoFillForm() {
    const schoolName = generateRandomSchoolName();
    
    // Step 1: Basic Information
    document.getElementById('schoolName').value = schoolName;
    document.getElementById('schoolCode').value = generateRandomCode();
    document.getElementById('board').value = ['cbse', 'icse', 'ib', 'state'][Math.floor(Math.random() * 4)];
    document.getElementById('schoolType').value = ['private', 'government', 'trust', 'aided'][Math.floor(Math.random() * 4)];
    document.getElementById('medium').value = ['english', 'hindi', 'marathi', 'bilingual'][Math.floor(Math.random() * 4)];
    document.getElementById('yearEstablished').value = Math.floor(1980 + Math.random() * 40);
    document.getElementById('schoolEmail').value = generateRandomEmail(schoolName);
    document.getElementById('schoolPhone').value = generateRandomPhone();
    document.getElementById('website').value = `https://www.${schoolName.toLowerCase().replace(/[^a-z]/g, '')}.edu.in`;
    document.getElementById('principalName').value = generateRandomName();
    document.getElementById('principalPhone').value = generateRandomPhone();
    document.getElementById('principalEmail').value = 'principal@' + generateRandomEmail(schoolName).split('@')[1];
    
    // Step 2: Branch Details
    const city = generateRandomCity();
    const state = generateRandomState();
    document.getElementById('branchName').value = 'Main Campus';
    document.getElementById('branchCode').value = 'BR-001';
    document.getElementById('branchAddress').value = `${Math.floor(1 + Math.random() * 999)} Education Street, ${city}`;
    document.getElementById('city').value = city;
    document.getElementById('state').value = state;
    document.getElementById('pincode').value = generateRandomPincode();
    document.getElementById('numStudents').value = Math.floor(200 + Math.random() * 800);
    document.getElementById('numTeachers').value = Math.floor(20 + Math.random() * 80);
    document.getElementById('numTrainers').value = Math.floor(2 + Math.random() * 10);
    document.getElementById('gradesAvailable').value = 'Pre-K to 12';
    document.getElementById('shiftDetails').value = ['morning', 'afternoon', 'both'][Math.floor(Math.random() * 3)];
    document.getElementById('branchCoordinatorName').value = generateRandomName();
    document.getElementById('branchCoordinatorPhone').value = generateRandomPhone();
    
    // Step 3: Infrastructure
    document.getElementById('cslAvailability').value = ['yes', 'no'][Math.floor(Math.random() * 2)];
    document.getElementById('cslRoomsCount').value = Math.floor(1 + Math.random() * 5);
    document.getElementById('equipmentInventory').value = 'Computers, Projectors, Lab Equipment, Sports Equipment';
    document.getElementById('computerLabDetails').value = `${Math.floor(20 + Math.random() * 50)} computers with latest software`;
    document.getElementById('internetDetails').value = `${Math.floor(50 + Math.random() * 150)} Mbps Fiber`;
    document.getElementById('classroomCount').value = Math.floor(15 + Math.random() * 35);
    document.getElementById('sportsFacilities').value = 'Basketball Court, Football Field, Cricket Ground, Indoor Games';
    document.getElementById('safetyMeasures').value = 'Security Guards, ID Cards, Visitor Logs, Emergency Exits';
    document.getElementById('cctvCoverage').value = ['yes', 'no', 'partial'][Math.floor(Math.random() * 3)];
    document.getElementById('fireSafetyStatus').value = ['compliant', 'non-compliant', 'pending'][Math.floor(Math.random() * 3)];
    document.getElementById('firstAidAvailability').value = ['yes', 'no'][Math.floor(Math.random() * 2)];
    
    // Step 4: Academic
    document.getElementById('totalStudents').value = Math.floor(300 + Math.random() * 700);
    document.getElementById('studentTeacherRatio').value = '30:1';
    document.getElementById('classWiseStrength').value = 'Class 1: 60, Class 2: 55, Class 3: 58, Class 4: 62';
    document.getElementById('curriculumFollowed').value = 'NCERT, State Board';
    document.getElementById('clubDetails').value = 'Science Club, Arts Club, Music Club, Drama Club, Robotics Club';
    document.getElementById('skillSubjects').value = 'Computer Science, AI/ML, Robotics, Digital Marketing';
    document.getElementById('remedialPrograms').value = 'After-school tutoring, Weekend classes, Online support';
    
    // Step 5: Skill Lab
    document.getElementById('skillLabRegId').value = 'SL-' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('labUsageHours').value = Math.floor(10 + Math.random() * 30);
    document.getElementById('skillsOffered').value = 'Coding, Robotics, AI, 3D Printing, Electronics';
    document.getElementById('batchTimings').value = '9AM-11AM, 2PM-4PM';
    document.getElementById('cslIntegrationStatus').value = ['integrated', 'pending', 'not-applicable'][Math.floor(Math.random() * 3)];
    document.getElementById('trainersAssigned').value = generateRandomName() + ', ' + generateRandomName();
    document.getElementById('studentGroupsLinked').value = 'Grade 9-10, Grade 11-12';
    document.getElementById('cslProjectList').value = 'Smart City, Green Energy, Water Conservation';
    document.getElementById('assessmentSystemLinked').value = ['yes', 'no'][Math.floor(Math.random() * 2)];
    
    // Step 6: Administrative
    document.getElementById('billingEmail').value = 'billing@' + generateRandomEmail(schoolName).split('@')[1];
    document.getElementById('gstNumber').value = '22AAAAA' + Math.floor(1000 + Math.random() * 9000) + 'A1Z5';
    document.getElementById('paymentPreferences').value = ['bank-transfer', 'cheque', 'online', 'upi'][Math.floor(Math.random() * 4)];
    document.getElementById('financeContact').value = generateRandomName();
    document.getElementById('adminCoordinatorName').value = generateRandomName();
    document.getElementById('adminCoordinatorPhone').value = generateRandomPhone();
    document.getElementById('academicYearCycle').value = 'April - March';
    document.getElementById('workshopApprovalStatus').value = ['approved', 'pending', 'not-required'][Math.floor(Math.random() * 3)];
    document.getElementById('digitalReportsConsent').value = ['yes', 'no'][Math.floor(Math.random() * 2)];
    
    // Step 7: Compliance (file uploads can't be auto-filled)
    document.getElementById('labSafetyCompliance').value = ['compliant', 'non-compliant', 'pending'][Math.floor(Math.random() * 3)];
    document.getElementById('teacherPoliceVerification').value = ['verified', 'partial', 'pending'][Math.floor(Math.random() * 3)];
    
    // Step 8: Emergency
    document.getElementById('emergencyContactPerson').value = generateRandomName();
    document.getElementById('emergencyPhone').value = generateRandomPhone();
    document.getElementById('nearestHospital').value = city + ' General Hospital';
    document.getElementById('evacuationPlan').value = ['documented', 'in-progress', 'not-available'][Math.floor(Math.random() * 3)];
    
    // Step 9: Additional
    document.getElementById('awards').value = 'Best School Award 2023, Excellence in Education 2022';
    document.getElementById('notableAlumni').value = 'Dr. ' + generateRandomName() + ', Prof. ' + generateRandomName();
    document.getElementById('performanceTrends').value = Math.floor(85 + Math.random() * 15) + '% pass rate';
    document.getElementById('socialMediaLinks').value = 'facebook.com/school, instagram.com/school';
    document.getElementById('eventsCalendar').value = 'Annual Day - March, Sports Day - December, Science Fair - October';
    
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
    const schoolForm = document.getElementById('schoolForm');
    if (schoolForm) {
        schoolForm.addEventListener('submit', function (e) {
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
    
    if (!currentStepElement) {
        return true; // If step doesn't exist, consider it valid
    }

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
    
    if (!currentStepElement) {
        return; // If step doesn't exist, skip saving
    }
    
    const inputs = currentStepElement.querySelectorAll('input, select');

    inputs.forEach(input => {
        if (input.name && input.type !== 'file') {
            formData[input.name] = input.value;
        }
    });
}
