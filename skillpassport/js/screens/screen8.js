// ===== SCREEN 8: Annual Skill Passport =====

function renderScreen8() {
    const data = getData();
    const analytics = data.analytics;

    return `
    <div class="min-h-screen bg-background-light">
        <!-- Header -->
        <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div class="max-w-6xl mx-auto flex items-center justify-between px-8 py-3">
                <div class="flex items-center gap-4">
                    <img src="enpower-logo.svg" class="h-8 w-auto" alt="Skill Passport" />
                    <h1 class="text-xl font-bold tracking-tight">Annual Skill Passport</h1>
                </div>
                <div class="flex items-center gap-4">
                    <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                        <span class="material-symbols-outlined text-lg">file_download</span> Export PDF
                    </button>
                    <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                        <span class="material-symbols-outlined text-lg">print</span> Print
                    </button>
                </div>
            </div>
        </header>
        <main class="max-w-6xl mx-auto px-8 py-10">
            <!-- Student Card -->
            <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-10">
                <div class="flex flex-col md:flex-row items-center gap-8">
                    <div class="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-white shadow-lg flex items-center justify-center text-primary text-4xl font-black">AS</div>
                    <div class="flex-1 text-center md:text-left">
                        <p class="text-xs font-bold text-primary uppercase tracking-widest mb-2">Academic Year 2023-2024</p>
                        <h1 class="text-3xl font-black tracking-tight">${analytics.studentName}</h1>
                        <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-slate-500">
                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">school</span> ${analytics.grade}</span>
                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">id_card</span> ${analytics.studentId}</span>
                            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">calendar_month</span> 2023-2024</span>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="bg-primary/5 border border-primary/20 p-5 rounded-xl text-center min-w-[130px]">
                            <p class="text-xs text-primary font-bold uppercase mb-1">Overall Level</p>
                            <p class="text-4xl font-black text-primary">${analytics.avgLevel}</p>
                            <p class="text-xs text-slate-500 mt-1">out of 4.0</p>
                        </div>
                        <div class="bg-slate-50 p-5 rounded-xl text-center min-w-[130px]">
                            <p class="text-xs text-slate-500 font-bold uppercase mb-1">Attendance</p>
                            <p class="text-4xl font-black">${analytics.attendance}%</p>
                            <p class="text-xs text-slate-500 mt-1">year average</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Top Profiles -->
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">workspace_premium</span>
                    Top Profile Matches
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    ${[
            { title: 'Project Manager', match: 92, icon: 'groups', skills: ['Communication', 'Collaboration', 'Planning'] },
            { title: 'Research Analyst', match: 85, icon: 'biotech', skills: ['Critical Thinking', 'Research', 'Data Analysis'] },
            { title: 'Team Lead', match: 78, icon: 'supervisor_account', skills: ['Leadership', 'Communication', 'Problem Solving'] },
        ].map((p, i) => `
                        <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all ${i === 0 ? 'ring-2 ring-primary/30' : ''}">
                            <div class="flex items-center justify-between mb-4">
                                <div class="p-2 bg-primary/10 rounded-lg">
                                    <span class="material-symbols-outlined text-primary">${p.icon}</span>
                                </div>
                                <span class="text-xs font-bold ${i === 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'} px-3 py-1 rounded-full">${p.match}% Match</span>
                            </div>
                            <h3 class="text-lg font-bold mb-2">${p.title}</h3>
                            <div class="flex flex-wrap gap-1.5">
                                ${p.skills.map(s => `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">${s}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
            <!-- Annual Competency Overview -->
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">account_tree</span>
                    Annual Competency Overview
                </h2>
                <div class="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                    <div class="grid gap-6">
                        ${analytics.competencies.map(c => `
                            <div class="flex items-center gap-4">
                                <div class="w-44 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary text-sm">${c.icon}</span>
                                    </div>
                                    <span class="text-sm font-semibold">${c.name}</span>
                                </div>
                                <div class="flex-1 flex items-center gap-3">
                                    <div class="flex-1 h-6 bg-slate-50 rounded-full overflow-hidden relative">
                                        <div class="absolute inset-0 flex">
                                            <div class="w-1/4 border-r border-white/50"></div>
                                            <div class="w-1/4 border-r border-white/50"></div>
                                            <div class="w-1/4 border-r border-white/50"></div>
                                            <div class="w-1/4"></div>
                                        </div>
                                        <div class="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full relative z-10 shadow-[0_0_8px_rgba(25,230,94,0.3)]" style="width: ${c.width}%"></div>
                                    </div>
                                    <span class="text-sm font-bold text-primary w-16 text-right">${c.score}/4.0</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
            <!-- Year Summary -->
            <section class="mb-12">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">description</span>
                    Annual Summary
                </h2>
                <div class="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                    <div class="prose prose-sm max-w-none">
                        <p class="text-slate-600 leading-relaxed mb-4">
                            ${analytics.studentName} has completed the 2023-2024 academic year demonstrating consistent growth across all evaluated competency domains. The strongest performance areas were Communication and Collaboration, both of which exceeded grade-level expectations.
                        </p>
                        <p class="text-slate-600 leading-relaxed mb-4">
                            Participation across 3 major projects — including the Sustainable Urban Development Capstone — showed progressive skill refinement. The student's ability to synthesize research data and present findings improved markedly from Q1 to Q4.
                        </p>
                        <p class="text-slate-600 leading-relaxed">
                            Recommended focus areas for the coming academic year include deepening Critical Thinking skills through structured analytical exercises and independent research opportunities.
                        </p>
                    </div>
                    <div class="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                        <div class="flex-1">
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Issued By</p>
                            <p class="text-sm font-semibold mt-1">Prof. Sarah Jenkins • Science Department</p>
                        </div>
                        <div class="flex-1 text-right">
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Date</p>
                            <p class="text-sm font-semibold mt-1">December 15, 2024</p>
                        </div>
                    </div>
                </div>
            </section>
            <!-- FLOW NAV -->
            <div class="flow-nav-bar">
                <button onclick="navigateTo('#/student/project-report')" class="flow-nav-btn secondary">
                    <span class="material-symbols-outlined">arrow_back</span> Back to Project Report
                </button>
                <button onclick="navigateTo('#/admin/competencies')" class="flow-nav-btn">
                    <span class="material-symbols-outlined">restart_alt</span> Back to Dashboard
                </button>
            </div>
        </main>
        <!-- Footer -->
        <footer class="max-w-6xl mx-auto px-8 py-8 text-center text-xs text-slate-400 mt-8 border-t border-slate-200">
            <p>Annual Skill Passport — Official Academic Document — © 2024 Skill Passport Platform</p>
        </footer>
    </div>`;
}

function attachScreen8Listeners() { }
