/**
 * Onboard Parent Form JavaScript
 * Handles multi-step form navigation, validation, and auto-fill functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Multi-step form logic
    let currentStep = 1;
    const totalSteps = 8;
    const formData = {};

    // Validators
    const validators = {
        // Step 1: Primary Parent
        full_name: {
            validate: (value) => {
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 3) return 'Name must be at least 3 characters';
                if (!/^[a-zA-Z\s.]+$/.test(value)) return 'Name should only contain letters';
                return '';
            }
        },
        relation_to_student: {
            validate: (value) => {
                if (!value) return 'Relation to student is required';
                return '';
            }
        },
        mobile_number: {
            validate: (value) => {
                if (!value.trim()) return 'Mobile number is required';
                if (!/^[6-9]\d{9}$/.test(value)) return 'Please enter a valid 10-digit mobile number';
                return '';
            }
        },
        alternate_mobile: {
            validate: (value) => {
                if (value && !/^[6-9]\d{9}$/.test(value)) return 'Please enter a valid 10-digit mobile number';
                return '';
            }
        },
        email: {
            validate: (value) => {
                if (!value.trim()) return 'Email address is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        // Step 2: Secondary Parent
        secondary_mobile: {
            validate: (value) => {
                if (value && !/^[6-9]\d{9}$/.test(value)) return 'Please enter a valid 10-digit mobile number';
                return '';
            }
        },
        secondary_email: {
            validate: (value) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        preferred_contact: {
            validate: (value) => {
                if (!value) return 'Please select preferred contact person';
                return '';
            }
        },
        // Step 3: Address
        residential_address: {
            validate: (value) => {
                if (!value.trim()) return 'Residential address is required';
                if (value.trim().length < 10) return 'Address must be at least 10 characters';
                return '';
            }
        },
        city: {
            validate: (value) => {
                if (!value.trim()) return 'City is required';
                return '';
            }
        },
        state: {
            validate: (value) => {
                if (!value.trim()) return 'State is required';
                return '';
            }
        },
        pin_code: {
            validate: (value) => {
                if (!value.trim()) return 'PIN code is required';
                if (!/^\d{6}$/.test(value)) return 'PIN code must be exactly 6 digits';
                return '';
            }
        },
        // Step 4: Communication
        contact_method: {
            validate: (value) => {
                if (!value) return 'Please select preferred contact method';
                return '';
            }
        },
        preferred_language: {
            validate: (value) => {
                if (!value) return 'Please select preferred language';
                return '';
            }
        },
        // Step 5: Financial
        fee_category: {
            validate: (value) => {
                if (!value) return 'Please select fee category';
                return '';
            }
        },
        billing_email: {
            validate: (value) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        gst_number: {
            validate: (value) => {
                if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
                    return 'Please enter a valid GST number';
                }
                return '';
            }
        },
        // Step 6: Emergency
        emergency_name: {
            validate: (value) => {
                if (!value.trim()) return 'Emergency contact name is required';
                return '';
            }
        },
        emergency_relation: {
            validate: (value) => {
                if (!value) return 'Please select relation';
                return '';
            }
        },
        emergency_phone: {
            validate: (value) => {
                if (!value.trim()) return 'Emergency phone number is required';
                if (!/^[6-9]\d{9}$/.test(value)) return 'Please enter a valid 10-digit mobile number';
                return '';
            }
        }
    };

    // Helper function to show error
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        if (field) {
            field.classList.add('error');
            field.classList.add('input-error');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Helper function to clear error
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');

        if (field) {
            field.classList.remove('error');
            field.classList.remove('input-error');
        }
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Add real-time validation listeners for all fields
    Object.keys(validators).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                const error = validators[fieldName].validate(this.value);
                if (error) {
                    showError(fieldName, error);
                } else {
                    clearError(fieldName);
                }
            });

            field.addEventListener('input', function() {
                clearError(fieldName);
            });
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

    // PIN code formatting
    const pincodeInput = document.getElementById('pin_code');
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
        uploadPhotoBtn.addEventListener('click', function() {
            profilePhoto.click();
        });

        photoPreview.addEventListener('click', function() {
            profilePhoto.click();
        });

        profilePhoto.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size should not exceed 2MB');
                    profilePhoto.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    photoPreview.style.backgroundImage = `url(${event.target.result})`;
                    photoPreview.style.backgroundSize = 'cover';
                    photoPreview.style.backgroundPosition = 'center';
                    photoPreview.innerHTML = '';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Random data generators
    function getRandomFirstName(gender) {
        const maleNames = ['Ramesh', 'Suresh', 'Mahesh', 'Rajesh', 'Dinesh', 'Vijay', 'Sanjay', 'Anil', 'Sunil', 'Mukesh', 'Rakesh', 'Prakash'];
        const femaleNames = ['Sunita', 'Anita', 'Kavita', 'Priya', 'Neeta', 'Geeta', 'Seema', 'Rekha', 'Meena', 'Pooja', 'Anjali', 'Shweta'];
        const names = gender === 'female' ? femaleNames : maleNames;
        return names[Math.floor(Math.random() * names.length)];
    }
    
    function getRandomLastName() {
        const names = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Reddy', 'Joshi', 'Iyer', 'Nair', 'Mehta', 'Shah', 'Desai', 'Rao', 'Agarwal', 'Pandey', 'Mishra', 'Das', 'Roy'];
        return names[Math.floor(Math.random() * names.length)];
    }
    
    function getRandomPhone() {
        const prefixes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
        return prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(10000000 + Math.random() * 90000000);
    }
    
    function getRandomEmail(name) {
        const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'email.com'];
        const timestamp = Date.now().toString().slice(-6);
        return name.toLowerCase().replace(/\s/g, '.') + timestamp + '@' + domains[Math.floor(Math.random() * domains.length)];
    }
    
    function getRandomAadhar() {
        let aadhar = '';
        for (let i = 0; i < 12; i++) aadhar += Math.floor(Math.random() * 10);
        return aadhar;
    }
    
    function getRandomGST() {
        const states = ['27', '29', '06', '07', '09', '33'];
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let gst = states[Math.floor(Math.random() * states.length)];
        for (let i = 0; i < 5; i++) gst += chars[Math.floor(Math.random() * chars.length)];
        for (let i = 0; i < 4; i++) gst += Math.floor(Math.random() * 10);
        gst += chars[Math.floor(Math.random() * chars.length)] + '1Z';
        gst += Math.floor(Math.random() * 10);
        return gst;
    }

    // Auto Fill Dummy Data Function
    function autoFillForm() {
        const lastName = getRandomLastName();
        const primaryFirstName = getRandomFirstName('male');
        const primaryFullName = primaryFirstName + ' ' + lastName;
        const secondaryFirstName = getRandomFirstName('female');
        const secondaryFullName = secondaryFirstName + ' ' + lastName;
        
        // Step 1: Primary Parent
        const fullName = document.getElementById('full_name');
        if (fullName) fullName.value = primaryFullName;
        
        const relationToStudent = document.getElementById('relation_to_student');
        if (relationToStudent) relationToStudent.value = ['father', 'mother', 'guardian'][Math.floor(Math.random() * 3)];
        
        const mobileNumber = document.getElementById('mobile_number');
        if (mobileNumber) mobileNumber.value = getRandomPhone();
        
        const alternateMobile = document.getElementById('alternate_mobile');
        if (alternateMobile) alternateMobile.value = getRandomPhone();
        
        const email = document.getElementById('email');
        if (email) email.value = getRandomEmail(primaryFullName);
        
        const occupations = ['Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Bank Manager', 'Accountant', 'Lawyer', 'Government Officer'];
        const occupation = document.getElementById('occupation');
        if (occupation) occupation.value = occupations[Math.floor(Math.random() * occupations.length)];
        
        const organizations = ['Tech Solutions Pvt Ltd', 'ABC Corporation', 'XYZ Industries', 'Global Services', 'Prime Enterprises', 'State Government'];
        const organization = document.getElementById('organization');
        if (organization) organization.value = organizations[Math.floor(Math.random() * organizations.length)];
        
        const educationLevel = document.getElementById('education_level');
        if (educationLevel) educationLevel.value = ['graduate', 'post-graduate', 'doctorate', 'diploma'][Math.floor(Math.random() * 4)];
        
        const idProof = document.getElementById('id_proof');
        if (idProof) idProof.value = getRandomAadhar();

        // Step 2: Secondary Parent
        const secondaryFullNameField = document.getElementById('secondary_full_name');
        if (secondaryFullNameField) secondaryFullNameField.value = secondaryFullName;
        
        const secondaryRelation = document.getElementById('secondary_relation');
        if (secondaryRelation) secondaryRelation.value = 'mother';
        
        const secondaryMobile = document.getElementById('secondary_mobile');
        if (secondaryMobile) secondaryMobile.value = getRandomPhone();
        
        const secondaryEmail = document.getElementById('secondary_email');
        if (secondaryEmail) secondaryEmail.value = getRandomEmail(secondaryFullName);
        
        const secondaryOccupation = document.getElementById('secondary_occupation');
        if (secondaryOccupation) secondaryOccupation.value = occupations[Math.floor(Math.random() * occupations.length)];
        
        const preferredContact = document.getElementById('preferred_contact');
        if (preferredContact) preferredContact.value = ['primary', 'secondary', 'both'][Math.floor(Math.random() * 3)];

        // Step 3: Address
        const streets = ['MG Road', 'Park Street', 'Station Road', 'Gandhi Nagar', 'Nehru Colony', 'Green Valley'];
        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad'];
        const states = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Telangana'];
        const cityIndex = Math.floor(Math.random() * cities.length);
        
        const residentialAddress = document.getElementById('residential_address');
        if (residentialAddress) residentialAddress.value = 'Flat ' + Math.floor(100 + Math.random() * 900) + ', ' + streets[Math.floor(Math.random() * streets.length)] + ', Sector ' + Math.floor(1 + Math.random() * 50);
        
        const landmarks = ['Near City Mall', 'Opposite Metro Station', 'Behind School', 'Near Hospital', 'Next to Park'];
        const landmark = document.getElementById('landmark');
        if (landmark) landmark.value = landmarks[Math.floor(Math.random() * landmarks.length)];
        
        const cityField = document.getElementById('city');
        if (cityField) cityField.value = cities[cityIndex];
        
        const stateField = document.getElementById('state');
        if (stateField) stateField.value = states[Math.min(cityIndex, states.length - 1)];
        
        const pinCode = document.getElementById('pin_code');
        if (pinCode) pinCode.value = Math.floor(100000 + Math.random() * 899999).toString();
        
        const permanentAddress = document.getElementById('permanent_address');
        if (permanentAddress) permanentAddress.value = Math.floor(1 + Math.random() * 500) + ' ' + streets[Math.floor(Math.random() * streets.length)] + ', ' + cities[Math.floor(Math.random() * cities.length)];

        // Step 4: Communication Preferences
        const contactMethod = document.getElementById('contact_method');
        if (contactMethod) contactMethod.value = ['whatsapp', 'call', 'email', 'sms'][Math.floor(Math.random() * 4)];
        
        const preferredLanguage = document.getElementById('preferred_language');
        if (preferredLanguage) preferredLanguage.value = ['english', 'hindi', 'regional'][Math.floor(Math.random() * 3)];
        
        const dndTimings = document.getElementById('dnd_timings');
        if (dndTimings) dndTimings.value = ['10:00 PM - 7:00 AM', '9:00 PM - 8:00 AM', '11:00 PM - 6:00 AM'][Math.floor(Math.random() * 3)];
        
        const whatsappYes = document.querySelector('input[name="whatsapp_consent"][value="yes"]');
        if (whatsappYes) whatsappYes.checked = true;
        
        const photoConsentYes = document.querySelector('input[name="photo_consent"][value="yes"]');
        if (photoConsentYes) photoConsentYes.checked = true;

        // Step 5: Financial
        const feeCategory = document.getElementById('fee_category');
        if (feeCategory) feeCategory.value = ['regular', 'scholarship', 'sibling-discount'][Math.floor(Math.random() * 3)];
        
        const paymentMode = document.getElementById('payment_mode');
        if (paymentMode) paymentMode.value = ['online', 'cheque', 'cash', 'bank-transfer'][Math.floor(Math.random() * 4)];
        
        const billingEmail = document.getElementById('billing_email');
        if (billingEmail) billingEmail.value = 'billing.' + primaryFullName.toLowerCase().replace(/\s/g, '') + Date.now().toString().slice(-4) + '@email.com';
        
        const gstNumber = document.getElementById('gst_number');
        if (gstNumber) gstNumber.value = Math.random() > 0.5 ? getRandomGST() : '';

        // Step 6: Emergency
        const emergencyFirstName = getRandomFirstName(Math.random() > 0.5 ? 'male' : 'female');
        const emergencyName = document.getElementById('emergency_name');
        if (emergencyName) emergencyName.value = emergencyFirstName + ' ' + getRandomLastName();
        
        const emergencyRelation = document.getElementById('emergency_relation');
        if (emergencyRelation) emergencyRelation.value = ['uncle', 'aunt', 'grandparent', 'neighbor', 'friend'][Math.floor(Math.random() * 5)];
        
        const emergencyPhone = document.getElementById('emergency_phone');
        if (emergencyPhone) emergencyPhone.value = getRandomPhone();
        
        const emergencyAddress = document.getElementById('emergency_address');
        if (emergencyAddress) emergencyAddress.value = 'House ' + Math.floor(1 + Math.random() * 500) + ', ' + streets[Math.floor(Math.random() * streets.length)] + ', ' + cities[Math.floor(Math.random() * cities.length)];

        // Step 7: Parent Involvement
        const meetingAvailability = document.getElementById('meeting_availability');
        if (meetingAvailability) meetingAvailability.value = ['weekdays', 'weekends', 'both'][Math.floor(Math.random() * 3)];
        
        const volunteerYes = document.querySelector('input[name="volunteer_interest"][value="yes"]');
        if (volunteerYes) volunteerYes.checked = Math.random() > 0.5;
        
        const skillsList = ['Public Speaking', 'Technology Training', 'Event Management', 'Music', 'Art & Craft', 'Sports Coaching', 'Career Guidance', 'Health & Wellness'];
        const selectedSkills = skillsList.sort(() => Math.random() - 0.5).slice(0, Math.floor(2 + Math.random() * 3));
        const parentSkills = document.getElementById('parent_skills');
        if (parentSkills) parentSkills.value = selectedSkills.join(', ');

        alert('✅ Form auto-filled with unique random data!');
    }

    // Auto Fill Button Handler
    const autoFillBtn = document.getElementById('autoFillBtn');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', autoFillForm);
    }

    // Initialize
    updateStepDisplay();

    // Next button handler
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateCurrentStep()) {
                saveCurrentStepData();
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateStepDisplay();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }

    // Back button handler
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                updateStepDisplay();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Step click handlers
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.addEventListener('click', function() {
            const stepNumber = index + 1;
            // Allow clicking on completed steps or current step
            if (stepNumber < currentStep) {
                currentStep = stepNumber;
                updateStepDisplay();
            }
        });
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
        const backBtnEl = document.getElementById('backBtn');
        const nextBtnEl = document.getElementById('nextBtn');
        const submitBtnEl = document.getElementById('submitBtn');

        if (backBtnEl) backBtnEl.style.display = currentStep > 1 ? 'inline-flex' : 'none';
        if (nextBtnEl) nextBtnEl.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
        if (submitBtnEl) submitBtnEl.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
    }

    function validateCurrentStep() {
        let isValid = true;
        const currentStepElement = document.getElementById(`step${currentStep}`);

        if (!currentStepElement) return true;

        // Get all fields with validators in the current step
        const fieldsToValidate = currentStepElement.querySelectorAll('input[id], select[id], textarea[id]');

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

        const inputs = currentStepElement.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.type === 'radio') {
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else if (input.name && input.type !== 'file') {
                formData[input.name] = input.value;
            }
        });
    }
});
