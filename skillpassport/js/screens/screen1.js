// ===== SCREEN 1: Competency CMS =====

const FRAMEWORK = [
    {
        id: 1, label: 'Self Exploration', num: '01', color: 'teal',
        subPillars: [
            { sp: 1, name: 'Self-discovery, Interest & Values' },
            { sp: 2, name: 'Personality Development & Communication' },
            { sp: 3, name: 'Connecting to the World' },
        ]
    },
    {
        id: 2, label: 'Foundational Literacy', num: '02', color: 'purple',
        subPillars: [
            { sp: 4, name: 'Digital, Media & Data Literacy' },
            { sp: 5, name: 'Financial & Economic Literacy' },
            { sp: 6, name: 'Environmental & Sustainability Literacy' },
        ]
    },
    {
        id: 3, label: 'Tech of the Future', num: '03', color: 'blue',
        subPillars: [
            { sp: 7,  name: 'Smart Systems, IoT' },
            { sp: 8,  name: 'AI, Coding, ML, Robotics' },
            { sp: 9,  name: 'Design, Emerging Tech' },
        ]
    },
    {
        id: 4, label: 'Human Skills', num: '04', color: 'orange',
        subPillars: [
            { sp: 10, name: 'Critical Thinking & Problem Solving' },
            { sp: 11, name: 'Creativity & Innovation' },
            { sp: 12, name: 'Collaboration' },
            { sp: 13, name: 'Emotional Intelligence (SEL)' },
        ]
    },
    {
        id: 5, label: 'Future Competencies', num: '05', color: 'green',
        subPillars: [
            { sp: 14, name: 'Design Thinking' },
            { sp: 15, name: 'Entrepreneurial Mindset' },
            { sp: 16, name: 'Global Citizenship & Cross-cultural Awareness' },
            { sp: 17, name: 'Readiness for Future of Work' },
        ]
    },
];

let expandedCategory = 1;
let activeSubPillar = 1;

function renderScreen1() {
    const data = getData();
    const competencies = data.competencies;

    const STAGE_STYLES = {
        'Foundational': { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Foundational',  sub: 'Class 1–2' },
        'Preparatory':  { bg: 'bg-teal-100',   text: 'text-teal-700',   label: 'Preparatory',   sub: 'Class 3–5' },
        'Middle':       { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Middle',        sub: 'Class 6–8' },
        'Secondary':    { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Secondary',     sub: 'Class 9–12' },
    };

    const rows = competencies.map((c, i) => {
        const st = STAGE_STYLES[c.stage] || { bg: 'bg-slate-100', text: 'text-slate-500', label: c.stage || '—', sub: '' };
        return `
        <tr class="hover:bg-slate-50 transition-colors group">
            <td class="px-6 py-4 text-center">
                <span class="inline-block px-2 py-1 rounded bg-slate-100 text-[10px] font-black text-slate-600">${c.code}</span>
            </td>
            <td class="px-6 py-4">
                <p class="text-sm font-bold text-slate-900">${c.name}</p>
            </td>
            <td class="px-6 py-4">
                <p class="text-xs text-slate-500 line-clamp-1">${c.description}</p>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-col gap-0.5 w-fit">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${st.bg} ${st.text}">${st.label}</span>
                    <span class="text-[10px] text-slate-400 px-1">${st.sub}</span>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}">
                    ${c.status}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                    <button class="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onclick="deleteCompetency(${c.id})" class="p-1 text-slate-400 hover:text-red-500 transition-colors">
                        <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </td>
        </tr>`
    }).join('');

    return `
    <div class="flex flex-col h-screen">
        <!-- Top Navigation -->
        <header class="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-50">
            <div class="flex items-center gap-8">
                <div class="flex items-center gap-3">
                    <img src="enpower-logo.svg" class="h-8 w-auto" alt="Skill Passport" />
                    <h2 class="text-lg font-bold tracking-tight">Competency CMS</h2>
                </div>
                <div class="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-80">
                    <span class="material-symbols-outlined text-slate-500 text-sm">search</span>
                    <input class="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500" placeholder="Search competencies..." type="text" />
                </div>
            </div>
            <div class="flex items-center gap-4">
                <button class="p-2 hover:bg-slate-100 rounded-full relative">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                </button>
                <div class="h-8 w-px bg-slate-200 mx-2"></div>
                <div class="flex items-center gap-3">
                    <div class="text-right hidden sm:block">
                        <p class="text-xs font-semibold">Admin User</p>
                        <p class="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Academic Lead</p>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-sm">AU</div>
                </div>
            </div>
        </header>
        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <aside class="w-72 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto shrink-0">
                <div class="p-5 border-b border-slate-100">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">neoRiSE Framework</p>
                    <p class="text-xs text-slate-400">5 thematics · 17 sub-pillars</p>
                </div>
                <nav class="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
                    ${FRAMEWORK.map(cat => {
                        const isOpen = cat.id === expandedCategory;
                        const colorMap = { teal: '#0d9488', purple: '#7c3aed', blue: '#2563eb', orange: '#ea580c', green: '#16a34a' };
                        const bgMap   = { teal: 'bg-teal-50',   purple: 'bg-violet-50',  blue: 'bg-blue-50',   orange: 'bg-orange-50',  green: 'bg-green-50' };
                        const textMap = { teal: 'text-teal-700', purple: 'text-violet-700', blue: 'text-blue-700', orange: 'text-orange-700', green: 'text-green-700' };
                        const dotMap  = { teal: 'bg-teal-500',  purple: 'bg-violet-500', blue: 'bg-blue-500',  orange: 'bg-orange-500', green: 'bg-green-500' };
                        return `
                        <div>
                            <button onclick="toggleCategory(${cat.id})"
                                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isOpen ? bgMap[cat.color] : 'hover:bg-slate-50'}">
                                <span class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white shrink-0"
                                    style="background:${colorMap[cat.color]}">${cat.num}</span>
                                <span class="text-sm font-bold flex-1 text-left ${isOpen ? textMap[cat.color] : 'text-slate-700'}">${cat.label}</span>
                                <span class="material-symbols-outlined text-sm ${isOpen ? textMap[cat.color] : 'text-slate-400'} transition-transform ${isOpen ? 'rotate-180' : ''}">expand_more</span>
                            </button>
                            ${isOpen ? `
                            <div class="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 pl-3" style="border-color:${colorMap[cat.color]}40">
                                ${cat.subPillars.map(sp => {
                                    const isActive = sp.sp === activeSubPillar;
                                    return `
                                    <button onclick="selectSubPillar(${sp.sp})"
                                        class="w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2
                                        ${isActive ? `${bgMap[cat.color]} ${textMap[cat.color]} font-bold` : 'text-slate-600 hover:bg-slate-50 font-medium'}">
                                        <span class="shrink-0 text-[10px] font-black w-8 ${isActive ? textMap[cat.color] : 'text-slate-400'}">SP${sp.sp}</span>
                                        ${sp.name}
                                    </button>`;
                                }).join('')}
                            </div>` : ''}
                        </div>`;
                    }).join('')}
                </nav>
                <div class="p-4 border-t border-slate-100">
                    <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <span class="text-[11px] text-slate-400">Synced · Today 10:45 AM</span>
                    </div>
                </div>
            </aside>
            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto bg-background-light p-8">
                <div class="max-w-6xl mx-auto">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <div class="flex items-center gap-2 text-slate-500 text-sm mb-2">
                                <span>Dashboard</span>
                                <span class="material-symbols-outlined text-xs">chevron_right</span>
                                <span>Core Sciences</span>
                                <span class="material-symbols-outlined text-xs">chevron_right</span>
                                <span class="text-primary font-medium">Competencies</span>
                            </div>
                            <h1 class="text-3xl font-black tracking-tight">SP1: Core Sciences</h1>
                            <p class="text-slate-500 mt-1">Foundational competencies for biological and physical research methodologies.</p>
                        </div>
                        <button onclick="addCompetencyModal()" class="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-95">
                            <span class="material-symbols-outlined">add_circle</span>
                            Add Competency
                        </button>
                    </div>

                    <!-- Add Competency Form (hidden by default) -->
                    <div id="add-competency-form" class="hidden bg-white rounded-xl border border-primary/30 shadow-lg p-6 mb-6">
                        <h3 class="text-lg font-bold mb-4">Add New Competency</h3>
                        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <input id="new-comp-code" class="rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary/20 p-3 text-sm" placeholder="Code (e.g. SP1.C5)" />
                            <input id="new-comp-name" class="rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary/20 p-3 text-sm" placeholder="Competency Name" />
                            <input id="new-comp-desc" class="rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary/20 p-3 text-sm" placeholder="Description" />
                            <select id="new-comp-stage" class="rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary/20 p-3 text-sm">
                                <option value="">Select Stage</option>
                                <option value="Foundational">Foundational — Class 1–2</option>
                                <option value="Preparatory">Preparatory — Class 3–5</option>
                                <option value="Middle">Middle — Class 6–8</option>
                                <option value="Secondary">Secondary — Class 9–12</option>
                            </select>
                            <select id="new-comp-status" class="rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary/20 p-3 text-sm">
                                <option value="Active">Active</option>
                                <option value="Draft">Draft</option>
                            </select>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="saveNewCompetency()" class="bg-primary text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:shadow-lg transition-all">Save</button>
                            <button onclick="hideCompetencyForm()" class="border border-slate-200 text-slate-600 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-slate-50">Cancel</button>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="mb-6 border-b border-slate-200 flex gap-8">
                        <button class="pb-4 text-sm font-bold border-b-2 border-primary text-primary">Active Competencies (${competencies.filter(c => c.status === 'Active').length})</button>
                        <button class="pb-4 text-sm font-bold text-slate-400 border-b-2 border-transparent">Drafts (${competencies.filter(c => c.status === 'Draft').length})</button>
                        <button class="pb-4 text-sm font-bold text-slate-400 border-b-2 border-transparent">Archived</button>
                    </div>
                    <!-- Table -->
                    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-center">Code</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-36">Stage</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Status</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">${rows}</tbody>
                        </table>
                        <div class="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                            <p class="text-xs text-slate-500">Showing ${competencies.length} entries</p>
                        </div>
                    </div>

                    <!-- FLOW NAV -->
                    <div class="flow-nav-bar mt-8">
                        <div class="text-sm text-slate-400">Screen 1 of 8 — Admin Setup</div>
                        <button onclick="navigateTo('#/admin/profiles')" class="flow-nav-btn">
                            Go to Profile Setup
                            <span class="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    </div>`;
}

function attachScreen1Listeners() { }

function toggleCategory(catId) {
    expandedCategory = expandedCategory === catId ? null : catId;
    document.getElementById('app').innerHTML = renderScreen1();
    attachScreen1Listeners();
}

function selectSubPillar(spNum) {
    activeSubPillar = spNum;
    document.getElementById('app').innerHTML = renderScreen1();
    attachScreen1Listeners();
}

function addCompetencyModal() {
    document.getElementById('add-competency-form').classList.remove('hidden');
}

function hideCompetencyForm() {
    document.getElementById('add-competency-form').classList.add('hidden');
}

function saveNewCompetency() {
    const code   = document.getElementById('new-comp-code').value.trim();
    const name   = document.getElementById('new-comp-name').value.trim();
    const desc   = document.getElementById('new-comp-desc').value.trim();
    const stage  = document.getElementById('new-comp-stage').value;
    const status = document.getElementById('new-comp-status').value;
    if (!code || !name) { showToast('Please enter code and name'); return; }
    if (!stage) { showToast('Please select a stage'); return; }
    updateData(data => {
        const maxId = data.competencies.reduce((m, c) => Math.max(m, c.id), 0);
        data.competencies.push({ id: maxId + 1, code, name, description: desc || 'No description', status, stage });
    });
    showToast('Competency added successfully!');
    router();
}

function deleteCompetency(id) {
    updateData(data => {
        data.competencies = data.competencies.filter(c => c.id !== id);
    });
    showToast('Competency removed');
    router();
}
