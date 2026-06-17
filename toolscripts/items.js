let items = [];

// ===== INIT =====

document.addEventListener("DOMContentLoaded", async () => {
    await loadItems();

    populateTypes();
    renderList(items);
    showItem(items[0] || null);

    document.getElementById("search-bar").addEventListener("input", filter);
    document.getElementById("type").addEventListener("change", filter);
    document.getElementById("sort").addEventListener("change", filter);
});

// ===== LOAD ITEMS =====

async function loadItems() {
    const url = "/exis-emporium/data/items.json";

    try {
        const res = await fetch(url);
        if (!res.ok) {
            items = [];
            return;
        }

        const data = await res.json();
        items = Array.isArray(data) ? data : [];
    } catch {
        items = [];
    }
}

// ===== FILTER =====

function filter() {
    const q = document.getElementById("search-bar").value.toLowerCase();
    const type = document.getElementById("type").value;
    const sort = document.getElementById("sort").value;

    let list = items.filter(i => {
        const name = getName(i).toLowerCase();
        const itemType = getType(i);

        return (
            name.includes(q) &&
            (type === "all" || itemType === type)
        );
    });

    if (sort === "name") {
        list.sort((a, b) => getName(a).localeCompare(getName(b)));
    } else if (sort === "rarity") {
        list.sort((a, b) => getRarityValue(b) - getRarityValue(a));
    }

    renderList(list);

    const current = list[0] || null;
    showItem(current);
}

// ===== RENDER LIST =====

function renderList(list) {
    const el = document.getElementById("item-list");
    el.innerHTML = "";

    if (list.length === 0) {
        el.innerHTML = "<p>No items found.</p>";
        return;
    }

    list.forEach(item => {
        const tile = document.createElement("div");
        tile.className = "post-preview";
        tile.style.cursor = "pointer";

        const name = getName(item);
        const rarity = getRarity(item);
        const type = getType(item);

        tile.innerHTML = `
            <h2>${escapeHTML(name)}</h2>
            <div class="meta">${escapeHTML(type)} | ${escapeHTML(rarity)}</div>
            <p>${escapeHTML(getShortDescription(item))}</p>
            <a class="read-link" href="javascript:void(0)">Inspect →</a>
        `;

        tile.addEventListener("click", () => showItem(item));
        el.appendChild(tile);
    });
}

// ===== DISPLAY SINGLE ITEM =====

function showItem(item) {
    const el = document.getElementById("item-display");

    if (!item) {
        el.innerHTML = "Select an item to inspect it.";
        return;
    }

    const name = getName(item);
    const type = getType(item);
    const rarity = getRarity(item);
    const description = getDescription(item);
    const link = item.link || item.url || "";

    el.innerHTML = `
        <div class="statblock">
            <h4>${escapeHTML(name)}</h4>
            <div class="type">${escapeHTML(type)} • ${escapeHTML(rarity)}</div>
            <hr>
            <div class="ability">${escapeHTML(description)}</div>
            ${
                link
                    ? `<div class="action"><strong>Details:</strong> <a href="${escapeAttr(link)}">${escapeHTML(link)}</a></div>`
                    : ""
            }
        </div>
    `;
}

// ===== HELPERS =====

function populateTypes() {
    const select = document.getElementById("type");

    const types = [...new Set(items.map(i => getType(i)))].filter(Boolean);
    types.sort((a, b) => a.localeCompare(b));

    types.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        select.appendChild(opt);
    });
}

function getName(item) {
    return item?.name || item?.title || "Unnamed Item";
}

function getType(item) {
    return item?.type || item?.category || "Unknown";
}

function getRarity(item) {
    return item?.rarity || item?.rarityText || item?.rarity_name || "Common";
}

function getRarityValue(item) {
    const rarity = String(getRarity(item)).toLowerCase();

    const map = {
        common: 1,
        uncommon: 2,
        rare: 3,
        veryrare: 4,
        "very rare": 4,
        legendary: 5,
        mythic: 6,
        ethereal: 7
    };

    return map[rarity.replace(/\s+/g, "")] || map[rarity] || 0;
}

function getDescription(item) {
    return item?.description || item?.desc || "No description available.";
}

function getShortDescription(item) {
    const desc = getDescription(item);
    return desc.length > 140 ? desc.slice(0, 137) + "..." : desc;
}

function escapeHTML(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeAttr(str) {
    return String(str)
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
