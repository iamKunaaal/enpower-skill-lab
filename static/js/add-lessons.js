/**
 * ========================================
 * ADD LESSONS PAGE FUNCTIONALITY
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // ================= Global Variables (Declare First) =================
    // These need to be declared at the top to avoid "Cannot access before initialization" errors
    let videoItems = [];
    let resourceItems = [];
    let questionCount = 1;

    // ================= Auto Fill Button =================
    const autoFillBtn = document.getElementById('alAutoFillBtn');
    if (autoFillBtn) {
        autoFillBtn.addEventListener('click', function() {
            autoFillForm();
        });
    }

    function autoFillForm() {
        // Random lesson data arrays
        const titles = [
            'Introduction to Financial Literacy',
            'Digital Safety and Online Security',
            'Effective Communication Skills',
            'Leadership Fundamentals',
            'Critical Thinking and Problem Solving',
            'Time Management Essentials',
            'Emotional Intelligence Basics',
            'Public Speaking Mastery',
            'Team Collaboration Skills',
            'Creative Problem Solving'
        ];
        
        const descriptions = [
            'This comprehensive lesson covers the fundamentals of financial literacy including budgeting, saving, and understanding basic financial concepts.',
            'Learn how to stay safe online, protect your personal information, and navigate the digital world responsibly.',
            'Develop essential communication skills for personal and professional success through practical exercises and real-world examples.',
            'Discover the core principles of leadership and learn how to inspire and motivate others effectively.',
            'Master the art of critical thinking and learn systematic approaches to solving complex problems.',
            'Learn proven techniques for managing your time effectively and boosting your productivity.',
            'Understand and develop emotional intelligence to improve relationships and decision-making.',
            'Overcome public speaking anxiety and learn to deliver compelling presentations with confidence.',
            'Learn how to work effectively in teams, resolve conflicts, and achieve common goals.',
            'Unlock your creative potential and learn innovative approaches to problem-solving.'
        ];
        
        const competencies = [
            'Financial Literacy', 'Digital Skills', 'Communication', 'Leadership', 
            'Critical Thinking', 'Time Management', 'Emotional Intelligence', 
            'Public Speaking', 'Teamwork', 'Creativity'
        ];
        
        const levels = ['beginner', 'intermediate', 'advanced'];
        const grades = ['8', '9', '10', '11', '12'];
        const modules = ['Module 1: Basics', 'Module 2: Intermediate', 'Module 3: Advanced', 'Module 4: Mastery'];
        
        const videoUrls = [
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=9bZkp7q19f0',
            'https://www.youtube.com/watch?v=JGwWNGJdvx8',
            'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
            'https://www.youtube.com/watch?v=RgKAFK5djSk'
        ];
        
        // Generate random index
        const randomIndex = Math.floor(Math.random() * titles.length);
        
        // Fill basic fields with random data
        const titleInput = document.getElementById('alLessonTitle');
        if (titleInput) titleInput.value = titles[randomIndex];

        const descInput = document.getElementById('alShortDescription');
        if (descInput) descInput.value = descriptions[randomIndex];

        // Fill competency (text input)
        const competencyInput = document.getElementById('alCompetency');
        if (competencyInput) {
            competencyInput.value = competencies[Math.floor(Math.random() * competencies.length)];
        }

        // Fill level select
        const levelSelect = document.getElementById('alLevel');
        if (levelSelect) levelSelect.value = levels[Math.floor(Math.random() * levels.length)];

        // Fill module (text input)
        const moduleInput = document.getElementById('alModule');
        if (moduleInput) {
            moduleInput.value = modules[Math.floor(Math.random() * modules.length)];
        }

        // Fill grades select
        const gradesSelect = document.getElementById('alApplicableGrades');
        if (gradesSelect) gradesSelect.value = grades[Math.floor(Math.random() * grades.length)];

        // Activate toggles
        const statusToggle = document.getElementById('alStatusToggle');
        if (statusToggle && !statusToggle.classList.contains('active')) {
            statusToggle.classList.add('active');
            const hiddenInput = document.getElementById('alIsPublished');
            if (hiddenInput) hiddenInput.value = 'true';
        }

        const recToggle = document.getElementById('alRecToggle');
        if (recToggle && Math.random() > 0.5 && !recToggle.classList.contains('active')) {
            recToggle.classList.add('active');
            const hiddenInput = document.getElementById('alRecommendLow');
            if (hiddenInput) hiddenInput.value = 'true';
        }

        // Add a random sample video URL
        const videoUrlInput = document.querySelector('.al-video-url-input');
        const addUrlBtn = document.querySelector('.al-add-url-btn');
        if (videoUrlInput && addUrlBtn) {
            videoUrlInput.value = videoUrls[Math.floor(Math.random() * videoUrls.length)];
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
        'mixed': createMixedContent(),
        'resources': createResourcesContent()
    };

    // Get the hidden input for primary content type
    const primaryContentTypeInput = document.getElementById('alPrimaryContentType');

    // Initialize with the active tab's content or default to video
    const activeTab = document.querySelector('.al-lesson-tabs button.active');
    const initialContentType = activeTab ? activeTab.getAttribute('data-content-type') : 'video';
    updateContentArea(initialContentType, contentAreas[initialContentType]);

    // Don't call updateTabStates on initial load - let all tabs be clickable initially
    // Tab states will be updated when content is actually added

    // Ensure all tabs are enabled on page load
    tabButtons.forEach(btn => {
        btn.classList.remove('disabled');
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.pointerEvents = 'auto';
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Check if the tab is disabled
            if (this.classList.contains('disabled')) {
                return; // Don't allow clicking disabled tabs
            }

            // Sync ALL content before switching tabs
            syncAllContent();

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update content area based on selected tab
            const selectedTab = this.getAttribute('data-content-type');
            updateContentArea(selectedTab, contentAreas[selectedTab]);

            // Update hidden input for primary content type
            // Only set primary_content_type for main content types (video, article, quiz)
            // Resources/mixed is supplementary and should NOT change primary_content_type
            if (primaryContentTypeInput && selectedTab !== 'mixed') {
                primaryContentTypeInput.value = selectedTab;
            }

            // Update tab states based on content type restrictions
            updateTabStates(selectedTab);
        });
    });
    
    // Function to check if content has been added to any content type
    function hasContentAdded() {
        // Check if video URLs have been added
        if (videoItems.length > 0) {
            return { hasContent: true, type: 'video' };
        }

        // Check if article content has been added
        const articleEditor = document.getElementById('alArticleEditor');
        if (articleEditor && articleEditor.innerHTML.trim() &&
            articleEditor.innerHTML !== '<br>' &&
            articleEditor.innerHTML.trim() !== '') {
            return { hasContent: true, type: 'article' };
        }

        // Check if quiz questions have been added
        const quizContainer = document.getElementById('alQuizContainer');
        if (quizContainer) {
            const questionInputs = quizContainer.querySelectorAll('input[type="text"]');
            for (let input of questionInputs) {
                if (input.value.trim() !== '') {
                    return { hasContent: true, type: 'quiz' };
                }
            }
        }

        // Check if resources have been added
        if (resourceItems.length > 0) {
            return { hasContent: true, type: 'mixed' };
        }

        return { hasContent: false, type: null };
    }

    // Function to update tab states based on content type restrictions
    function updateTabStates(selectedContentType) {
        const tabs = document.querySelectorAll('.al-lesson-tabs button');
        const contentCheck = hasContentAdded();

        // Remove all disabled states first
        tabs.forEach(tab => {
            tab.classList.remove('disabled');
            tab.style.opacity = '1';
            tab.style.cursor = 'pointer';
            tab.style.pointerEvents = 'auto';
        });

        // Only apply restrictions if content has been added
        if (!contentCheck.hasContent) {
            return; // Allow all tabs if no content has been added yet
        }

        // Apply restrictions based on what content type has content
        const activeContentType = contentCheck.type;

        tabs.forEach(tab => {
            const contentType = tab.getAttribute('data-content-type');

            // Skip the currently active tab
            if (contentType === selectedContentType) {
                return;
            }

            let shouldDisable = false;

            // Content type rules:
            // - Video: Can have Resources, disable Article and Quiz
            // - Article: Can have Resources, disable Video and Quiz
            // - Quiz: Cannot have any other content type, disable all
            // - Resources: Can be with Video or Article, disable Quiz

            if (activeContentType === 'quiz') {
                // Quiz content exists: disable all other tabs
                shouldDisable = true;
            } else if (activeContentType === 'article') {
                // Article content exists: only allow Resources, disable Video and Quiz
                if (contentType === 'video' || contentType === 'quiz') {
                    shouldDisable = true;
                }
            } else if (activeContentType === 'video') {
                // Video content exists: only allow Resources, disable Article and Quiz
                if (contentType === 'article' || contentType === 'quiz') {
                    shouldDisable = true;
                }
            } else if (activeContentType === 'mixed') {
                // Resources content exists: only allow Video and Article, disable Quiz
                if (contentType === 'quiz') {
                    shouldDisable = true;
                }
            }

            if (shouldDisable) {
                tab.classList.add('disabled');
                tab.style.opacity = '0.4';
                tab.style.cursor = 'not-allowed';
                tab.style.pointerEvents = 'none';
            }
        });
    }

    // Function to sync all content types to hidden inputs
    function syncAllContent() {
        // Sync article content
        const articleEditor = document.getElementById('alArticleEditor');
        const articleInput = document.getElementById('alArticleContentInput');
        if (articleEditor && articleInput) {
            const content = articleEditor.innerHTML;
            if (content && content !== '<br>' && content.trim() !== '') {
                articleInput.value = content;
            }
        }

        // Sync video URLs
        syncVideoUrls();

        // Sync quiz data
        syncQuizData();
    }

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

    // Resources content (renamed from Mixed)
    function createMixedContent() {
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
        } else if (tabName === 'quiz') {
            attachQuizHandlers();
        } else if (tabName === 'resources' || tabName === 'mixed') {
            attachResourceHandlers();
        }
    }
    
    // Quiz handlers
    function attachQuizHandlers() {
        // Load existing quiz data (for edit page)
        const existingQuizData = document.getElementById('alExistingQuizData');
        const quizDataInput = document.getElementById('alQuizDataInput');
        const quizContainer = document.getElementById('alQuizContainer');
        
        if (quizContainer) {
            let quizData = null;
            
            if (existingQuizData && existingQuizData.value) {
                try {
                    quizData = JSON.parse(existingQuizData.value);
                } catch (e) {}
            } else if (quizDataInput && quizDataInput.value) {
                try {
                    quizData = JSON.parse(quizDataInput.value);
                } catch (e) {}
            }
            
            if (quizData && Array.isArray(quizData) && quizData.length > 0) {
                // Clear default question and load saved questions
                quizContainer.innerHTML = '';
                
                quizData.forEach((q, index) => {
                    const questionDiv = document.createElement('div');
                    questionDiv.className = 'al-quiz-question';
                    questionDiv.innerHTML = `
                        <div class="mb-3">
                            <label class="al-form-label">Question ${index + 1}</label>
                            <input type="text" class="al-form-control" placeholder="Enter your question" value="${q.question || ''}">
                        </div>
                        <div class="mb-2">
                            <label class="al-form-label">Correct Answer</label>
                            <select class="al-form-select">
                                <option ${q.correctAnswer === 'Option A' ? 'selected' : ''}>Option A</option>
                                <option ${q.correctAnswer === 'Option B' ? 'selected' : ''}>Option B</option>
                                <option ${q.correctAnswer === 'Option C' ? 'selected' : ''}>Option C</option>
                                <option ${q.correctAnswer === 'Option D' ? 'selected' : ''}>Option D</option>
                            </select>
                        </div>
                    `;
                    quizContainer.appendChild(questionDiv);
                });
            }
            
            // Add event listeners for syncing
            quizContainer.addEventListener('input', syncQuizData);
            quizContainer.addEventListener('change', syncQuizData);
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
                // Sync content after toolbar action
                syncArticleContent();
            });
        });
        
        // Load existing article content if available (for edit page)
        const existingContent = document.getElementById('alExistingArticleContent');
        const articleEditor = document.getElementById('alArticleEditor');
        const articleInput = document.getElementById('alArticleContentInput');
        
        if (articleEditor) {
            // Load existing content
            if (existingContent && existingContent.value) {
                articleEditor.innerHTML = existingContent.value;
            } else if (articleInput && articleInput.value) {
                articleEditor.innerHTML = articleInput.value;
            }
            
            // Sync content on multiple events for better reliability
            articleEditor.addEventListener('input', syncArticleContent);
            articleEditor.addEventListener('keyup', syncArticleContent);
            articleEditor.addEventListener('keydown', function() {
                setTimeout(syncArticleContent, 10);
            });
            articleEditor.addEventListener('blur', syncArticleContent);
            articleEditor.addEventListener('paste', function() {
                setTimeout(syncArticleContent, 10);
            });
            
            // Also sync periodically while editor is focused
            articleEditor.addEventListener('focus', function() {
                window.articleSyncInterval = setInterval(syncArticleContent, 500);
            });
            articleEditor.addEventListener('blur', function() {
                if (window.articleSyncInterval) {
                    clearInterval(window.articleSyncInterval);
                }
            });
        }
    }
    
    // Function to sync article editor content to hidden input
    function syncArticleContent() {
        const articleEditor = document.getElementById('alArticleEditor');
        const articleInput = document.getElementById('alArticleContentInput');
        if (articleEditor && articleInput) {
            const content = articleEditor.innerHTML;
            // Only update if content is not empty placeholder
            if (content && content !== '<br>' && content.trim() !== '') {
                articleInput.value = content;
            }
        }

        // Update tab states when article content is added/modified
        const activeTab = document.querySelector('.al-lesson-tabs button.active');
        if (activeTab) {
            updateTabStates(activeTab.getAttribute('data-content-type'));
        }
    }
    
    // Function to sync video URLs to hidden input
    function syncVideoUrls() {
        const videoUrlsInput = document.getElementById('alVideoUrlsInput');
        if (videoUrlsInput && videoItems.length > 0) {
            const urls = videoItems.map(item => item.name);
            videoUrlsInput.value = JSON.stringify(urls);
        }
    }
    
    // Function to sync quiz data to hidden input
    function syncQuizData() {
        const quizDataInput = document.getElementById('alQuizDataInput');
        const quizContainer = document.getElementById('alQuizContainer');

        if (quizDataInput && quizContainer) {
            const questions = [];
            const questionDivs = quizContainer.querySelectorAll('.al-quiz-question');

            questionDivs.forEach((qDiv, index) => {
                const questionInput = qDiv.querySelector('input[type="text"]');
                const answerSelect = qDiv.querySelector('select');

                if (questionInput && questionInput.value.trim()) {
                    questions.push({
                        question: questionInput.value.trim(),
                        correctAnswer: answerSelect ? answerSelect.value : 'Option A',
                        questionNumber: index + 1
                    });
                }
            });

            if (questions.length > 0) {
                quizDataInput.value = JSON.stringify(questions);
            }
        }

        // Update tab states when quiz data is added/modified
        const activeTab = document.querySelector('.al-lesson-tabs button.active');
        if (activeTab) {
            updateTabStates(activeTab.getAttribute('data-content-type'));
        }
    }

    // Video upload functionality
    // videoItems is now declared at the top of the file

    function attachVideoHandlers() {
        const uploadBox = document.querySelector('.al-video-upload-box');
        const addUrlBtn = document.querySelector('.al-add-url-btn');
        const urlInput = document.querySelector('.al-video-url-input');
        const videoList = document.getElementById('alVideoList');

        // Re-render existing video items from videoItems array
        if (videoList) {
            videoList.innerHTML = ''; // Clear the list first

            // If there are existing items in the array, re-render them
            if (videoItems.length > 0) {
                videoItems.forEach(item => {
                    renderVideoItem(item);
                });
            } else {
                // Load existing video URLs (for edit page) - only on first load
                const existingVideoUrls = document.getElementById('alExistingVideoUrls');
                const videoUrlsInput = document.getElementById('alVideoUrlsInput');

                let urlsToLoad = null;

                // Try existing video URLs first
                if (existingVideoUrls && existingVideoUrls.value && existingVideoUrls.value.trim()) {
                    try {
                        urlsToLoad = JSON.parse(existingVideoUrls.value);
                    } catch (e) {
                        // If not JSON, treat as comma-separated
                        urlsToLoad = existingVideoUrls.value.split(',').map(u => u.trim()).filter(u => u);
                    }
                } else if (videoUrlsInput && videoUrlsInput.value && videoUrlsInput.value.trim()) {
                    try {
                        urlsToLoad = JSON.parse(videoUrlsInput.value);
                    } catch (e) {
                        // Ignore parse errors
                    }
                }

                if (urlsToLoad && Array.isArray(urlsToLoad)) {
                    urlsToLoad.forEach(url => {
                        if (url && url.trim()) {
                            addVideoItem(url.trim(), 'url', null);
                        }
                    });
                }
            }
        }

        // File upload handler
        if (uploadBox && !uploadBox.hasAttribute('data-handler-attached')) {
            uploadBox.setAttribute('data-handler-attached', 'true');
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
        if (addUrlBtn && !addUrlBtn.hasAttribute('data-handler-attached')) {
            addUrlBtn.setAttribute('data-handler-attached', 'true');
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
        }
        
        // URL input keypress handler
        if (urlInput && !urlInput.hasAttribute('data-handler-attached')) {
            urlInput.setAttribute('data-handler-attached', 'true');
            urlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const btn = document.querySelector('.al-add-url-btn');
                    if (btn) btn.click();
                }
            });
        }
    }

    function isValidVideoURL(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
        return youtubeRegex.test(url) || vimeoRegex.test(url);
    }

    // Function to render a single video item (used for re-rendering)
    function renderVideoItem(item) {
        const videoList = document.getElementById('alVideoList');
        if (!videoList) return;

        const videoItem = document.createElement('div');
        videoItem.className = 'al-video-item';
        videoItem.dataset.videoId = item.id;

        const icon = item.type === 'file' ? 'video_file' : 'link';

        videoItem.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2 flex-grow-1">
                    <span class="material-symbols-outlined">${icon}</span>
                    <div class="flex-grow-1">
                        <div class="fw-medium" style="font-size: 14px;">${item.name}</div>
                        <small class="text-muted">${item.type === 'file' ? 'Video File' : 'Video URL'}</small>
                    </div>
                </div>
                <button type="button" class="al-remove-btn" onclick="removeVideoItem(${item.id})">
                    <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
                </button>
            </div>
        `;

        // Mark as uploaded if it was already uploaded
        if (item.type === 'file' && item.uploaded !== false) {
            videoItem.classList.add('uploaded');
        }

        videoList.appendChild(videoItem);
    }

    function addVideoItem(name, type, fileData) {
        const videoId = Date.now() + Math.random();
        const item = { id: videoId, name, type, fileData, uploaded: false };
        videoItems.push(item);

        // IMMEDIATELY sync video URLs to hidden input when video is added
        syncVideoUrls();
        console.log('Video added, total videos:', videoItems.length);

        // Update tab states when video is added
        const activeTab = document.querySelector('.al-lesson-tabs button.active');
        if (activeTab) {
            updateTabStates(activeTab.getAttribute('data-content-type'));
        }

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
            // Mark as uploaded when done
            setTimeout(() => {
                item.uploaded = true;
            }, 3000);
        } else {
            item.uploaded = true;
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

        // Update tab states when video is removed
        const activeTab = document.querySelector('.al-lesson-tabs button.active');
        if (activeTab) {
            updateTabStates(activeTab.getAttribute('data-content-type'));
        }
    };

    // Resource upload functionality
    // resourceItems is now declared at the top of the file

    function attachResourceHandlers() {
        const uploadBox = document.querySelector('.al-resource-upload-box');
        const resourceList = document.getElementById('alResourceList');

        // Re-render existing resource items from resourceItems array
        if (resourceList) {
            resourceList.innerHTML = ''; // Clear the list first

            // If there are existing items in the array, re-render them
            if (resourceItems.length > 0) {
                resourceItems.forEach(item => {
                    renderResourceItem(item);
                });
            }
        }

        if (uploadBox && !uploadBox.hasAttribute('data-handler-attached')) {
            uploadBox.setAttribute('data-handler-attached', 'true');
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

    // Function to render a single resource item (used for re-rendering)
    function renderResourceItem(item) {
        const resourceList = document.getElementById('alResourceList');
        if (!resourceList) return;

        const resourceItem = document.createElement('div');
        resourceItem.className = 'al-resource-item d-flex align-items-center justify-content-between';
        resourceItem.dataset.resourceId = item.id;

        const icon = getFileIcon(item.extension);
        const fileSize = formatFileSize(item.size);

        resourceItem.innerHTML = `
            <div class="d-flex align-items-center gap-3 flex-grow-1">
                <span class="material-symbols-outlined" style="font-size: 32px; color: var(--primary);">${icon}</span>
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <div class="fw-medium" style="font-size: 14px;">${item.name}</div>
                        <span class="al-resource-badge">${item.type}</span>
                    </div>
                    <small class="text-muted">${fileSize}</small>
                </div>
            </div>
            <button type="button" class="al-remove-btn" onclick="removeResourceItem(${item.id})">
                <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
        `;

        resourceList.appendChild(resourceItem);
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

        // Create a hidden file input and add it to the form
        const form = document.getElementById('alLessonForm');
        if (form) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.name = 'resources';  // Multiple files with same name
            fileInput.style.display = 'none';
            fileInput.id = `resource-input-${resourceId}`;
            fileInput.dataset.resourceId = resourceId;

            // Create a DataTransfer to set the file
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            form.appendChild(fileInput);
        }

        // Update tab states when resource is added
        const activeTab = document.querySelector('.al-lesson-tabs button.active');
        if (activeTab) {
            updateTabStates(activeTab.getAttribute('data-content-type'));
        }

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

        // Remove the hidden file input from the form
        const fileInput = document.getElementById(`resource-input-${resourceId}`);
        if (fileInput) {
            fileInput.remove();
        }

        // Update tab states when resource is removed
        const activeTab = document.querySelector('.al-lesson-tabs button.active');
        if (activeTab) {
            updateTabStates(activeTab.getAttribute('data-content-type'));
        }
    };

    // Quiz question management
    // questionCount is now declared at the top of the file

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

            // Update corresponding hidden input based on data-field attribute
            const field = this.getAttribute('data-field');
            if (field) {
                let hiddenInput = null;
                if (field === 'is_published') {
                    hiddenInput = document.getElementById('alIsPublished');
                } else if (field === 'recommend_low_competency') {
                    hiddenInput = document.getElementById('alRecommendLow');
                }

                if (hiddenInput) {
                    hiddenInput.value = this.classList.contains('active') ? 'true' : 'false';
                }
            }
        });
    });

    // ================= Action Buttons =================
    const publishBtn = document.getElementById('alPublishBtn');
    const saveDraftBtn = document.getElementById('alSaveDraftBtn');
    const cancelBtn = document.getElementById('alCancelBtn');

    // Function to sync ALL content to hidden inputs before form submission
    function syncAllContentBeforeSubmit() {
        // Sync article content
        const articleEditor = document.getElementById('alArticleEditor');
        const articleInput = document.getElementById('alArticleContentInput');
        if (articleEditor && articleInput) {
            const content = articleEditor.innerHTML;
            if (content && content !== '<br>' && content.trim() !== '') {
                articleInput.value = content;
            }
        }
        
        // Sync video URLs from videoItems array
        const videoUrlsInput = document.getElementById('alVideoUrlsInput');
        if (videoUrlsInput && videoItems.length > 0) {
            const urls = videoItems.map(item => item.name);
            videoUrlsInput.value = JSON.stringify(urls);
        }
        
        // Sync quiz data
        const quizDataInput = document.getElementById('alQuizDataInput');
        const quizContainer = document.getElementById('alQuizContainer');
        if (quizDataInput && quizContainer) {
            const questions = [];
            const questionDivs = quizContainer.querySelectorAll('.al-quiz-question');
            questionDivs.forEach((qDiv, index) => {
                const questionInput = qDiv.querySelector('input[type="text"]');
                const answerSelect = qDiv.querySelector('select');
                if (questionInput && questionInput.value.trim()) {
                    questions.push({
                        question: questionInput.value.trim(),
                        correctAnswer: answerSelect ? answerSelect.value : 'Option A',
                        questionNumber: index + 1
                    });
                }
            });
            if (questions.length > 0) {
                quizDataInput.value = JSON.stringify(questions);
            }
        }

        // IMPORTANT: Set primary_content_type based on actual content
        // Check multiple sources for content existence
        const primaryContentTypeInput = document.getElementById('alPrimaryContentType');
        if (primaryContentTypeInput) {
            // Check for video content - array OR hidden input
            const hasVideos = videoItems.length > 0 || 
                (videoUrlsInput && videoUrlsInput.value && videoUrlsInput.value.trim() !== '' && videoUrlsInput.value !== '[]');
            
            // Check for article content
            const hasArticle = articleInput && articleInput.value && 
                articleInput.value.trim() !== '' && articleInput.value !== '<br>';
            
            // Check for quiz content
            const hasQuiz = quizDataInput && quizDataInput.value && 
                quizDataInput.value.trim() !== '' && quizDataInput.value !== '[]';
            
            // Check for resources
            const hasResources = resourceItems.length > 0;
            
            // Priority: Video > Article > Quiz > Resources
            if (hasVideos) {
                primaryContentTypeInput.value = 'video';
            } else if (hasArticle) {
                primaryContentTypeInput.value = 'article';
            } else if (hasQuiz) {
                primaryContentTypeInput.value = 'quiz';
            } else if (hasResources) {
                primaryContentTypeInput.value = 'mixed';
            }
            
            console.log('Video items:', videoItems.length, 'Video input:', videoUrlsInput ? videoUrlsInput.value : 'null');
            console.log('Primary content type set to:', primaryContentTypeInput.value);
        }

        console.log('All content synced before submit');
    }

    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            const title = document.getElementById('alLessonTitle').value.trim();

            if (!title) {
                alert('Please fill in the Lesson Title');
                return;
            }

            // Sync ALL content before submitting
            syncAllContentBeforeSubmit();

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

            // Sync ALL content before submitting
            syncAllContentBeforeSubmit();

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

    // Also handle form submit event (for edit page which uses submit buttons directly)
    const lessonForm = document.getElementById('alLessonForm');
    if (lessonForm) {
        lessonForm.addEventListener('submit', function(e) {
            syncAllContentBeforeSubmit();
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
