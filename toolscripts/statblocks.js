const statblocks = [
{
    id: "isk_hound",
    name: "ISK Hound",
    image: "../img/statblocks/ISK_Hound_sketch.webp",

    size: "Medium",
    type: "Construct",
    alignment: "Lawful Evil",
    ac: 16,
    hp: "88 (8d10+44)",
    speed: "45 ft.",
    cr: "5",

    stats: { STR: 15, DEX: 19, CON: 15, INT: 10, WIS: 11, CHA: 10 },
	skills: "Acrobatics +7, Insight +3",
	resistances: "Piercing, Slashing",

    traits: [
        { name: "Multiattack", desc: "The ISK Hound makes 3 attacks: 1 Bite and 2 Swipe." },
        { name: "Machine Combat", desc: "The ISK Hound gives into the orders without thinking. Their attacks are made with advantage, but the attacks against them are also made with advantage until the start of their next turn." },
        { name: "Aura of the Absolute", desc: "All allies within 30 feet, that can see and hear the ISK Hound have advantage on their Wisdom and Charisma Saving Throws." }
    ],

    actions: [
        { name: "Swipe", desc: "Melee Weapon Attack; +7 to hit; Reach 5ft.; one target; 2d6+4 slashing damage." },
        { name: "Bite", desc: "Melee Weapon Attack; +7 to hit; Reach 5ft.; one target; 1d8+4 slashing damage and 1d8 radiant damage." },
        { name: "Laser Canon (1/day)", desc: "The ISK Hound uncovers a cannon in their mouth shooting in a 10 foot wide line, extending for 30 feet straight. Each creature caught in a laser must make a DC15 Dexterity Saving Throw or take 2d10 radiant and 2d10 fire damage or half as much on success." }
    ],

    bonus: [
        { name: "Chase", desc: "As a bonus action the ISK Hound can increase their movement by 20 feet until the end of their turn." },
		{ name: "Tail", desc: "Melee Weapon Attack; +7 to hit; Reach 5ft.; one target; 1d8+4 slashing damage." }
    ]

    // optional fields you can add later:
    // skills: "",
    // resistances: "",
    // immunities: "",
    // languages: ""
}
];

// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {
    renderList(statblocks);
    document.getElementById("search-bar").addEventListener("input", search);
});

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

        ${s.mythic && s.mythic.length ? `
        <hr>
        <div class="action"><strong>Mythic Actions</strong></div>
        ${s.mythic.map(m => `<p><strong>${m.name}.</strong> ${m.desc}</p>`).join("")}
        ` : ""}

    </div>`;
}
