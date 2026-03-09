// ===== SCREEN 4: Assessment Score Entry (Class View) =====

function renderScreen4() {
    const data = getData();
    const students = data.students;

    const colorMap = {
        'primary': 'bg-primary/10 text-primary',
        'blue': 'bg-blue-100 text-blue-600',
        'purple': 'bg-purple-100 text-purple-600',
        'orange': 'bg-orange-100 text-orange-600',
        'emerald': 'bg-emerald-100 text-emerald-600',
    };

    const studentRows = students.map(s => {
        const scoreCells = s.scores.map((score, si) => {
            if (score !== null) {
                return `<td class="px-6 py-5">
                    <button class="w-full px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors">${score}/10</button>
                </td>`;
            }
            return `<td class="px-6 py-5">
                <button onclick="quickScore(${s.id}, ${si})" class="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs font-medium hover:border-primary/50 hover:text-primary transition-colors italic">Add Score</button>
            </td>`;
        }).join('');

        return `
        <tr class="student-row hover:bg-slate-50/50 transition-colors" onclick="viewStudentDetail(${s.id})">
            <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-full ${colorMap[s.color]} flex items-center justify-center font-bold text-xs">${s.initials}</div>
                    <span class="font-medium text-slate-900">${s.name}</span>
                </div>
            </td>
            ${scoreCells}
            <td class="px-6 py-5 text-center" onclick="event.stopPropagation()">
                <button onclick="viewStudentDetail(${s.id})" class="p-2 text-slate-400 hover:text-primary transition-colors" title="View Details">
                    <span class="material-symbols-outlined text-xl">visibility</span>
                </button>
            </td>
        </tr>`;
    }).join('');

    const totalScored = students.reduce((count, s) => count + s.scores.filter(x => x !== null).length, 0);
    const totalPossible = students.length * 5;
    const pct = Math.round((totalScored / totalPossible) * 100);

    const allScores = students.flatMap(s => s.scores.filter(x => x !== null));
    const avg = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : '—';

    return `
    <div class="flex flex-col min-h-screen">
        <header class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-12 py-3">
            <div class="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
                <div class="flex items-center gap-10">
                    <div class="flex items-center gap-3">
                        <img src="enpower-logo.svg" class="h-8 w-auto" alt="Skill Passport" />
                    </div>
                    <nav class="hidden md:flex items-center gap-6">
                        <a onclick="navigateTo('#/admin/competencies')" class="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Dashboard</a>
                        <a class="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Classes</a>
                        <a class="text-sm font-medium text-primary">Assessments</a>
                        <a onclick="navigateTo('#/teacher/analytics')" class="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Reports</a>
                    </nav>
                </div>
                <div class="flex items-center gap-3">
                    <div class="text-right hidden sm:block">
                        <p class="text-sm font-semibold">Prof. Sarah Jenkins</p>
                        <p class="text-xs text-slate-500">Science Department</p>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm ring-2 ring-primary/20">SJ</div>
                </div>
            </div>
        </header>
        <main class="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-8">
            <div class="mb-8">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold tracking-tight mb-2">Assessment Score Entry</h1>
                        <nav class="flex items-center gap-2 text-slate-500">
                            <span class="text-sm font-medium">Grade 10</span>
                            <span class="material-symbols-outlined text-sm">chevron_right</span>
                            <span class="text-sm font-medium">Sustainable Cities</span>
                            <span class="material-symbols-outlined text-sm">chevron_right</span>
                            <span class="text-sm font-medium text-primary">Oral Presentation</span>
                        </nav>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                            <span class="material-symbols-outlined text-lg">file_download</span> Export
                        </button>
                        <button onclick="showToast('All changes saved!')" class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-sm shadow-primary/20">
                            <span class="material-symbols-outlined text-lg">save</span> Save Changes
                        </button>
                    </div>
                </div>
            </div>
            <!-- Filters -->
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Grade Level</label>
                        <select class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm">
                            <option>Grade 10 - Section A</option><option>Grade 10 - Section B</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Current Project</label>
                        <select class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm">
                            <option>Sustainable Cities</option><option>Renewable Energy Expo</option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Type</label>
                        <select class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm">
                            <option>Oral Presentation</option><option>Final Thesis</option>
                        </select>
                    </div>
                </div>
            </div>
            <!-- Table -->
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="overflow-x-auto custom-scrollbar">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200">
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[200px]">Student Name</th>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Competency 1</th>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Competency 2</th>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Competency 3</th>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Competency 4</th>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Competency 5</th>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">${studentRows}</tbody>
                    </table>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <p class="text-sm text-slate-500">Showing ${students.length} students</p>
                </div>
            </div>
            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">task_alt</span>
                        <h3 class="text-sm font-bold text-slate-500 uppercase">Completion</h3>
                    </div>
                    <p class="text-3xl font-bold">${pct}%</p>
                    <p class="text-xs text-slate-500 mt-1">${totalScored}/${totalPossible} scores entered</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="material-symbols-outlined text-blue-500 bg-blue-500/10 p-2 rounded-lg">trending_up</span>
                        <h3 class="text-sm font-bold text-slate-500 uppercase">Class Avg</h3>
                    </div>
                    <p class="text-3xl font-bold">${avg}/10</p>
                    <p class="text-xs text-slate-500 mt-1">Sustainable Cities project</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="material-symbols-outlined text-orange-500 bg-orange-500/10 p-2 rounded-lg">report_problem</span>
                        <h3 class="text-sm font-bold text-slate-500 uppercase">At Risk</h3>
                    </div>
                    <p class="text-3xl font-bold">${students.filter(s => { const scored = s.scores.filter(x => x !== null); return scored.length && scored.reduce((a, b) => a + b, 0) / scored.length < 6; }).length}</p>
                    <p class="text-xs text-slate-500 mt-1">Students below 6.0</p>
                </div>
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="material-symbols-outlined text-purple-500 bg-purple-500/10 p-2 rounded-lg">history</span>
                        <h3 class="text-sm font-bold text-slate-500 uppercase">Last Sync</h3>
                    </div>
                    <p class="text-3xl font-bold">Just now</p>
                    <p class="text-xs text-slate-500 mt-1">Auto-save is active</p>
                </div>
            </div>
            <!-- FLOW NAV -->
            <div class="flow-nav-bar mt-8">
                <button onclick="navigateTo('#/admin/projects')" class="flow-nav-btn secondary">
                    <span class="material-symbols-outlined">arrow_back</span> Back to Project Setup
                </button>
                <button onclick="navigateTo('#/teacher/analytics')" class="flow-nav-btn">
                    Go to Analytics <span class="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </main>
        <footer class="mt-auto border-t border-slate-200 bg-white px-12 py-3">
            <div class="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1.5">
                        <span class="block size-2 bg-primary rounded-full animate-pulse"></span><span>System Online</span>
                    </div>
                </div>
                <div>© 2024 EduScore Academic Management Platform</div>
            </div>
        </footer>
    </div>`;
}

function attachScreen4Listeners() { }

function viewStudentDetail(studentId) {
    updateData(data => { data.selectedStudent = studentId; });
    navigateTo('#/teacher/student');
}

function quickScore(studentId, skillIndex) {
    event.stopPropagation();
    const score = prompt('Enter score (1-10):');
    if (score && !isNaN(score) && score >= 1 && score <= 10) {
        updateData(data => {
            const student = data.students.find(s => s.id === studentId);
            if (student) student.scores[skillIndex] = parseInt(score);
        });
        showToast('Score saved!');
        router();
    }
}
