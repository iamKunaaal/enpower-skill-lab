// School Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeHeader();
});

function initializeSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (!menuToggle || !sidebar) return;

    function toggleSidebar() {
        if (window.innerWidth >= 1024) {
            sidebar.classList.toggle('collapsed');
        } else {
            sidebar.classList.add('active');
            if (sidebarOverlay) sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSidebarFunc() {
        sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', toggleSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebarFunc);

    // Close sidebar on mobile when clicking actual page links
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

    // Initialize dropdowns
    initializeDropdowns();
}

function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.sidebar-dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.sidebar-dropdown');
            const isActive = dropdown.classList.contains('active');

            // Close all other dropdowns
            document.querySelectorAll('.sidebar-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });

            // Toggle current dropdown
            dropdown.classList.toggle('active', !isActive);
        });
    });

    // Keep dropdown open if a child link is active
    document.querySelectorAll('.sidebar-dropdown-menu a.active').forEach(link => {
        const dropdown = link.closest('.sidebar-dropdown');
        if (dropdown) dropdown.classList.add('active');
    });
}

function initializeHeader() {
    // User dropdown toggle
    const userInfoToggle = document.getElementById('userInfoToggle');
    const userDropdownMenu = document.getElementById('userDropdownMenu');

    // Notification dropdown toggle
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationDropdownMenu = document.getElementById('notificationDropdownMenu');

    if (userInfoToggle && userDropdownMenu) {
        userInfoToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('active');
            if (notificationDropdownMenu) notificationDropdownMenu.classList.remove('active');
        });
    }

    if (notificationToggle && notificationDropdownMenu) {
        notificationToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdownMenu.classList.toggle('active');
            if (userDropdownMenu) userDropdownMenu.classList.remove('active');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (userDropdownMenu && userInfoToggle && 
            !userDropdownMenu.contains(e.target) && !userInfoToggle.contains(e.target)) {
            userDropdownMenu.classList.remove('active');
        }
        if (notificationDropdownMenu && notificationToggle && 
            !notificationDropdownMenu.contains(e.target) && !notificationToggle.contains(e.target)) {
            notificationDropdownMenu.classList.remove('active');
        }
    });

    // Fullscreen functionality
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
}

function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function updateFullscreenIcon() {
    const fullscreenIcon = document.querySelector('.fullscreen-btn .material-symbols-outlined');
    if (fullscreenIcon) {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            fullscreenIcon.textContent = 'fullscreen_exit';
        } else {
            fullscreenIcon.textContent = 'fullscreen';
        }
    }
}

// ============================================
// DASHBOARD CHARTS
// ============================================
function initializeDashboardCharts() {
    // Student Attendance Trend Chart (Line Chart)
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        new Chart(attendanceCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Attendance %',
                    data: [92, 94, 91, 95, 93, 97],
                    borderColor: '#5A1F6E',
                    backgroundColor: 'rgba(90, 31, 110, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#5A1F6E',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Attendance: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 85,
                        max: 100,
                        ticks: {
                            callback: function(value) { return value + '%'; },
                            color: '#6b7280',
                            font: { size: 11, family: 'Poppins' }
                        },
                        grid: { color: '#f3f4f6', drawBorder: false }
                    },
                    x: {
                        ticks: { color: '#6b7280', font: { size: 11, family: 'Poppins' } },
                        grid: { display: false, drawBorder: false }
                    }
                }
            }
        });
    }

    // Class-wise Assessment Performance Chart (Bar Chart)
    const assessmentCtx = document.getElementById('assessmentChart');
    if (assessmentCtx) {
        new Chart(assessmentCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
                datasets: [{
                    label: 'Performance %',
                    data: [85, 78, 92, 88, 82, 86, 90, 84],
                    backgroundColor: '#5A1F6E',
                    borderRadius: 6,
                    barThickness: 30
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Performance: ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        ticks: {
                            callback: function(value) { return value + '%'; },
                            color: '#6b7280',
                            font: { size: 11, family: 'Poppins' }
                        },
                        grid: { color: '#f3f4f6', drawBorder: false }
                    },
                    x: {
                        ticks: { color: '#6b7280', font: { size: 10, family: 'Poppins' } },
                        grid: { display: false, drawBorder: false }
                    }
                }
            }
        });
    }
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboardCharts();
});
