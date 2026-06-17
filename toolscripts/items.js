let items = [];

const rarityOrder = [
    "Mundane",
    "Common",
    "Uncommon",
    "Rare",
    "Very Rare",
    "Legendary",
    "Unbound"
];

document.addEventListener("DOMContentLoaded", async () => {
    await loadItems();

    initFilters();
    applyFilters();

    document.getElementById("search-bar").addEventListener("input", applyFilters);

    document.getElementById("type").addEventListener("change", () => {
        updateSubtypeFilter();
        applyFilters();
    });

    document.getElementById("subtype").addEventListener("change", applyFilters);
    document.getElementById("rarity").addEventListener("change", applyFilters);
});

// ===== LOAD =====

async function loadItems() {
    const files = [
        "yukis_guide_to_sain"
        // add more later:
        // "magic_items_pack",
        // "relics"
    ];

    const results = await Promise.all(
        files.map(f =>
            fetch(`/exis-emporium/data/items/${f}.json`)
                .then(res => res.ok ? res.json() : [])
                .catch(() => [])
        )
    );

    items = results.flat();
}

// ===== FILTER HELPERS =====

function norm(value) {
    return String(value ?? "").toLowerCase().trim();
}

function uniqueValues(values) {
    return [...new Set(values.filter(Boolean).map(v => String(v).trim()))];
}

function fillSelect(select, values, firstLabel) {
    select.innerHTML = `<option value="all">${firstLabel}</option>`;

    values.forEach(value => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = value;
        select.appendChild(opt);
    });
}

function initFilters() {
    const typeSelect = document.getElementById("type");
    const raritySelect = document.getElementById("rarity");

    const types = uniqueValues(items.map(i => i.type)).sort((a, b) =>
        a.localeCompare(b)
    );

    const rarities = uniqueValues(items.map(i => i.rarity)).sort((a, b) => {
        const ai = rarityOrder.findIndex(r => norm(r) === norm(a));
        const bi = rarityOrder.findIndex(r => norm(r) === norm(b));

        const aKnown = ai !== -1;
        const bKnown = bi !== -1;

        if (aKnown && bKnown) return ai - bi;
        if (aKnown) return -1;
        if (bKnown) return 1;

        return a.localeCompare(b);
    });

    fillSelect(typeSelect, types, "All Types");
    fillSelect(raritySelect, rarities, "All Rarities");

    updateSubtypeFilter();
}

function updateSubtypeFilter() {
    const typeSelect = document.getElementById("type");
    const subtypeWrap = document.getElementById("subtype-wrap");
    const subtypeSelect = document.getElementById("subtype");

    const selectedType = typeSelect.value;

    if (selectedType === "all") {
        subtypeSelect.innerHTML = `<option value="all">All Subtypes</option>`;
        subtypeSelect.value = "all";
        subtypeWrap.style.display = "none";
        return;
    }

    const subtypes = uniqueValues(
        items
            .filter(i => norm(i.type) === norm(selectedType) && i.subtype)
            .map(i => i.subtype)
    ).sort((a, b) => a.localeCompare(b));

    subtypeSelect.innerHTML = `<option value="all">All Subtypes</option>`;

    subtypes.forEach(value => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = value;
        subtypeSelect.appendChild(opt);
    });

    subtypeSelect.value = "all";
    subtypeWrap.style.display = "inline-block";
}

// ===== SEARCH + FILTER =====

function applyFilters() {
    const q = norm(document.getElementById("search-bar").value);
    const type = document.getElementById("type").value;
    const subtype = document.getElementById("subtype").value;
    const rarity = document.getElementById("rarity").value;

    const filtered = items.filter(i => {
        const matchesSearch =
            !q ||
            norm(i.name).includes(q) ||
            norm(i.type).includes(q) ||
            norm(i.subtype).includes(q) ||
            norm(i.rarity).includes(q) ||
            norm(i.attunement).includes(q) ||
            norm(i.content).includes(q);

        const matchesType = type === "all" || norm(i.type) === norm(type);
        const matchesSubtype = subtype === "all" || norm(i.subtype) === norm(subtype);
        const matchesRarity = rarity === "all" || norm(i.rarity) === norm(rarity);

        return matchesSearch && matchesType && matchesSubtype && matchesRarity;
    });

    renderList(filtered);
}

// ===== LIST =====

function renderList(list) {
    const el = document.getElementById("item-list");
    el.innerHTML = "";

    if (list.length === 0) {
        el.innerHTML = "<p>No items found.</p>";
        return;
    }

    list.forEach(i => {
        const item = document.createElement("div");
        item.className = "note-box";

        const typeLine = i.subtype
            ? `${i.type} | ${i.subtype}`
            : i.type;

        item.innerHTML = `
            <strong>${i.name}</strong><br>
            <span style="color:#aaa;">${typeLine}</span><br>
            ${i.rarity}
        `;

        item.onclick = () => render(i);

        el.appendChild(item);
    });
}

// ===== DISPLAY =====

function render(i) {
    const typeLine = i.subtype
        ? `${i.type} | ${i.subtype} | ${i.rarity}`
        : `${i.type} | ${i.rarity}`;

    document.getElementById("item-display").innerHTML = `
    <div class="statblock">

        ${i.image ? `
        <div class="image">
            <img src="${i.image}">
        </div>` : ""}

        <h4>${i.name}</h4>
        <div class="type">${typeLine}</div>

        <hr>

        <p><strong>Attunement</strong> ${i.attunement ?? "No"}</p>

        <hr>

        ${i.content || ""}

    </div>`;
}
