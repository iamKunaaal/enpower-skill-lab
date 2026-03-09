// ===== SCREEN 6: Teacher Analytics =====

function renderScreen6() {
    const data = getData();
    const analytics = data.analytics;

    const competencyBars = analytics.competencies.map(c => `
        <div class="bg-white p-6 rounded-xl border border-slate-100">
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                        <span class="material-symbols-outlined text-slate-500">${c.icon}</span>
                    </div>
                    <p class="font-semibold">${c.name}</p>
                </div>
                <p class="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Score: ${c.score}</p>
            </div>
            <div class="relative h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div class="h-full border-r border-white/20 w-1/4"></div>
                <div class="h-full border-r border-white/20 w-1/4"></div>
                <div class="h-full border-r border-white/20 w-1/4"></div>
                <div class="h-full w-1/4"></div>
                <div class="absolute inset-y-0 left-0 bg-primary rounded-full shadow-[0_0_12px_rgba(25,230,94,0.3)]" style="width: ${c.width}%;"></div>
            </div>
        </div>
    `).join('');

    return `
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full">
            <div class="p-8 flex flex-col gap-2">
                <div class="flex items-center gap-2 mb-8">
                    <img src="enpower-logo.svg" class="h-8 w-auto" alt="Skill Passport" />
                </div>
                <nav class="space-y-1">
                    <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 px-3">Dashboard</p>
                    <a class="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary font-semibold border border-primary/20" href="#">
                        <span class="material-symbols-outlined">person</span>
                        <span class="text-sm">Student Level</span>
                    </a>
                    <a class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors" href="#">
                        <span class="material-symbols-outlined">groups</span>
                        <span class="text-sm">Class Level</span>
                    </a>
                    <a class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors" href="#">
                        <span class="material-symbols-outlined">folder</span>
                        <span class="text-sm">Project Wise</span>
                    </a>
                    <a class="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors" href="#">
                        <span class="material-symbols-outlined">bar_chart</span>
                        <span class="text-sm">Aggregate Competency</span>
                    </a>
                </nav>
            </div>
            <div class="mt-auto p-6 border-t border-slate-100">
                <button class="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all">
                    <span class="material-symbols-outlined">logout</span>
                    <span class="text-sm font-medium">Log Out</span>
                </button>
            </div>
        </aside>
        <!-- Main -->
        <main class="ml-72 flex-1 p-8 lg:p-12">
            <header class="flex justify-between items-center mb-10">
                <div>
                    <h2 class="text-3xl font-bold">Student Analytics</h2>
                    <p class="text-slate-500">Detailed performance insights for ${analytics.studentName}</p>
                </div>
                <div class="flex items-center gap-4">
                    <button class="p-2 rounded-full border border-slate-200 hover:bg-white transition-colors">
                        <span class="material-symbols-outlined">notifications</span>
                    </button>
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">SJ</div>
                </div>
            </header>
            <!-- Student Profile Card -->
            <section class="mb-10">
                <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="flex items-center gap-6">
                        <div class="w-24 h-24 rounded-2xl bg-primary/10 border-4 border-slate-50 shadow-inner flex items-center justify-center text-primary text-3xl font-black">AS</div>
                        <div>
                            <p class="text-xs font-bold text-primary uppercase tracking-widest mb-1">Student Profile</p>
                            <h3 class="text-2xl font-bold">${analytics.studentName}</h3>
                            <div class="flex items-center gap-4 mt-1 text-slate-500">
                                <span class="flex items-center gap-1 text-sm"><span class="material-symbols-outlined text-sm">school</span> ${analytics.grade}</span>
                                <span class="flex items-center gap-1 text-sm"><span class="material-symbols-outlined text-sm">id_card</span> ID: ${analytics.studentId}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="bg-slate-50 p-4 rounded-xl text-center min-w-[120px]">
                            <p class="text-xs text-slate-400 font-medium uppercase mb-1">Average Level</p>
                            <p class="text-3xl font-bold">${analytics.avgLevel}</p>
                        </div>
                        <div class="bg-primary/10 p-4 rounded-xl text-center min-w-[120px] border border-primary/20">
                            <p class="text-xs text-primary font-bold uppercase mb-1">Attendance</p>
                            <p class="text-3xl font-bold text-primary">${analytics.attendance}%</p>
                        </div>
                    </div>
                </div>
            </section>
            <!-- Competency Performance -->
            <section class="mb-16">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold">Competency Performance</h3>
                    <div class="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase">
                        <span>Level 1</span><span>Level 2</span><span>Level 3</span><span>Level 4</span>
                    </div>
                </div>
                <div class="grid gap-4">${competencyBars}</div>
            </section>
            <!-- FLOW NAV -->
            <div class="flow-nav-bar">
                <button onclick="navigateTo('#/teacher/assessments')" class="flow-nav-btn secondary">
                    <span class="material-symbols-outlined">arrow_back</span> Back to Assessments
                </button>
                <button onclick="navigateTo('#/student/project-report')" class="flow-nav-btn">
                    Generate Profile Report <span class="material-symbols-outlined">description</span>
                </button>
            </div>
        </main>
    </div>`;
}

function attachScreen6Listeners() { }
