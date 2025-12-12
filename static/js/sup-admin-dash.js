// Combined interactions for dashboard, header, and sidebar

document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeSidebar();
});

// Header functionality
function initializeHeader() {
    const userInfoToggle = document.getElementById('userInfoToggle');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationDropdownMenu = document.getElementById('notificationDropdownMenu');

    if (!userInfoToggle || !userDropdownMenu || !notificationToggle || !notificationDropdownMenu) {
        setTimeout(initializeHeader, 100);
        return;
    }

    userInfoToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('active');
        notificationDropdownMenu.classList.remove('active');
    });

    notificationToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdownMenu.classList.toggle('active');
        userDropdownMenu.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if (!userDropdownMenu.contains(e.target) && !userInfoToggle.contains(e.target)) {
            userDropdownMenu.classList.remove('active');
        }
        if (!notificationDropdownMenu.contains(e.target) && !notificationToggle.contains(e.target)) {
            notificationDropdownMenu.classList.remove('active');
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Add logout logic here
                // window.location.href = '/login';
            }
        });
    }

    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            toggleFullscreen();
        });
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement &&
        !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }

        const fullscreenIcon = document.querySelector('.fullscreen-btn .material-symbols-outlined');
        if (fullscreenIcon) {
            fullscreenIcon.textContent = 'fullscreen_exit';
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        const fullscreenIcon = document.querySelector('.fullscreen-btn .material-symbols-outlined');
        if (fullscreenIcon) {
            fullscreenIcon.textContent = 'fullscreen';
        }
    }
}

document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
document.addEventListener('MSFullscreenChange', updateFullscreenIcon);

function updateFullscreenIcon() {
    const fullscreenIcon = document.querySelector('.fullscreen-btn .material-symbols-outlined');
    if (fullscreenIcon) {
        if (document.fullscreenElement || document.webkitFullscreenElement ||
            document.mozFullScreenElement || document.msFullscreenElement) {
            fullscreenIcon.textContent = 'fullscreen_exit';
        } else {
            fullscreenIcon.textContent = 'fullscreen';
        }
    }
}

// Sidebar functionality
function initializeSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (!menuToggle || !closeSidebar || !sidebar || !sidebarOverlay) {
        setTimeout(initializeSidebar, 100);
        return;
    }

    function toggleSidebar() {
        if (window.innerWidth >= 1024) {
            sidebar.classList.toggle('collapsed');
        } else {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSidebarFunc() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', closeSidebarFunc);
    sidebarOverlay.addEventListener('click', closeSidebarFunc);

    const sidebarLinks = sidebar.querySelectorAll('.sidebar-dropdown-menu a, .sidebar-nav > a:not(.sidebar-dropdown-toggle)');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                closeSidebarFunc();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            closeSidebarFunc();
        } else {
            sidebar.classList.remove('collapsed');
        }
    });

    function setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = {
            // Dashboard
            '/super-admin/dashboard/': 'nav-dashboard',
            'dashboard.html': 'nav-dashboard',

            // Schools
            '/super-admin/schools/': 'nav-school-list',
            'school-list.html': 'nav-school-list',
            '/super-admin/onboard-school/': 'nav-add-school',
            'onboard-school.html': 'nav-add-school',
            'school-details.html': 'nav-school-details',

            // Users - School Admins
            'schooladmin-list.html': 'nav-school-admins',
            'onboard-school-admin.html': 'nav-add-school-admins',

            // Users - Program Coordinators
            'program-coordinator-list.html': 'nav-program-coordinators',
            'onboard-pc.html': 'nav-add-program-coordinators',

            // Users - Thinking Coaches
            'teacher-list.html': 'nav-thinking-coaches',
            'add-teacher.html': 'nav-add-thinking-coaches',

            // Users - Students
            'student-list.html': 'nav-students-list',
            'add-student.html': 'nav-add-student',

            // Users - Parents
            'parent-list.html': 'nav-parent-list',
            'onboard-parent.html': 'nav-add-parent',

            // Users - Bulk Upload
            'bulk-upload.html': 'nav-bulk-upload',

            // Academics
            'learning-pillars.html': 'nav-learning-pillars',
            'competencies.html': 'nav-competencies',
            'profiles.html': 'nav-profiles',
            'weightage-mapping.html': 'nav-weightage-mapping',
            'academic-year-locking.html': 'nav-academic-year-locking',

            // LMS Management
            'lessons-library.html': 'nav-lessons-library',
            'add-lesson.html': 'nav-add-lesson',
            'categories-modules.html': 'nav-categories-modules',

            // Monitoring
            'assessment-monitoring.html': 'nav-assessment-monitoring',
            'attendance-monitoring.html': 'nav-attendance-monitoring',
            'lms-monitoring.html': 'nav-lms-monitoring',
            'multi-school-comparison.html': 'nav-multi-school-comparison',

            // Reports & Analytics
            'platform-analytics.html': 'nav-platform-analytics',
            'download-reports.html': 'nav-download-reports',

            // Settings
            'system-settings.html': 'nav-system-settings',
            'terms-privacy.html': 'nav-terms-privacy',
            'billing.html': 'nav-billing',

            // My Account
            'profile.html': 'nav-profile',
            'change-password.html': 'nav-change-password'
        };

        // Remove all active classes from links
        sidebarLinks.forEach(link => link.classList.remove('active'));

        // Remove all active classes from dropdown toggles
        document.querySelectorAll('.sidebar-dropdown-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });

        // Add active class to current page link
        // Try full path first, then fallback to filename
        const currentPage = currentPath.split('/').pop();
        const linkId = navLinks[currentPath] || navLinks[currentPage];
        
        console.log('Current path:', currentPath);
        console.log('Link ID found:', linkId);
        
        if (linkId) {
            const activeLink = document.getElementById(linkId);
            if (activeLink) {
                activeLink.classList.add('active');
                console.log('Active link found:', activeLink);

                // Also add active class to parent dropdown toggle if link is inside a dropdown
                const parentDropdown = activeLink.closest('.sidebar-dropdown');
                if (parentDropdown) {
                    const dropdownToggle = parentDropdown.querySelector('.sidebar-dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                        console.log('Parent dropdown toggle activated:', dropdownToggle);
                    }
                }
            }
        }
    }

    setActiveLink();
    initializeDropdowns();
}

function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.sidebar-dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();

            const dropdown = this.closest('.sidebar-dropdown');
            const isActive = dropdown.classList.contains('active');

            document.querySelectorAll('.sidebar-dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });

            if (isActive) {
                dropdown.classList.remove('active');
            } else {
                dropdown.classList.add('active');
            }
        });
    });

    const activeDropdownLinks = document.querySelectorAll('.sidebar-dropdown-menu a');
    activeDropdownLinks.forEach(link => {
        if (link.classList.contains('active')) {
            const dropdown = link.closest('.sidebar-dropdown');
            if (dropdown) {
                dropdown.classList.add('active');
            }
        }
    });
}
