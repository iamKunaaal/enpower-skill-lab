// Onboard Program Coordinator JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Multi-step form logic
    let currentStep = 1;
    const totalSteps = 8;
    const formData = {};

    // Calculate age from date of birth
    const dobInput = document.getElementById('dateOfBirth');
    if (dobInput) {
        dobInput.addEventListener('change', function() {
            const dob = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            document.getElementById('age').value = age >= 0 ? age + ' years' : '';
        });
    }

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    });

    // Aadhar number formatting
    const aadharInput = document.getElementById('aadharNumber');
    if (aadharInput) {
        aadharInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 12) {
                value = value.slice(0, 12);
            }
            e.target.value = value;
        });
    }

    // PIN code formatting
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function (e) {
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

        photoPreview.addEventListener('click', function () {
            profilePhoto.click();
        });

        profilePhoto.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size should not exceed 2MB');
                    profilePhoto.value = '';
                    return;
                }

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

    // File upload handlers
    const resumeUpload = document.getElementById('resumeUpload');
    if (resumeUpload) {
        resumeUpload.addEventListener('change', function() {
            document.getElementById('resumeFileName').textContent = this.files[0] ? this.files[0].name : 'No file chosen';
        });
    }

    const bankProofUpload = document.getElementById('bankProofUpload');
    if (bankProofUpload) {
        bankProofUpload.addEventListener('change', function() {
            document.getElementById('bankProofFileName').textContent = this.files[0] ? this.files[0].name : 'No file chosen';
        });
    }

    // Multi-select dropdown functionality
    const selectedItemsContainer = document.getElementById('selectedSchools');
    const dropdown = document.getElementById('schoolsDropdown');
    const checkboxes = document.querySelectorAll('input[name="schools"]');
    const searchInput = document.getElementById('schoolSearch');

    if (selectedItemsContainer && dropdown) {
        selectedItemsContainer.addEventListener('click', function () {
            dropdown.classList.toggle('active');
            selectedItemsContainer.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.opc-multi-select-container')) {
                dropdown.classList.remove('active');
                selectedItemsContainer.classList.remove('active');
            }
        });

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                updateSelectedSchools();
            });
        });
    }

    function updateSelectedSchools() {
        const selected = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => ({
                value: cb.value,
                label: cb.nextElementSibling.textContent
            }));

        if (selected.length === 0) {
            selectedItemsContainer.innerHTML = '<span class="placeholder">Select schools to assign (Single / Multiple)</span>';
        } else {
            selectedItemsContainer.innerHTML = selected.map(item => `
                <span class="opc-selected-tag">
                    ${item.label}
                    <span class="remove" data-value="${item.value}">×</span>
                </span>
            `).join('');

            selectedItemsContainer.querySelectorAll('.remove').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const value = this.getAttribute('data-value');
                    const checkbox = document.querySelector(`input[value="${value}"]`);
                    if (checkbox) {
                        checkbox.checked = false;
                        updateSelectedSchools();
                    }
                });
            });
        }

        if (selected.length > 0) {
            selectedItemsContainer.classList.remove('error');
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const options = document.querySelectorAll('.opc-checkbox-option');

            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }

    // Auto Fill Dummy Data Function
    // Helper functions for random data generation
    function randomFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomDigits(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    function randomPAN() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let pan = '';
        for (let i = 0; i < 5; i++) pan += letters[Math.floor(Math.random() * 26)];
        for (let i = 0; i < 4; i++) pan += Math.floor(Math.random() * 10);
        pan += letters[Math.floor(Math.random() * 26)];
        return pan;
    }

    function randomIFSC() {
        const banks = ['HDFC', 'ICIC', 'SBIN', 'AXIS', 'KOTAK', 'BARB', 'PUNB'];
        return randomFromArray(banks) + '0' + randomDigits(6);
    }

    function randomDate(startYear, endYear) {
        const year = startYear + Math.floor(Math.random() * (endYear - startYear));
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function autoFillForm() {
        const timestamp = Date.now();
        const uniqueId = timestamp.toString().slice(-6);
        
        const firstNames = ['Priya', 'Rahul', 'Sneha', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Rohan', 'Pooja', 'Karan'];
        const lastNames = ['Sharma', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Verma', 'Joshi', 'Reddy', 'Nair', 'Das'];
        const genders = ['male', 'female'];
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const designations = ['Program Coordinator', 'Project Coordinator'];
        const specializations = ['Operations', 'Education', 'Project Management', 'Others'];
        const programs = ['CSL', 'CSL+', 'Idea Lab Aff', 'Idea Lab Certf'];
        const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
        const cities = ['Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];
        const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Delhi', 'West Bengal', 'Gujarat'];
        const banks = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'];
        const workStyles = ['Field', 'Remote', 'Hybrid'];
        const employmentTypes = ['Full-time', 'Contract', 'Consultant'];

        const firstName = randomFromArray(firstNames);
        const lastName = randomFromArray(lastNames);
        const fullName = `${firstName} ${lastName}`;
        const gender = randomFromArray(genders);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueId}@example.com`;

        // Step 1: Basic Information
        document.getElementById('fullName').value = fullName;
        document.getElementById('gender').value = gender;
        document.getElementById('dateOfBirth').value = randomDate(1985, 2000);
        document.getElementById('bloodGroup').value = randomFromArray(bloodGroups);
        document.getElementById('nationality').value = 'Indian';
        document.getElementById('employeeId').value = `PC${uniqueId}`;
        document.getElementById('aadharNumber').value = randomDigits(12);
        document.getElementById('panNumber').value = randomPAN();

        // Step 2: Professional Details
        document.getElementById('designation').value = randomFromArray(designations);
        document.getElementById('qualification').value = randomFromArray(['MBA', 'B.Tech', 'M.Tech', 'BBA', 'MCA']);
        document.getElementById('specialization').value = randomFromArray(specializations);
        document.getElementById('totalExperience').value = `${Math.floor(Math.random() * 10) + 1} Years ${Math.floor(Math.random() * 12)} Months`;
        document.getElementById('programManagementExp').value = `${Math.floor(Math.random() * 5) + 1} Years`;
        document.getElementById('educationExp').value = `${Math.floor(Math.random() * 5)} Years`;
        document.getElementById('previousOrganizations').value = 'ABC Education Solutions\nXYZ Learning Institute';
        document.getElementById('languagesKnown').value = 'English, Hindi, ' + randomFromArray(['Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali']);
        document.getElementById('certifications').value = randomFromArray(['PMP Certified', 'Agile Scrum Master', 'Six Sigma', 'None']);

        // Step 3: Contact Information
        document.getElementById('mobileNumber').value = '9' + randomDigits(9);
        document.getElementById('alternateNumber').value = '9' + randomDigits(9);
        document.getElementById('officialEmail').value = email;
        document.getElementById('personalEmail').value = `${firstName.toLowerCase()}${uniqueId}@gmail.com`;

        // Step 4: Address Details
        const cityIndex = Math.floor(Math.random() * cities.length);
        document.getElementById('currentAddress').value = `Flat ${Math.floor(Math.random() * 999) + 1}, ${randomFromArray(['Sunrise', 'Green', 'Royal', 'Palm'])} Apartments`;
        document.getElementById('permanentAddress').value = `House No. ${Math.floor(Math.random() * 99) + 1}, ${randomFromArray(['Green Valley', 'Lake View', 'Hill Top'])} Colony`;
        document.getElementById('city').value = cities[cityIndex];
        document.getElementById('state').value = states[cityIndex % states.length];
        document.getElementById('pincode').value = String(Math.floor(Math.random() * 900000) + 100000);

        // Step 5: Compliance & Documentation
        document.getElementById('idProof').value = 'Both';
        document.getElementById('addressProof').value = 'Aadhar';
        document.getElementById('policeVerification').value = 'Completed';
        document.getElementById('passportPhotoUploaded').value = 'Yes';
        document.getElementById('contractUploaded').value = 'Yes';
        document.getElementById('panAadharLinked').value = 'Yes';
        document.getElementById('ndaSigned').value = 'Yes';

        // Step 6: Program & Work Assignment Details
        document.getElementById('programAssigned').value = randomFromArray(programs);
        document.getElementById('zoneAssigned').value = randomFromArray(zones);
        const schoolCheckboxes = document.querySelectorAll('input[name="schools"]');
        const numSchools = Math.min(Math.floor(Math.random() * 3) + 1, schoolCheckboxes.length);
        for (let i = 0; i < numSchools; i++) {
            schoolCheckboxes[i].checked = true;
        }
        updateSelectedSchools();
        document.getElementById('branchRegion').value = `${cities[cityIndex]} Region`;
        document.getElementById('reportingManager').value = `${randomFromArray(firstNames)} ${randomFromArray(lastNames)}`;
        document.getElementById('loginRole').value = 'Program Coordinator';
        document.getElementById('joiningDate').value = randomDate(2023, 2025);
        document.getElementById('employmentType').value = randomFromArray(employmentTypes);

        // Step 7: Bank & Payroll Details
        document.getElementById('bankName').value = randomFromArray(banks);
        document.getElementById('branchName').value = `${cities[cityIndex]} Main Branch`;
        document.getElementById('accountNumber').value = randomDigits(14);
        document.getElementById('ifscCode').value = randomIFSC();

        // Step 8: Additional Optional Data
        document.getElementById('strengthAreas').value = 'Team Management, Communication, Problem Solving';
        document.getElementById('hobbies').value = randomFromArray(['Reading, Traveling', 'Photography, Music', 'Sports, Gaming', 'Cooking, Gardening']);
        document.getElementById('workStyle').value = randomFromArray(workStyles);
        document.getElementById('toolsComfortable').value = 'Google Sheets, Trello, Asana';
        document.getElementById('achievements').value = `Best ${randomFromArray(designations)} Award ${2020 + Math.floor(Math.random() * 4)}`;
        document.getElementById('careerAspirations').value = 'To lead large-scale educational programs';

        // Trigger age calculation
        document.getElementById('dateOfBirth').dispatchEvent(new Event('change'));

        alert('Form auto-filled with unique random data!');
    }

    const autoFillBtn = document.getElementById('autoFillBtn');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', autoFillForm);
    }

    // Initialize
    updateStepDisplay();

    // Next button handler
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            if (validateCurrentStep()) {
                saveCurrentStepData();
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateStepDisplay();
                    window.scrollTo(0, 0);
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
                window.scrollTo(0, 0);
            }
        });
    }

    // Form submission handler
    const coordinatorForm = document.getElementById('coordinatorForm');
    if (coordinatorForm) {
        coordinatorForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateCurrentStep()) {
                saveCurrentStepData();
                console.log('Final Form Data:', formData);
                // Submit form normally after validation
                this.submit();
            }
        });
    }

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
        document.querySelectorAll('.opc-step').forEach((step, index) => {
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

        if (backBtnEl) backBtnEl.style.display = currentStep > 1 ? 'flex' : 'none';
        if (nextBtnEl) nextBtnEl.style.display = currentStep < totalSteps ? 'flex' : 'none';
        if (submitBtnEl) submitBtnEl.style.display = currentStep === totalSteps ? 'flex' : 'none';
    }

    function validateCurrentStep() {
        let isValid = true;
        const currentStepElement = document.getElementById(`step${currentStep}`);

        if (!currentStepElement) return true;

        // Get all required fields in the current step
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // Special validation for multi-select schools in step 6
        if (currentStep === 6 && selectedItemsContainer) {
            const selectedSchools = document.querySelectorAll('input[name="schools"]:checked');
            if (selectedSchools.length === 0) {
                isValid = false;
                selectedItemsContainer.classList.add('error');
            } else {
                selectedItemsContainer.classList.remove('error');
            }
        }

        if (!isValid) {
            alert('Please fill in all required fields marked with *');
        }

        return isValid;
    }

    function saveCurrentStepData() {
        const currentStepElement = document.getElementById(`step${currentStep}`);
        if (!currentStepElement) return;

        const inputs = currentStepElement.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.type === 'checkbox' && input.name === 'schools') {
                if (!formData.schools) formData.schools = [];
                if (input.checked && !formData.schools.includes(input.value)) {
                    formData.schools.push(input.value);
                }
            } else if (input.name && input.type !== 'file') {
                formData[input.name] = input.value;
            } else if (input.type === 'file' && input.files[0]) {
                formData[input.name] = input.files[0].name;
            }
        });
    }
});
