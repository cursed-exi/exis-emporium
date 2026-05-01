let statblocks = [];

// ===== INIT =====

document.addEventListener("DOMContentLoaded", async () => {

    await loadStatblocks();

    populateFilters();
    renderList(sortByName(statblocks));

    document.getElementById("search-bar").addEventListener("input", filter);
    document.getElementById("cr").addEventListener("change", filter);
    document.getElementById("type").addEventListener("change", filter);
    document.getElementById("size").addEventListener("change", filter);
});


// ===== LOAD =====

async function loadStatblocks() {

    const files = [
        "yukis_guide_to_sain"
    ];

    const results = await Promise.all(
        files.map(f =>
            fetch(`/exis-emporium/data/statblocks/${f}.json`)
                .then(res => res.ok ? res.json() : [])
                .catch(() => [])
        )
    );

    statblocks = results.flat();
}


// ===== SORT =====

function sortByName(list) {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
}


// ===== FILTER =====

function filter() {

    const q = document.getElementById("search-bar").value.toLowerCase();
    const cr = document.getElementById("cr").value;
    const type = document.getElementById("type").value;
    const size = document.getElementById("size").value;

    let list = statblocks.filter(s =>
        s.name.toLowerCase().includes(q) &&
        (cr === "all" || s.cr === cr) &&
        (type === "all" || s.type === type) &&
        (size === "all" || s.size === size)
    );

    renderList(sortByName(list));
}


// ===== LIST =====

function renderList(list) {

    const el = document.getElementById("statblock-list");
    el.innerHTML = "";

    if (list.length === 0) {
        el.innerHTML = "<p>No statblocks found.</p>";
        return;
    }

    list.forEach(s => {

        const item = document.createElement("div");
        item.className = "note-box";

        item.innerHTML = `
            <strong>${s.name}</strong><br>
            <span style="color:#aaa;">${s.size} ${s.type}</span><br>
            CR ${s.cr}
        `;

        item.onclick = () => render(s);

        el.appendChild(item);
    });
}


// ===== DISPLAY =====

function render(s) {

    document.getElementById("statblock-display").innerHTML = `
    <div class="statblock">

        ${s.image ? `
        <div class="image">
            <img src="${s.image}">
        </div>` : ""}

        <h4>${s.name}</h4>
        <div class="type">${s.size} ${s.type}, ${s.alignment} | CR ${s.cr}</div>

        <hr>

        <p><strong>AC</strong> ${s.ac}</p>
        <p><strong>HP</strong> ${s.hp}</p>
        <p><strong>Speed</strong> ${s.speed}</p>

        ${s.skills ? `<p><strong>Skills</strong> ${s.skills}</p>` : ""}
        ${s.resistances ? `<p><strong>Resistances</strong> ${s.resistances}</p>` : ""}
        ${s.immunities ? `<p><strong>Immunities</strong> ${s.immunities}</p>` : ""}
        ${s.languages ? `<p><strong>Languages</strong> ${s.languages}</p>` : ""}
        ${s.senses ? `<p><strong>Senses</strong> ${s.senses}</p>` : ""}

        <hr>

        <div class="stats">
            ${Object.entries(s.stats).map(([k,v]) => `
                <div><strong>${k}</strong>${v}</div>
            `).join("")}
        </div>

        <hr>

        ${s.traits.map(t => `<p><strong>${t.name}.</strong> ${t.desc}</p>`).join("")}

        <hr>

        <div class="action"><strong>Actions</strong></div>
        ${s.actions.map(a => `<p><strong>${a.name}.</strong> ${a.desc}</p>`).join("")}

        ${s.bonus && s.bonus.length ? `
        <hr>
        <div class="action"><strong>Bonus Actions</strong></div>
        ${s.bonus.map(b => `<p><strong>${b.name}.</strong> ${b.desc}</p>`).join("")}
        ` : ""}

        ${s.reactions && s.reactions.length ? `
        <hr>
        <div class="action"><strong>Reactions</strong></div>
        ${s.reactions.map(r => `<p><strong>${r.name}.</strong> ${r.desc}</p>`).join("")}
        ` : ""}

        ${s.legendary && s.legendary.length ? `
        <hr>
        <div class="action"><strong>Legendary Break Actions</strong></div>
        ${s.legendary.map(l => `<p><strong>${l.name}.</strong> ${l.desc}</p>`).join("")}
        ` : ""}

    </div>`;
}


// ===== FILTER POPULATION =====

function populateFilters() {

    populateSelect("cr", [...new Set(statblocks.map(s => s.cr))], true);
    populateSelect("type", [...new Set(statblocks.map(s => s.type))]);
    populateSelect("size", [...new Set(statblocks.map(s => s.size))]);
}


// ===== HELPERS =====

function populateSelect(id, values, isCR = false) {

    const select = document.getElementById(id);

    values.sort((a, b) => {
        if (isCR) return crToNumber(a) - crToNumber(b);
        return a.localeCompare(b);
    });

    values.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
    });
}


// Handles CR like "1/2", "1/4", etc.
function crToNumber(cr) {
    if (cr.includes("/")) {
        const [a, b] = cr.split("/");
        return a / b;
    }
    return Number(cr);
}
