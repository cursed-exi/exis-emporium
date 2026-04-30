let statblocks = [];

// ===== INIT =====

document.addEventListener("DOMContentLoaded", async () => {

    await loadStatblocks();

    renderList(statblocks);

    document.getElementById("search-bar")
        .addEventListener("input", search);
});


// ===== LOAD =====

const files = ["yukis_guide_to_sain"];

const results = await Promise.all(
    files.map(f =>
        fetch(`/exis-emporium/data/statblocks/${f}.json`)
            .then(r => r.ok ? r.json() : [])
            .catch(() => [])
    )
);

statblocks = results.flat();
// ===== SEARCH =====

function search(e) {

    const q = e.target.value.toLowerCase();

    renderList(statblocks.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.cr.toLowerCase().includes(q)
    ));
}


// ===== LIST =====

function renderList(list) {

    const el = document.getElementById("statblock-list");
    el.innerHTML = "";

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

    </div>`;
}
