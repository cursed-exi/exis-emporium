const spells = [
{
    id: "lantern_flare",
    name: "Lantern Flare",

    level: "Cantrip",
    school: "Evocation",
    casting: "1 action",
    range: "60 ft.",
    components: "V, S",
    duration: "Instantaneous",

    content: `
        <p><em>A sudden burst of radiant light erupts from your focus.</em></p>

        <p>A burst of radiant light strikes a target.</p>

        <div class="action">
            <strong>Effect.</strong> The target takes <strong>1d8 radiant damage</strong>.
        </div>
    `
}
];

document.addEventListener("DOMContentLoaded", () => {
    renderList(spells);
    document.getElementById("search-bar").addEventListener("input", search);
});

function search(e) {
    const q = e.target.value.toLowerCase();
    renderList(spells.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.school.toLowerCase().includes(q) ||
        s.level.toLowerCase().includes(q)
    ));
}

function renderList(list) {
    const el = document.getElementById("spell-list");
    el.innerHTML = "";

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