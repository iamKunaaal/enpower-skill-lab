/**
 * ========================================
 * ADD LESSONS PAGE FUNCTIONALITY
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // ================= Auto Fill Button =================
    const autoFillBtn = document.getElementById('alAutoFillBtn');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', function() {
            autoFillForm();
        });
    }

    function autoFillForm() {
        // Sample lesson data
        const sampleData = {
            title: 'Introduction to Financial Literacy',
            description: 'This comprehensive lesson covers the fundamentals of financial literacy including budgeting, saving, and understanding basic financial concepts. Students will learn practical skills for managing personal finances effectively.',
            competency: '1',
            level: 'beginner',
            module: '1',
            applicable_grades: '9',
        };

        // Fill basic fields
        const titleInput = document.getElementById('alLessonTitle');
        if (titleInput) titleInput.value = sampleData.title;

        const descInput = document.getElementById('alShortDescription');
        if (descInput) descInput.value = sampleData.description;

        // Fill select fields
        const competencySelect = document.getElementById('alCompetency');
        if (competencySelect) {
            competencySelect.value = sampleData.competency;
            if (!competencySelect.value) {
                // If value doesn't match, select first option with value
                const options = competencySelect.querySelectorAll('option');
                if (options.length > 1) competencySelect.selectedIndex = 1;
            }
        }

        const levelSelect = document.getElementById('alLevel');
        if (levelSelect) levelSelect.value = sampleData.level;

        const moduleSelect = document.getElementById('alModule');
        if (moduleSelect) {
            moduleSelect.value = sampleData.module;
            if (!moduleSelect.value) {
                const options = moduleSelect.querySelectorAll('option');
                if (options.length > 1) moduleSelect.selectedIndex = 1;
            }
        }

        const gradesSelect = document.getElementById('alApplicableGrades');
        if (gradesSelect) gradesSelect.value = sampleData.applicable_grades;

        // Activate toggles
        const statusToggle = document.getElementById('alStatusToggle');
        if (statusToggle && !statusToggle.classList.contains('active')) {
            statusToggle.classList.add('active');
            const hiddenInput = document.getElementById('alIsPublished');
            if (hiddenInput) hiddenInput.value = 'true';
        }

        const recToggle = document.getElementById('alRecToggle');
        if (recToggle && !recToggle.classList.contains('active')) {
            recToggle.classList.add('active');
            const hiddenInput = document.getElementById('alRecommendLow');
            if (hiddenInput) hiddenInput.value = 'true';
        }

        // Add a sample video URL
        const videoUrlInput = document.querySelector('.al-video-url-input');
        const addUrlBtn = document.querySelector('.al-add-url-btn');
        if (videoUrlInput && addUrlBtn) {
            videoUrlInput.value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
            addUrlBtn.click();
        }

        // Show success feedback
        autoFillBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">check_circle</span> Filled!';
        autoFillBtn.style.backgroundColor = '#10b981';
        autoFillBtn.style.borderColor = '#10b981';
        autoFillBtn.style.color = 'white';

        setTimeout(() => {
            autoFillBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">auto_fix_high</span> Auto Fill';
            autoFillBtn.style.backgroundColor = '';
            autoFillBtn.style.borderColor = '';
            autoFillBtn.style.color = '';
        }, 2000);
    }

    // ================= Lesson Content Tabs =================
    const tabButtons = document.querySelectorAll('.al-lesson-tabs button');
    const contentAreas = {
        'video': createVideoContent(),
        'article': createArticleContent(),
        'quiz': createQuizContent(),
        'resources': createResourcesContent()
    };

    // Initialize with Video content (first tab is active)
    updateContentArea('video', contentAreas['video']);

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update content area based on selected tab
            const selectedTab = this.getAttribute('data-content-type');
            updateContentArea(selectedTab, contentAreas[selectedTab]);
        });
    });

    // Content creators for different tab types
    function createVideoContent() {
        return `
            <label class="al-form-label mb-2">Add Videos</label>
            <div id="alVideoList" class="mb-3"></div>
            <div class="al-upload-box al-video-upload-box">
                <span class="material-symbols-outlined" style="font-size: 2rem; color: var(--primary);">video_library</span>
                <p class="mb-0 fw-medium">Click to upload videos</p>
                <small class="text-muted">MP4, WebM, MOV (Max 500MB per file) - Multiple files supported</small>
            </div>
            <div class="text-center text-muted my-3">— OR —</div>
            <div class="d-flex gap-2 align-items-center">
                <input type="url" class="al-form-control al-video-url-input" placeholder="Enter YouTube or Vimeo URL">
                <button type="button" class="al-btn-outline al-add-url-btn" style="white-space: nowrap;">Add URL</button>
            </div>
        `;
    }

    function createArticleContent() {
        return `
            <label class="al-form-label mb-2">Article Content</label>
            <div class="al-editor-container">
                <div class="al-editor-toolbar">
                    <button type="button" data-command="bold"><span class="material-symbols-outlined">format_bold</span></button>
                    <button type="button" data-command="italic"><span class="material-symbols-outlined">format_italic</span></button>
                    <button type="button" data-command="underline"><span class="material-symbols-outlined">format_underlined</span></button>
                    <button type="button" data-command="insertUnorderedList"><span class="material-symbols-outlined">format_list_bulleted</span></button>
                    <button type="button" data-command="insertOrderedList"><span class="material-symbols-outlined">format_list_numbered</span></button>
                    <button type="button" data-command="createLink"><span class="material-symbols-outlined">link</span></button>
                </div>
                <div contenteditable="true" id="alArticleEditor" class="al-editor-textarea" placeholder="Start writing your lesson content here..."></div>
            </div>
        `;
    }

    function createQuizContent() {
        return `
            <label class="al-form-label mb-2">Quiz Questions</label>
            <div id="alQuizContainer">
                <div class="al-quiz-question">
                    <div class="mb-3">
                        <label class="al-form-label">Question 1</label>
                        <input type="text" class="al-form-control" placeholder="Enter your question">
                    </div>
                    <div class="mb-2">
                        <label class="al-form-label">Answer Options</label>
                        <div class="mb-2">
                            <input type="text" class="al-form-control" placeholder="Option A">
                        </div>
                        <div class="mb-2">
                            <input type="text" class="al-form-control" placeholder="Option B">
                        </div>
                        <div class="mb-2">
                            <input type="text" class="al-form-control" placeholder="Option C">
                        </div>
                        <div class="mb-2">
                            <input type="text" class="al-form-control" placeholder="Option D">
                        </div>
                    </div>
                    <select class="al-form-select">
                        <option selected disabled>Select Correct Answer</option>
                        <option>Option A</option>
                        <option>Option B</option>
                        <option>Option C</option>
                        <option>Option D</option>
                    </select>
                </div>
            </div>
            <button type="button" class="al-btn-outline w-100 mt-3" onclick="addQuizQuestion()">
                <span class="material-symbols-outlined" style="vertical-align: middle;">add</span>
                Add Question
            </button>
        `;
    }

    function createResourcesContent() {
        return `
            <label class="al-form-label mb-2">Lesson Resources</label>
            <div id="alResourceList" class="mb-3"></div>
            <div class="al-upload-box al-resource-upload-box">
                <span class="material-symbols-outlined" style="font-size: 2rem; color: var(--primary);">upload_file</span>
                <p class="mb-0 fw-medium">Click to upload resource documents</p>
                <small class="text-muted">PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (Max 50MB per file) - Multiple files supported</small>
            </div>
            <div class="al-alert-info mt-3">
                <strong>Tip:</strong> Add supplementary materials like worksheets, reading materials, or reference documents that support the lesson.
            </div>
        `;
    }

    function updateContentArea(tabName, content) {
        const contentContainer = document.getElementById('alContentArea');
        if (!contentContainer) return;
        
        contentContainer.innerHTML = content;

        // Re-attach handlers based on tab type
        if (tabName === 'article') {
            attachEditorToolbar();
        } else if (tabName === 'video') {
            attachVideoHandlers();
        } else if (tabName === 'resources') {
            attachResourceHandlers();
        }
    }

    // Editor toolbar functionality
    function attachEditorToolbar() {
        const toolbarButtons = document.querySelectorAll('.al-editor-toolbar button');
        toolbarButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const command = this.getAttribute('data-command');
                if (command === 'createLink') {
                    const url = prompt('Enter URL:');
                    if (url) {
                        document.execCommand(command, false, url);
                    }
                } else {
                    document.execCommand(command, false, null);
                }
            });
        });
    }

    // Video upload functionality
    let videoItems = [];

    function attachVideoHandlers() {
        const uploadBox = document.querySelector('.al-video-upload-box');
        const addUrlBtn = document.querySelector('.al-add-url-btn');
        const urlInput = document.querySelector('.al-video-url-input');

        // File upload handler
        if (uploadBox) {
            uploadBox.addEventListener('click', function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.multiple = true;

                input.addEventListener('change', function(e) {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                        if (file.type.startsWith('video/')) {
                            addVideoItem(file.name, 'file', file);
                        }
                    });
                });

                input.click();
            });
        }

        // URL handler
        if (addUrlBtn) {
            addUrlBtn.addEventListener('click', function() {
                const url = urlInput.value.trim();
                if (url) {
                    if (isValidVideoURL(url)) {
                        addVideoItem(url, 'url', null);
                        urlInput.value = '';
                    } else {
                        alert('Please enter a valid YouTube or Vimeo URL.');
                    }
                }
            });

            urlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addUrlBtn.click();
                }
            });
        }
    }

    function isValidVideoURL(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
        return youtubeRegex.test(url) || vimeoRegex.test(url);
    }

    function addVideoItem(name, type, fileData) {
        const videoId = Date.now() + Math.random();
        videoItems.push({ id: videoId, name, type, fileData });

        const videoList = document.getElementById('alVideoList');
        if (!videoList) return;
        
        const videoItem = document.createElement('div');
        videoItem.className = 'al-video-item';
        videoItem.dataset.videoId = videoId;

        const icon = type === 'file' ? 'video_file' : 'link';

        videoItem.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2 flex-grow-1">
                    <span class="material-symbols-outlined">${icon}</span>
                    <div class="flex-grow-1">
                        <div class="fw-medium" style="font-size: 14px;">${name}</div>
                        <small class="text-muted">${type === 'file' ? 'Video File' : 'Video URL'}</small>
                    </div>
                </div>
                <button type="button" class="al-remove-btn" onclick="removeVideoItem(${videoId})">
                    <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
                </button>
            </div>
            <div class="al-progress-container" style="display: none;">
                <div class="al-progress-wrapper">
                    <div class="al-progress-fill" style="width: 0%;"></div>
                </div>
                <div class="al-progress-text">
                    <span class="al-progress-status">
                        <span class="al-upload-spinner"></span>
                        <span class="ms-2">Uploading...</span>
                    </span>
                    <span class="al-progress-percentage">0%</span>
                </div>
            </div>
        `;

        videoList.appendChild(videoItem);

        // If it's a file upload, simulate the upload process
        if (type === 'file' && fileData) {
            simulateFileUpload(videoId, fileData);
        }
    }

    // Simulate file upload with progress
    function simulateFileUpload(videoId, file) {
        const videoItem = document.querySelector(`[data-video-id="${videoId}"]`);
        if (!videoItem) return;

        const progressContainer = videoItem.querySelector('.al-progress-container');
        const progressFill = videoItem.querySelector('.al-progress-fill');
        const progressPercentage = videoItem.querySelector('.al-progress-percentage');
        const progressStatus = videoItem.querySelector('.al-progress-status');
        const removeBtn = videoItem.querySelector('.al-remove-btn');

        // Show progress bar
        progressContainer.style.display = 'block';
        videoItem.classList.add('uploading');
        removeBtn.style.display = 'none';

        // Simulate upload progress
        let progress = 0;

        const uploadInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;

            if (progress >= 100) {
                progress = 100;
                clearInterval(uploadInterval);

                progressFill.style.width = '100%';
                progressPercentage.textContent = '100%';
                progressStatus.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px; color: #10b981;">check_circle</span><span class="ms-2" style="color: #10b981;">Upload Complete</span>';

                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    videoItem.classList.remove('uploading');
                    videoItem.classList.add('uploaded');
                    removeBtn.style.display = 'flex';
                }, 2000);
            } else {
                progressFill.style.width = progress + '%';
                progressPercentage.textContent = Math.floor(progress) + '%';
            }
        }, 200);
    }

    window.removeVideoItem = function(videoId) {
        videoItems = videoItems.filter(item => item.id !== videoId);
        const videoItem = document.querySelector(`[data-video-id="${videoId}"]`);
        if (videoItem) {
            videoItem.remove();
        }
    };

    // Resource upload functionality
    let resourceItems = [];

    function attachResourceHandlers() {
        const uploadBox = document.querySelector('.al-resource-upload-box');

        if (uploadBox) {
            uploadBox.addEventListener('click', function() {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';
                input.multiple = true;

                input.addEventListener('change', function(e) {
                    const files = Array.from(e.target.files);
                    files.forEach(file => {
                        if (isValidResourceFile(file)) {
                            addResourceItem(file);
                        } else {
                            alert(`File "${file.name}" is not a supported format.`);
                        }
                    });
                });

                input.click();
            });
        }
    }

    function isValidResourceFile(file) {
        const validExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'];
        const fileName = file.name.toLowerCase();
        return validExtensions.some(ext => fileName.endsWith(ext));
    }

    function getFileExtension(fileName) {
        return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
    }

    function getFileIcon(extension) {
        const iconMap = {
            'pdf': 'picture_as_pdf',
            'doc': 'description',
            'docx': 'description',
            'ppt': 'slideshow',
            'pptx': 'slideshow',
            'xls': 'table_chart',
            'xlsx': 'table_chart'
        };
        return iconMap[extension] || 'insert_drive_file';
    }

    function getFileTypeLabel(extension) {
        const labelMap = {
            'pdf': 'PDF',
            'doc': 'DOC',
            'docx': 'DOCX',
            'ppt': 'PPT',
            'pptx': 'PPTX',
            'xls': 'XLS',
            'xlsx': 'XLSX'
        };
        return labelMap[extension] || extension.toUpperCase();
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    function addResourceItem(file) {
        const resourceId = Date.now() + Math.random();
        const extension = getFileExtension(file.name);
        const icon = getFileIcon(extension);
        const typeLabel = getFileTypeLabel(extension);
        const fileSize = formatFileSize(file.size);

        resourceItems.push({
            id: resourceId,
            name: file.name,
            size: file.size,
            type: typeLabel,
            extension: extension,
            fileData: file
        });

        const resourceList = document.getElementById('alResourceList');
        if (!resourceList) return;
        
        const resourceItem = document.createElement('div');
        resourceItem.className = 'al-resource-item d-flex align-items-center justify-content-between';
        resourceItem.dataset.resourceId = resourceId;

        resourceItem.innerHTML = `
            <div class="d-flex align-items-center gap-3 flex-grow-1">
                <span class="material-symbols-outlined" style="font-size: 32px; color: var(--primary);">${icon}</span>
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <div class="fw-medium" style="font-size: 14px;">${file.name}</div>
                        <span class="al-resource-badge">${typeLabel}</span>
                    </div>
                    <small class="text-muted">${fileSize}</small>
                </div>
            </div>
            <button type="button" class="al-remove-btn" onclick="removeResourceItem(${resourceId})">
                <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
        `;

        resourceList.appendChild(resourceItem);
    }

    window.removeResourceItem = function(resourceId) {
        resourceItems = resourceItems.filter(item => item.id !== resourceId);
        const resourceItem = document.querySelector(`[data-resource-id="${resourceId}"]`);
        if (resourceItem) {
            resourceItem.remove();
        }
    };

    // Quiz question management
    let questionCount = 1;

    window.addQuizQuestion = function() {
        questionCount++;
        const quizContainer = document.getElementById('alQuizContainer');
        if (!quizContainer) return;
        
        const newQuestion = document.createElement('div');
        newQuestion.className = 'al-quiz-question position-relative';
        newQuestion.innerHTML = `
            <button type="button" class="al-remove-btn position-absolute" style="top: 0.5rem; right: 0.5rem;" onclick="removeQuestion(this)">
                <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
            <div class="mb-3">
                <label class="al-form-label">Question ${questionCount}</label>
                <input type="text" class="al-form-control" placeholder="Enter your question">
            </div>
            <div class="mb-2">
                <label class="al-form-label">Answer Options</label>
                <div class="mb-2">
                    <input type="text" class="al-form-control" placeholder="Option A">
                </div>
                <div class="mb-2">
                    <input type="text" class="al-form-control" placeholder="Option B">
                </div>
                <div class="mb-2">
                    <input type="text" class="al-form-control" placeholder="Option C">
                </div>
                <div class="mb-2">
                    <input type="text" class="al-form-control" placeholder="Option D">
                </div>
            </div>
            <select class="al-form-select">
                <option selected disabled>Select Correct Answer</option>
                <option>Option A</option>
                <option>Option B</option>
                <option>Option C</option>
                <option>Option D</option>
            </select>
        `;
        quizContainer.appendChild(newQuestion);
    };

    window.removeQuestion = function(button) {
        const questionDiv = button.closest('.al-quiz-question');
        questionDiv.remove();

        // Renumber remaining questions
        const questions = document.querySelectorAll('.al-quiz-question');
        questions.forEach((q, index) => {
            const label = q.querySelector('.al-form-label');
            if (label && label.textContent.startsWith('Question')) {
                label.textContent = `Question ${index + 1}`;
            }
        });
        questionCount = questions.length;
    };

    // ================= File Upload (Thumbnail) =================
    const fileUploadArea = document.getElementById('alThumbnailUpload');
    const thumbnailInput = document.getElementById('alThumbnailInput');

    if (fileUploadArea && thumbnailInput) {
        fileUploadArea.addEventListener('click', () => {
            thumbnailInput.click();
        });

        thumbnailInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;

                const reader = new FileReader();
                reader.onload = function(e) {
                    fileUploadArea.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px; margin-bottom: 10px;">
                        <p class="mb-0 fw-medium">${fileName}</p>
                        <small class="text-muted">Click to change</small>
                    `;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        // Drag and Drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--primary)';
            fileUploadArea.style.backgroundColor = '#f0edff';
        });

        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--border-color)';
            fileUploadArea.style.backgroundColor = 'var(--bg-light)';
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--border-color)';
            fileUploadArea.style.backgroundColor = 'var(--bg-light)';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                thumbnailInput.files = files;
                const event = new Event('change');
                thumbnailInput.dispatchEvent(event);
            }
        });
    }

    // ================= Toggle Switches =================
    const switches = document.querySelectorAll('.al-switch');

    switches.forEach(switchEl => {
        switchEl.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // ================= Action Buttons =================
    const publishBtn = document.getElementById('alPublishBtn');
    const saveDraftBtn = document.getElementById('alSaveDraftBtn');
    const cancelBtn = document.getElementById('alCancelBtn');

    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            const title = document.getElementById('alLessonTitle').value.trim();

            if (!title) {
                alert('Please fill in the Lesson Title');
                return;
            }

            // Submit form
            const form = document.getElementById('alLessonForm');
            if (form) {
                const statusInput = document.createElement('input');
                statusInput.type = 'hidden';
                statusInput.name = 'status';
                statusInput.value = 'published';
                form.appendChild(statusInput);
                form.submit();
            }
        });
    }

    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            const title = document.getElementById('alLessonTitle').value.trim();

            if (!title) {
                alert('Please fill in the Lesson Title');
                return;
            }

            // Submit form as draft
            const form = document.getElementById('alLessonForm');
            if (form) {
                const statusInput = document.createElement('input');
                statusInput.type = 'hidden';
                statusInput.name = 'status';
                statusInput.value = 'draft';
                form.appendChild(statusInput);
                form.submit();
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                window.location.href = document.referrer || '/superadmin/lessons/';
            }
        });
    }
});
