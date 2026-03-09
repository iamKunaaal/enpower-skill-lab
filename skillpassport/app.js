// ===== HASH ROUTER & APP CONTROLLER =====

const routes = {
    '#/admin/competencies': renderScreen1,
    '#/admin/profiles': renderScreen2,
    '#/admin/projects': renderScreen3,
    '#/teacher/assessments': renderScreen4,
    '#/teacher/student': renderScreen5,
    '#/teacher/analytics': renderScreen6,
    '#/student/project-report': renderScreen7,
    '#/student/annual-passport': renderScreen8,
};

function navigateTo(hash) {
    window.location.hash = hash;
    // Close debug menu on nav
    const menu = document.getElementById('debug-menu');
    if (menu) menu.classList.remove('show');
    menu.style.display = 'none';
}

function toggleDebugMenu() {
    const menu = document.getElementById('debug-menu');
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        setTimeout(() => menu.style.display = 'none', 200);
    } else {
        menu.style.display = 'block';
        requestAnimationFrame(() => menu.classList.add('show'));
    }
}

function router() {
    const hash = window.location.hash || '#/admin/competencies';
    const app = document.getElementById('app');

    // Find route handler
    const renderFn = routes[hash];

    if (renderFn) {
        // Fade out
        app.style.opacity = '0';
        app.style.transform = 'translateY(8px)';

        setTimeout(() => {
            app.innerHTML = renderFn();
            app.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            app.style.opacity = '1';
            app.style.transform = 'translateY(0)';

            // Attach event listeners after render
            attachEventListeners(hash);

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 150);
    } else {
        // Default redirect
        window.location.hash = '#/admin/competencies';
    }
}

function attachEventListeners(hash) {
    switch (hash) {
        case '#/admin/competencies': attachScreen1Listeners(); break;
        case '#/admin/profiles': attachScreen2Listeners(); break;
        case '#/admin/projects': attachScreen3Listeners(); break;
        case '#/teacher/assessments': attachScreen4Listeners(); break;
        case '#/teacher/student': attachScreen5Listeners(); break;
        case '#/teacher/analytics': attachScreen6Listeners(); break;
        case '#/student/project-report': attachScreen7Listeners(); break;
        case '#/student/annual-passport': attachScreen8Listeners(); break;
    }
}

// Listen for hash changes
window.addEventListener('hashchange', router);

// Initial load
window.addEventListener('DOMContentLoaded', () => {
    if (!window.location.hash) {
        window.location.hash = '#/admin/competencies';
    } else {
        router();
    }
});

// Close debug menu when clicking outside
document.addEventListener('click', (e) => {
    const debugNav = document.getElementById('debug-nav');
    const menu = document.getElementById('debug-menu');
    if (debugNav && menu && !debugNav.contains(e.target)) {
        menu.classList.remove('show');
        menu.style.display = 'none';
    }
});
