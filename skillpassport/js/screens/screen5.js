// ===== SCREEN 5: Individual Student Scoring =====

function renderScreen5() {
    const data = getData();
    const scoring = data.studentScoring;
    const selectedId = data.selectedStudent;
    const student = data.students.find(s => s.id === selectedId);
    const studentName = student ? student.name : scoring.name;

    const STAGE_BADGE = {
        'Foundational': 'bg-blue-100 text-blue-700',
        'Preparatory':  'bg-amber-100 text-amber-700',
        'Middle':       'bg-purple-100 text-purple-700',
        'Secondary':    'bg-emerald-100 text-emerald-700',
    };

    const competencyCards = scoring.competencies.map((c, i) => `
        <div class="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/30 transition-all">
            <div class="flex flex-col gap-1.5 flex-1">
                <div class="flex items-center gap-2.5 flex-wrap">
                    <h3 class="text-lg font-bold">${c.name}</h3>
                    ${c.stage ? `<span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${STAGE_BADGE[c.stage] || 'bg-slate-100 text-slate-500'}">${c.stage}</span>` : ''}
                </div>
                <p class="text-sm text-slate-500">${c.description}</p>
            </div>
            <div class="flex flex-wrap items-center gap-4">
                <button class="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
                    <span class="material-symbols-outlined text-lg">menu_book</span> See Rubric
                </button>
                <div class="flex flex-col gap-1.5 min-w-[180px]">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Performance Level</label>
                    <select id="scoring-level-${i}" class="bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/50 cursor-pointer" onchange="updateScoringLevel(${i}, this.value)">
                        <option value="" ${c.level === '' ? 'selected' : ''}>Select Level...</option>
                        <option value="1" ${c.level === '1' ? 'selected' : ''}>1 - Below Expectations</option>
                        <option value="2" ${c.level === '2' ? 'selected' : ''}>2 - Meeting Expectations</option>
                        <option value="3" ${c.level === '3' ? 'selected' : ''}>3 - Exceeding Expectations</option>
                        <option value="4" ${c.level === '4' ? 'selected' : ''}>4 - Exceptional</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');

    return `
    <div class="layout-container flex flex-col items-center">
        <header class="w-full max-w-[1200px] flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white backdrop-blur-md sticky top-0 z-50">
            <div class="flex items-center gap-4">
                <img src="enpower-logo.svg" class="h-8 w-auto" alt="Skill Passport" />
            </div>
            <nav class="hidden md:flex items-center gap-8">
                <a onclick="navigateTo('#/teacher/assessments')" class="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Assessments</a>
                <a class="text-sm font-medium text-primary">Students</a>
                <a class="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Gradebook</a>
                <a onclick="navigateTo('#/teacher/analytics')" class="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Reports</a>
            </nav>
            <div class="flex items-center gap-3">
                <button class="p-2 rounded-xl bg-slate-100 hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-xl">notifications</span>
                </button>
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-primary/20">SJ</div>
            </div>
        </header>
        <main class="w-full max-w-[960px] px-6 py-8 flex flex-col gap-8">
            <!-- Breadcrumbs -->
            <div class="flex items-center gap-2 text-sm text-slate-500">
                <a onclick="navigateTo('#/teacher/assessments')" class="hover:text-primary cursor-pointer">Assessments</a>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <span>Mid-term Evaluation</span>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <span class="text-slate-900 font-medium">Scoring</span>
            </div>
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div class="flex flex-col gap-1">
                    <h1 class="text-4xl font-black tracking-tight">${studentName}</h1>
                    <p class="text-slate-500">Assessment: Mid-term Competency Evaluation • Fall 2024</p>
                </div>
                <button onclick="navigateTo('#/teacher/assessments')" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 font-bold text-sm hover:bg-slate-200 transition-all group">
                    <span class="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Back to List
                </button>
            </div>
            <!-- Competencies -->
            <section class="flex flex-col gap-4">
                <div class="flex items-center justify-between px-2">
                    <h2 class="text-xl font-bold tracking-tight">Core Competencies</h2>
                    <span class="text-xs font-semibold uppercase tracking-widest text-slate-400">${scoring.competencies.length} Items to score</span>
                </div>
                ${competencyCards}
            </section>
            <!-- Feedback -->
            <section class="flex flex-col gap-4 mt-4">
                <div class="flex items-center justify-between px-2">
                    <h2 class="text-xl font-bold tracking-tight">Written Feedback</h2>
                    <span class="text-xs font-semibold text-slate-400">Optional</span>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <textarea id="scoring-feedback" class="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-slate-400" placeholder="Provide detailed observations on ${studentName}'s performance, strengths, and areas for growth..." rows="6">${scoring.feedback}</textarea>
                    <div class="flex items-center gap-4 mt-4 text-xs text-slate-400 font-medium">
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">info</span> Suggestions available</span>
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">spellcheck</span> Spell check active</span>
                    </div>
                </div>
            </section>
            <!-- Action Footer -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-slate-200">
                <div class="flex items-center gap-3 text-sm text-slate-500">
                    <span class="material-symbols-outlined text-primary">cloud_done</span> Draft saved
                </div>
                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <button onclick="saveScoringDraft()" class="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                        Save as Draft
                    </button>
                    <button onclick="submitScores()" class="flex-1 sm:flex-none px-10 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:shadow-[0_0_20px_rgba(90,31,110,0.4)] transition-all flex items-center justify-center gap-2 group">
                        Submit Scores
                        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                    </button>
                </div>
            </div>
            <!-- FLOW NAV -->
            <div class="flow-nav-bar">
                <button onclick="navigateTo('#/teacher/assessments')" class="flow-nav-btn secondary">
                    <span class="material-symbols-outlined">arrow_back</span> Back to Class View
                </button>
                <button onclick="navigateTo('#/teacher/analytics')" class="flow-nav-btn">
                    Go to Analytics <span class="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </main>
        <footer class="w-full max-w-[960px] py-12 px-6 text-center text-slate-400 text-xs">
            <p>© 2024 Educational Assessment Portal. All pedagogical data is encrypted and secure.</p>
        </footer>
    </div>`;
}

function attachScreen5Listeners() { }

function updateScoringLevel(index, value) {
    updateData(data => {
        data.studentScoring.competencies[index].level = value;
    });
}

function saveScoringDraft() {
    const feedback = document.getElementById('scoring-feedback')?.value || '';
    updateData(data => {
        data.studentScoring.feedback = feedback;
    });
    showToast('Draft saved!');
}

function submitScores() {
    saveScoringDraft();
    showToast('Scores submitted successfully!');
    setTimeout(() => navigateTo('#/teacher/assessments'), 800);
}
