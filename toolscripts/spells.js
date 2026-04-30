let spells = [];

// ===== INIT =====

document.addEventListener("DOMContentLoaded", async () => {

    await loadSpells();

    renderList(spells);

    document.getElementById("search-bar")
        .addEventListener("input", search);
});


// ===== LOAD (EXPANDED) =====

async function loadSpells() {

    const files = [
        "yukis_guide_to_sain"
        // add more later:
        // "core_spells",
        // "dark_magic_pack"
    ];

    const results = await Promise.all(
        files.map(f =>
            fetch(`/exis-emporium/data/spells/${f}.json`)
                .then(res => res.ok ? res.json() : [])
                .catch(() => [])
        )
    );

    spells = results.flat();
}


// ===== SEARCH =====

function search(e) {

    const q = e.target.value.toLowerCase();

    renderList(spells.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.school.toLowerCase().includes(q) ||
        s.level.toLowerCase().includes(q)
    ));
}


// ===== LIST =====

function renderList(list) {

    const el = document.getElementById("spell-list");
    el.innerHTML = "";

    if (list.length === 0) {
        el.innerHTML = "<p>No spells found.</p>";
        return;
    }

    list.forEach(s => {

        const item = document.createElement("div");
        item.className = "note-box";

        item.innerHTML = `
            <strong>${s.name}</strong><br>
            <span style="color:#aaa;">${s.level} ${s.school}</span>
        `;

        item.onclick = () => render(s);

        el.appendChild(item);
    });
}


// ===== DISPLAY =====

function render(s) {

    document.getElementById("spell-display").innerHTML = `
    <div class="statblock">

        ${s.image ? `
        <div class="image">
            <img src="${s.image}">
        </div>` : ""}

        <h4>${s.name}</h4>
        <div class="type">${s.level} ${s.school}</div>

        <hr>

        <p><strong>Casting Time</strong> ${s.casting}</p>
        <p><strong>Range</strong> ${s.range}</p>
        <p><strong>Components</strong> ${s.components}</p>
        <p><strong>Duration</strong> ${s.duration}</p>

        <hr>

        ${s.content || ""}

    </div>`;
}
