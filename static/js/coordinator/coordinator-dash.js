/* ============================================
   COORDINATOR DASHBOARD JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initCoordDashboard();
});

function initCoordDashboard() {
    // Initialize any dashboard-specific functionality here
    
    // Animate stat cards on load
    animateStatCards();
    
    // Initialize progress bars
    animateProgressBars();
    
    // Initialize quick action buttons
    initQuickActions();
}

// Animate stat cards with a stagger effect
function animateStatCards() {
    const statCards = document.querySelectorAll('.coord-dash-stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.coord-dash-trend-progress-fill, .coord-dash-teacher-summary-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Initialize quick action buttons
function initQuickActions() {
    const quickActions = document.querySelectorAll('.coord-dash-quick-action-btn');
    
    quickActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.querySelector('span:last-child').textContent;
            console.log('Quick action clicked:', actionText);
            // Add specific action handlers here
        });
    });
}

// Export report functionality
function exportReport() {
    console.log('Exporting report...');
    // Add export logic here
}

// Review alert functionality
function reviewAlert(alertId) {
    console.log('Reviewing alert:', alertId);
    // Add review logic here
}
