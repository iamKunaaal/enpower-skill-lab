// ===== SCREEN 2: Profile Setup =====

let selectedProfileId = 1;

function getCompetencyName(code) {
    if (!code) return '';
    const data = getData();
    const match = data.competencies.find(c => c.code === code);
    return match ? match.name : code;
}

function renderScreen2() {
    const data = getData();
    const profiles = data.profiles;
    const selected = profiles.find(p => p.id === selectedProfileId) || profiles[0];

    const sidebarItems = profiles.map(p => {
        const isActive = p.id === selected.id;
        const hasConfig = p.primaryCompetencies.length > 0;
        return `
            <div onclick="selectProfile(${p.id})"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'hover:bg-slate-50 text-slate-700'}">
                <div class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0
                    ${isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}">
                    ${p.id}
                </div>
                <span class="text-sm font-semibold truncate flex-1">${p.name}</span>
                ${hasConfig ? `<span class="w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-white/70' : 'bg-primary'}"></span>` : ''}
            </div>`;
    }).join('');

    const renderSlots = (comps, type, max) => {
        let slots = '';
        for (let i = 0; i < max; i++) {
            const val = comps[i] || '';
            const compName = val ? getCompetencyName(val) : '';
            slots += `
                <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 group focus-within:border-primary/40 focus-within:bg-primary/5 transition-all">
                    <span class="text-[11px] font-black text-slate-400 w-4 shrink-0">${i + 1}</span>
                    <input
                        class="flex-1 bg-transparent border-none focus:ring-0 text-sm font-mono font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal placeholder:text-sm w-24"
                        placeholder="SP#.C#"
                        value="${val}"
                        onchange="updateProfileCompetency(${selected.id}, '${type}', ${i}, this.value)"
                    />
                    <span class="text-xs text-slate-400 truncate max-w-[160px]">${compName}</span>
                    ${val ? `<span onclick="updateProfileCompetency(${selected.id}, '${type}', ${i}, '')" class="material-symbols-outlined text-sm text-slate-300 hover:text-red-400 cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">close</span>` : ''}
                </div>`;
        }
        return slots;
    };

    return `
    <div class="flex h-screen overflow-hidden bg-[#F9FAFB]">

        <!-- Sidebar -->
        <aside class="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
            <div class="p-5 border-b border-slate-100">
                <img src="enpower-logo.svg" class="h-7 w-auto mb-5" alt="Skill Passport" />
                <h2 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Profiles</h2>
                <p class="text-[11px] text-slate-400">15 profiles · Select to configure</p>
            </div>
            <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
                ${sidebarItems}
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">

            <!-- Top bar -->
            <header class="h-14 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-3">
                    <span class="text-slate-400 text-sm font-medium">Admin Dashboard</span>
                    <span class="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span class="text-slate-800 text-sm font-bold">Profile Setup</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary text-xl">notifications</span>
                    <div class="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-xs">AU</div>
                </div>
            </header>

            <!-- Scrollable body -->
            <main class="flex-1 overflow-y-auto px-10 py-8">

                <!-- Profile header -->
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                            ${selected.id}
                        </div>
                        <div>
                            <input
                                id="profile-name-input"
                                class="text-2xl font-black tracking-tight bg-transparent border-none focus:ring-0 p-0 text-slate-900 w-full"
                                value="${selected.name}"
                                onchange="renameProfile(${selected.id}, this.value)"
                            />
                            <p class="text-sm text-slate-400">Configure primary and secondary competencies</p>
                        </div>
                    </div>
                    <button onclick="saveProfileConfig()" class="flex items-center gap-2 bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all text-sm">
                        <span class="material-symbols-outlined text-lg">save</span> Save Profile
                    </button>
                </div>

                <!-- Competency Grid -->
                <div class="grid grid-cols-2 gap-6 mb-8">

                    <!-- Primary Competencies -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div class="flex items-center gap-3 mb-5">
                            <div class="p-2 bg-primary/10 rounded-xl">
                                <span class="material-symbols-outlined text-primary">verified</span>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-slate-900">Primary Competencies</h3>
                                <p class="text-xs text-slate-400">2–3 core competencies for this profile</p>
                            </div>
                            <span class="ml-auto text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">
                                ${selected.primaryCompetencies.filter(Boolean).length}/3
                            </span>
                        </div>
                        <div class="flex flex-col gap-3">
                            ${renderSlots(selected.primaryCompetencies, 'primary', 3)}
                        </div>
                    </div>

                    <!-- Secondary Competencies -->
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div class="flex items-center gap-3 mb-5">
                            <div class="p-2 bg-slate-100 rounded-xl">
                                <span class="material-symbols-outlined text-slate-500">category</span>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-slate-900">Secondary Competencies</h3>
                                <p class="text-xs text-slate-400">2–3 supporting competencies</p>
                            </div>
                            <span class="ml-auto text-xs bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-full">
                                ${selected.secondaryCompetencies.filter(Boolean).length}/3
                            </span>
                        </div>
                        <div class="flex flex-col gap-3">
                            ${renderSlots(selected.secondaryCompetencies, 'secondary', 3)}
                        </div>
                    </div>
                </div>

                <!-- All profiles summary -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="text-sm font-bold text-slate-700">All Profiles Overview</h3>
                        <span class="text-xs text-slate-400">${data.profiles.filter(p => p.primaryCompetencies.length > 0).length} of 15 configured</span>
                    </div>
                    <div class="divide-y divide-slate-100">
                        ${data.profiles.map(p => `
                            <div onclick="selectProfile(${p.id})" class="px-6 py-3 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${p.id === selected.id ? 'bg-primary/5' : ''}">
                                <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center shrink-0">${p.id}</span>
                                <span class="text-sm font-semibold text-slate-800 w-44 shrink-0">${p.name}</span>
                                <div class="flex flex-wrap gap-1.5 flex-1">
                                    ${p.primaryCompetencies.filter(Boolean).map(c => `<span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full"><span class="font-black">${c}</span><span class="opacity-60 font-medium"> · ${getCompetencyName(c)}</span></span>`).join('')}
                                    ${p.secondaryCompetencies.filter(Boolean).map(c => `<span class="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"><span class="font-bold">${c}</span><span class="opacity-70"> · ${getCompetencyName(c)}</span></span>`).join('')}
                                    ${p.primaryCompetencies.length === 0 ? '<span class="text-[10px] text-slate-300 italic">Not configured</span>' : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Flow nav -->
                <div class="flow-nav-bar mt-8">
                    <button onclick="navigateTo('#/admin/competencies')" class="flow-nav-btn secondary">
                        <span class="material-symbols-outlined">arrow_back</span> Back to Competencies
                    </button>
                    <button onclick="navigateTo('#/admin/projects')" class="flow-nav-btn">
                        Go to Project Setup <span class="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>

            </main>
        </div>
    </div>`;
}

function attachScreen2Listeners() {}

function selectProfile(id) {
    selectedProfileId = id;
    const app = document.getElementById('app');
    app.innerHTML = renderScreen2();
    attachScreen2Listeners();
}

function updateProfileCompetency(profileId, type, index, value) {
    updateData(data => {
        const profile = data.profiles.find(p => p.id === profileId);
        if (!profile) return;
        const key = type === 'primary' ? 'primaryCompetencies' : 'secondaryCompetencies';
        profile[key][index] = value.trim().toUpperCase();
        // Clean up empty trailing entries
        while (profile[key].length > 0 && !profile[key][profile[key].length - 1]) {
            profile[key].pop();
        }
    });
    selectProfile(profileId);
}

function renameProfile(profileId, newName) {
    updateData(data => {
        const profile = data.profiles.find(p => p.id === profileId);
        if (profile && newName.trim()) profile.name = newName.trim();
    });
}

function saveProfileConfig() {
    const nameInput = document.getElementById('profile-name-input');
    if (nameInput) renameProfile(selectedProfileId, nameInput.value);
    showToast('Profile saved successfully!');
    selectProfile(selectedProfileId);
}
