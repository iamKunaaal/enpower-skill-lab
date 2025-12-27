/* ============================================
   TEACHER DASHBOARD JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Set dashboard as active in sidebar
    const dashboardLink = document.getElementById('nav-dashboard');
    if (dashboardLink) {
        dashboardLink.classList.add('active');
    }

    // Initialize any dashboard-specific functionality
    initializeStatCounters();
    initializeTableInteractions();
}

// Animate stat counters on page load
function initializeStatCounters() {
    const statValues = document.querySelectorAll('.tc-stat-value');
    
    statValues.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        if (!isNaN(finalValue)) {
            animateCounter(stat, 0, finalValue, 1000);
        }
    });
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (range * easeOutQuart));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize table row interactions
function initializeTableInteractions() {
    const tableRows = document.querySelectorAll('.tc-table tbody tr');
    
    tableRows.forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function() {
            // Get student name from the row
            const studentName = this.querySelector('.tc-student-name');
            if (studentName) {
                console.log('Clicked on student:', studentName.textContent);
                // In production, this would navigate to student details
            }
        });
    });
}

// Utility function to format dates
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Utility function to format time
function formatTime(time) {
    return new Date('1970-01-01T' + time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
