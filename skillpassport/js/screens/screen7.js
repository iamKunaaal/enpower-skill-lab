// ===== SCREEN 7: Project Completion Report =====

function renderScreen7() {
    const data = getData();

    return `
    <div class="min-h-screen bg-background-light">
        <!-- Header -->
        <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div class="max-w-6xl mx-auto flex items-center justify-between px-8 py-3">
                <div class="flex items-center gap-3">
                    <img src="enpower-logo.svg" class="h-8 w-auto" alt="Skill Passport" />
                    <h1 class="text-xl font-bold tracking-tight">Project Report</h1>
                </div>
                <div class="flex items-center gap-4">
                    <nav class="hidden md:flex items-center gap-6">
                        <a onclick="navigateTo('#/admin/competencies')" class="text-sm font-medium text-slate-600 hover:text-primary cursor-pointer">Dashboard</a>
                        <a onclick="navigateTo('#/teacher/analytics')" class="text-sm font-medium text-slate-600 hover:text-primary cursor-pointer">Analytics</a>
                        <a class="text-sm font-bold text-primary">Reports</a>
                    </nav>
                    <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border-2 border-primary/30">AT</div>
                </div>
            </div>
        </header>
        <main class="max-w-6xl mx-auto px-8 py-10">
            <!-- Title Section -->
            <div class="mb-12">
                <div class="flex items-center gap-3 text-sm text-slate-500 mb-2">
                    <span class="material-symbols-outlined text-sm">folder_open</span>
                    <span>Grade 10 — Section B</span>
                    <span class="material-symbols-outlined text-xs">chevron_right</span>
                    <span class="font-medium text-primary">Fall 2024</span>
                </div>
                <h1 class="text-4xl font-black tracking-tight mb-3">Sustainable Urban Development Capstone</h1>
                <p class="text-lg text-slate-500 font-medium">Project Completion Report — ${data.analytics.studentName}</p>
            </div>
            <!-- Top Skills -->
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">workspace_premium</span>
                    Top Skills Demonstrated
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    ${[
            { name: 'Communication', icon: 'chat', score: 3.8, color: 'primary' },
            { name: 'Collaboration', icon: 'group_add', score: 3.5, color: 'blue' },
            { name: 'Problem Solving', icon: 'psychology', score: 3.2, color: 'purple' },
            { name: 'Research', icon: 'biotech', score: 3.0, color: 'amber' },
        ].map(s => `
                        <div class="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-${s.color === 'primary' ? 'primary' : s.color + '-400'}/30 transition-all">
                            <div class="flex items-center justify-between mb-3">
                                <span class="material-symbols-outlined text-${s.color === 'primary' ? 'primary' : s.color + '-500'}">${s.icon}</span>
                                <span class="text-xs font-bold bg-${s.color === 'primary' ? 'primary' : s.color + '-500'}/10 text-${s.color === 'primary' ? 'primary' : s.color + '-600'} px-2 py-0.5 rounded-full">${s.score}/4.0</span>
                            </div>
                            <h4 class="text-sm font-bold">${s.name}</h4>
                            <div class="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-${s.color === 'primary' ? 'primary' : s.color + '-500'} rounded-full" style="width: ${(s.score / 4) * 100}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            <!-- Cumulative Competencies -->
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">account_tree</span>
                    Cumulative Competency Map
                </h2>
                <div class="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                    <div class="grid gap-4">
                        ${data.analytics.competencies.map(c => `
                            <div class="flex items-center gap-4">
                                <div class="w-40 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary text-sm">${c.icon}</span>
                                    <span class="text-sm font-semibold">${c.name}</span>
                                </div>
                                <div class="flex-1 flex items-center gap-3">
                                    <div class="flex-1 h-5 bg-slate-50 rounded-full overflow-hidden relative">
                                        <div class="absolute inset-0 flex">
                                            <div class="w-1/4 border-r border-white/60"></div>
                                            <div class="w-1/4 border-r border-white/60"></div>
                                            <div class="w-1/4 border-r border-white/60"></div>
                                            <div class="w-1/4"></div>
                                        </div>
                                        <div class="h-full bg-primary rounded-full relative z-10" style="width: ${c.width}%"></div>
                                    </div>
                                    <span class="text-xs font-bold text-primary w-12 text-right">${c.score}/4.0</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
            <!-- Summary Feedback -->
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">summarize</span>
                    Summary Feedback
                </h2>
                <div class="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                    <div class="prose prose-sm max-w-none">
                        <p class="text-slate-600 leading-relaxed mb-4">
                            Throughout the Sustainable Urban Development Capstone, ${data.analytics.studentName} demonstrated strong competencies in Communication and Collaboration, consistently exceeding expectations in team-based activities and presentations.
                        </p>
                        <p class="text-slate-600 leading-relaxed mb-4">
                            Areas for growth include Critical Thinking, where the student showed early stage analytical skills. The mid-project review highlighted an upward trend with significant improvement in data interpretation and methodology application.
                        </p>
                        <p class="text-slate-600 leading-relaxed">
                            Overall, ${data.analytics.studentName} has made commendable progress and shows potential for advanced-level competency development in the next academic cycle.
                        </p>
                    </div>
                </div>
            </section>
            <!-- FLOW NAV -->
            <div class="flow-nav-bar">
                <button onclick="navigateTo('#/teacher/analytics')" class="flow-nav-btn secondary">
                    <span class="material-symbols-outlined">arrow_back</span> Back to Analytics
                </button>
                <button onclick="navigateTo('#/student/annual-passport')" class="flow-nav-btn">
                    View Annual Skill Passport <span class="material-symbols-outlined">card_membership</span>
                </button>
            </div>
        </main>
    </div>`;
}

function attachScreen7Listeners() { }
