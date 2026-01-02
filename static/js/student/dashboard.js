// ============================================
// STUDENT DASHBOARD JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Student Dashboard loaded successfully');

    // Initialize all dashboard components
    initializeDashboard();
    initializeCounters();
    initializeCalendar();
    initializeQuiz();
});

// ============================================
// DASHBOARD INITIALIZATION
// ============================================
function initializeDashboard() {
    // Fetch and display student statistics
    fetchStudentCount();
}

// ============================================
// ANIMATED COUNTER FUNCTION
// ============================================
function animateCounter(element, start, end, duration, suffix = '') {
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }

        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// ============================================
// INITIALIZE COUNTERS
// ============================================
function initializeCounters() {
    // Student Count Counter
    const studentCountElement = document.getElementById('studentCount');
    if (studentCountElement) {
        // Start animation after a short delay
        setTimeout(() => {
            animateCounter(studentCountElement, 0, 0, 1500, '+');
        }, 500);
    }

    // Animate any other counters on the page
    animateVisibleCounters();
}

// ============================================
// ANIMATE VISIBLE COUNTERS ON SCROLL
// ============================================
function animateVisibleCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-counter')) || 0;
                const suffix = target.getAttribute('data-suffix') || '';

                animateCounter(target, 0, endValue, 1500, suffix);
                target.classList.add('counted');
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// FETCH STUDENT COUNT FROM API
// ============================================
async function fetchStudentCount() {
    try {
        // TODO: Replace with actual API endpoint when available
        // const response = await fetch('/api/student/stats/');
        // const data = await response.json();

        // Placeholder data for now
        const data = {
            total_students: 1250,
            active_students: 1180,
            new_students_this_month: 45
        };

        // Update the counter with real data
        const studentCountElement = document.getElementById('studentCount');
        if (studentCountElement) {
            setTimeout(() => {
                animateCounter(studentCountElement, 0, data.total_students, 2000, '+');
            }, 500);
        }

    } catch (error) {
        console.error('Error fetching student count:', error);

        // Fallback to default value
        const studentCountElement = document.getElementById('studentCount');
        if (studentCountElement) {
            studentCountElement.textContent = '0+';
        }
    }
}

// ============================================
// CALENDAR FUNCTIONALITY
// ============================================
function initializeCalendar() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const monthTitle = document.querySelector('.stud-dash-calendar-month-title');

    if (!prevBtn || !nextBtn || !monthTitle) return;

    let currentDate = new Date();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function updateCalendar() {
        const monthName = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        monthTitle.textContent = `${monthName} ${year}`;
    }

    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();

        // Add animation
        monthTitle.style.opacity = '0';
        setTimeout(() => {
            monthTitle.style.transition = 'opacity 0.3s ease';
            monthTitle.style.opacity = '1';
        }, 100);
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();

        // Add animation
        monthTitle.style.opacity = '0';
        setTimeout(() => {
            monthTitle.style.transition = 'opacity 0.3s ease';
            monthTitle.style.opacity = '1';
        }, 100);
    });

    // Initialize with current month
    updateCalendar();
}

// ============================================
// QUIZ FUNCTIONALITY
// ============================================
function initializeQuiz() {
    const quizStartBtn = document.querySelector('.stud-dash-quiz-start-btn');

    if (!quizStartBtn) return;

    quizStartBtn.addEventListener('click', () => {
        // TODO: Implement quiz start functionality
        console.log('Starting quiz...');

        // Show loading state
        quizStartBtn.innerHTML = `
            <span class="material-symbols-outlined">hourglass_empty</span>
            Loading Quiz...
        `;
        quizStartBtn.disabled = true;

        // Simulate quiz loading (replace with actual quiz navigation)
        setTimeout(() => {
            quizStartBtn.innerHTML = `
                <span class="material-symbols-outlined">play_arrow</span>
                Start Quiz
            `;
            quizStartBtn.disabled = false;

            // TODO: Navigate to quiz page or open quiz modal
            alert('Quiz feature will be implemented soon!');
        }, 1500);
    });
}

// ============================================
// SMOOTH SCROLL ANIMATIONS
// ============================================
function initializeSmoothScroll() {
    const cards = document.querySelectorAll('.stud-dash-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ============================================
// XP PROGRESS ANIMATION
// ============================================
function animateXPProgress() {
    const xpProgressFill = document.querySelector('.stud-dash-xp-progress-fill');

    if (!xpProgressFill) return;

    const targetWidth = xpProgressFill.style.width || '0%';

    // Reset to 0
    xpProgressFill.style.width = '0%';

    // Animate to target width
    setTimeout(() => {
        xpProgressFill.style.width = targetWidth;
    }, 500);
}

// ============================================
// BADGE UNLOCK ANIMATION
// ============================================
function unlockBadge(badgeElement) {
    if (!badgeElement) return;

    badgeElement.classList.remove('locked');
    badgeElement.style.animation = 'pulse 0.5s ease-in-out';

    setTimeout(() => {
        badgeElement.style.animation = '';
    }, 500);
}

// ============================================
// STREAK TRACKER
// ============================================
function updateStreak(days) {
    const currentStreakElement = document.querySelector('.stud-dash-streak-item:first-child .stud-dash-streak-value');

    if (!currentStreakElement) return;

    const currentStreak = parseInt(currentStreakElement.textContent) || 0;

    if (days > currentStreak) {
        animateCounter(currentStreakElement, currentStreak, days, 1000, ' Days');
    }
}

// ============================================
// LEADERBOARD RANK UPDATE
// ============================================
function updateLeaderboardRank(newRank, oldRank) {
    const rankNumberElement = document.querySelector('.stud-dash-rank-number');
    const rankChangeElement = document.querySelector('.stud-dash-rank-change');

    if (!rankNumberElement || !rankChangeElement) return;

    // Animate rank change
    rankNumberElement.textContent = `#${newRank}`;

    const change = oldRank - newRank;
    if (change > 0) {
        rankChangeElement.classList.add('positive');
        rankChangeElement.innerHTML = `
            <span class="material-symbols-outlined">trending_up</span>
            +${change} from last month
        `;
    } else if (change < 0) {
        rankChangeElement.classList.remove('positive');
        rankChangeElement.classList.add('negative');
        rankChangeElement.innerHTML = `
            <span class="material-symbols-outlined">trending_down</span>
            ${change} from last month
        `;
    }
}

// ============================================
// TOAST NOTIFICATION FOR ACHIEVEMENTS
// ============================================
function showAchievementToast(title, message, icon = 'workspace_premium') {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <span class="material-symbols-outlined">${icon}</span>
        <div>
            <h5>${title}</h5>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ============================================
// EVENT LISTENERS FOR INTERACTIVE ELEMENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize smooth scroll animations
    initializeSmoothScroll();

    // Animate XP progress on load
    setTimeout(() => {
        animateXPProgress();
    }, 1000);

    // Add click handlers for profile detail rows
    const detailRows = document.querySelectorAll('.stud-dash-detail-row');
    detailRows.forEach(row => {
        row.addEventListener('click', function() {
            const value = this.querySelector('.stud-dash-detail-value');
            if (value && value.classList.contains('blue')) {
                // TODO: Navigate to detail page
                console.log('Navigating to detail page...');
            }
        });
    });

    // Add click handlers for report links
    const reportLinks = document.querySelectorAll('.stud-dash-report-link');
    reportLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default if you want to handle navigation with JS
            // e.preventDefault();
            console.log('Opening report:', this.querySelector('.stud-dash-report-title').textContent);
        });
    });

    // Add hover effect for badge items
    const badgeItems = document.querySelectorAll('.stud-dash-badge-item:not(.locked)');
    badgeItems.forEach(badge => {
        badge.addEventListener('click', function() {
            showAchievementToast(
                'Badge Details',
                `You earned the ${this.querySelector('.stud-dash-badge-name').textContent} badge!`,
                'military_tech'
            );
        });
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate percentage
function calculatePercentage(value, total) {
    return ((value / total) * 100).toFixed(1);
}

// Update circular progress chart
function updateCircularProgress(svgElement, percentage) {
    if (!svgElement) return;

    const circle = svgElement.querySelector('circle:last-child');
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    circle.style.strokeDashoffset = offset;
}

// ============================================
// EXPORT FUNCTIONS FOR EXTERNAL USE
// ============================================
window.studentDashboard = {
    animateCounter,
    updateStreak,
    updateLeaderboardRank,
    showAchievementToast,
    unlockBadge,
    updateCircularProgress,
    formatNumber,
    calculatePercentage
};

console.log('Student Dashboard JS fully initialized');
