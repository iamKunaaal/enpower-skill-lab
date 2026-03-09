// ===== SCREEN 3: Project & Assessment Setup =====

function renderScreen3() {
    const data = getData();
    const project = data.projects;

    const assessmentItems = project.assessments.map((a, i) => {
        if (i === 0) {
            return `
            <div class="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <button class="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="size-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">${i + 1}</span>
                        <span class="font-semibold text-slate-900">${a.name}</span>
                    </div>
                    <span class="material-symbols-outlined text-slate-400 rotate-180">expand_more</span>
                </button>
                <div class="p-8 flex flex-col gap-8 border-t border-slate-200">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Name</label>
                            <input class="rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-white h-11 text-sm" type="text" value="${a.name}" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Type</label>
                            <select class="rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-white h-11 text-sm">
                                <option ${a.type === 'Written Assignment' ? 'selected' : ''}>Written Assignment</option>
                                <option ${a.type === 'Presentation' ? 'selected' : ''}>Presentation</option>
                                <option ${a.type === 'Peer Review' ? 'selected' : ''}>Peer Review</option>
                                <option ${a.type === 'Lab Report' ? 'selected' : ''}>Lab Report</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Output Descriptor</label>
                        <textarea class="rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-white text-sm" rows="3" placeholder="Describe the expected student output..."></textarea>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment Framework</label>
                        <button class="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm w-fit">
                            <span class="material-symbols-outlined text-xl">attach_file</span>
                            Upload Scoring Rubric (PDF/CSV)
                        </button>
                    </div>
                    <div class="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <h4 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary text-xl">account_tree</span>
                            Assign Competencies
                        </h4>
                        <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-200">
                                        <th class="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-36">#</th>
                                        <th class="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-36">Code</th>
                                        <th class="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Competency Name</th>
                                        <th class="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-36">Type</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${[1,2,3,4,5,6,7,8].map(n => `
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="px-4 py-3">
                                            <span class="text-xs font-bold text-slate-500">Competency ${n}</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <input
                                                id="comp-code-${n}"
                                                class="w-28 rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary/20 px-3 py-1.5 text-xs font-mono font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal"
                                                placeholder="SP#.C#"
                                                oninput="resolveCompName(${n}, this.value)"
                                            />
                                        </td>
                                        <td class="px-4 py-3">
                                            <span id="comp-name-${n}" class="text-xs text-slate-400 italic">—</span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <select class="rounded-lg border border-slate-200 bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary/20 px-3 py-1.5 text-xs text-slate-700">
                                                <option value="">Select</option>
                                                <option value="individual">Individual</option>
                                                <option value="group">Group</option>
                                            </select>
                                        </td>
                                    </tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        return `
            <button class="w-full flex items-center justify-between px-6 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                <div class="flex items-center gap-3">
                    <span class="size-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">${i + 1}</span>
                    <span class="font-semibold text-slate-700">${a.name}</span>
                </div>
                <span class="material-symbols-outlined text-slate-400">expand_more</span>
            </button>`;
    }).join('');

    return `
    <div class="layout-container flex h-full grow flex-col">
        <header class="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-3 sticky top-0 z-50">
            <div class="flex items-center gap-8">
                <div class="flex items-center gap-4">
                    <img src="enpower-logo.svg" class="h-8 w-auto" alt="Skill Passport" />
                    <h2 class="text-lg font-bold tracking-tight">Admin Dashboard</h2>
                </div>
                <nav class="flex items-center gap-9">
                    <a class="text-slate-600 text-sm font-medium hover:text-primary cursor-pointer" href="#">Projects</a>
                    <a class="text-primary text-sm font-bold border-b-2 border-primary py-1" href="#">Assessments</a>
                    <a class="text-slate-600 text-sm font-medium hover:text-primary" href="#">Library</a>
                    <a class="text-slate-600 text-sm font-medium hover:text-primary" href="#">Students</a>
                </nav>
            </div>
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-sm">AU</div>
            </div>
        </header>
        <main class="px-10 lg:px-40 py-8 flex flex-col gap-8 max-w-[1440px] mx-auto w-full">
            <div class="flex flex-col gap-2">
                <h1 class="text-3xl font-black tracking-tight">Project & Assessment Setup</h1>
                <p class="text-slate-500">Define project parameters, design assessments, and map student competencies.</p>
            </div>
            <!-- Config Bar -->
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-6 items-end">
                <div class="flex-1 min-w-[150px]">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Grade / Level</label>
                    <select class="w-full rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm h-11">
                        <option>Grade 10</option><option>Grade 11</option><option>Grade 12</option>
                    </select>
                </div>
                <div class="flex-[3] min-w-[300px]">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Project Title</label>
                    <input class="w-full rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm h-11" placeholder="e.g. Sustainable Urban Development Capstone" type="text" value="${project.title}" />
                </div>
                <div class="flex-1 min-w-[150px]">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Project Type</label>
                    <select class="w-full rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm h-11">
                        <option>Capstone</option><option>Formative</option><option>Summative</option>
                    </select>
                </div>
            </div>
            <!-- Assessments -->
            <div class="flex flex-col gap-4">
                <h3 class="text-lg font-bold text-slate-800 px-1">Assessments & Competency Mapping</h3>
                ${assessmentItems}
            </div>
        </main>
        <!-- Footer -->
        <footer class="mt-auto border-t border-slate-200 bg-white px-10 py-6 sticky bottom-0">
            <div class="max-w-[1440px] mx-auto w-full flex justify-between items-center">
                <div class="flex items-center gap-2 text-slate-500 text-sm italic">
                    <span class="material-symbols-outlined text-sm">cloud_done</span> All changes autosaved
                </div>
                <div class="flex items-center gap-4">
                    <button onclick="showToast('Project saved!')" class="px-8 py-2.5 rounded-lg bg-primary text-white font-bold hover:brightness-105 active:scale-[0.98] transition-all shadow-md flex items-center gap-2">
                        <span class="material-symbols-outlined">save</span> Save Project & Mapping
                    </button>
                </div>
            </div>
        </footer>
        <!-- FLOW NAV -->
        <div class="max-w-[1440px] mx-auto w-full px-10 pb-6">
            <div class="flow-nav-bar">
                <button onclick="navigateTo('#/admin/profiles')" class="flow-nav-btn secondary">
                    <span class="material-symbols-outlined">arrow_back</span> Back to Profiles
                </button>
                <button onclick="navigateTo('#/teacher/assessments')" class="flow-nav-btn">
                    Go to Teacher View <span class="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>
        </div>
    </div>`;
}

function attachScreen3Listeners() { }

function resolveCompName(index, code) {
    const nameEl = document.getElementById(`comp-name-${index}`);
    if (!nameEl) return;
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { nameEl.textContent = '—'; nameEl.className = 'text-xs text-slate-400 italic'; return; }
    const data = getData();
    const match = data.competencies.find(c => c.code === trimmed);
    if (match) {
        nameEl.textContent = match.name;
        nameEl.className = 'text-xs font-semibold text-slate-800';
    } else {
        nameEl.textContent = 'Code not found';
        nameEl.className = 'text-xs text-red-400 italic';
    }
}
