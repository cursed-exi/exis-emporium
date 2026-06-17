let items = [];

// ===== INIT =====

document.addEventListener("DOMContentLoaded", async () => {
    await loadItems();

    populateTypes();
    renderList(items);
    showItem(items[0] || null);

    const searchBar = document.getElementById("search-bar");
    const typeSelect = document.getElementById("type");
    const sortSelect = document.getElementById("sort");

    if (searchBar) searchBar.addEventListener("input", filter);
    if (typeSelect) typeSelect.addEventListener("change", filter);
    if (sortSelect) sortSelect.addEventListener("change", filter);
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
    const searchBar = document.getElementById("search-bar");
    const typeSelect = document.getElementById("type");
    const sortSelect = document.getElementById("sort");

    const q = searchBar ? searchBar.value.toLowerCase().trim() : "";
    const type = typeSelect ? typeSelect.value : "all";
    const sort = sortSelect ? sortSelect.value : "name";

    let list = items.filter(item => {
        const name = getName(item).toLowerCase();
        const itemType = getType(item);

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
    showItem(list[0] || null);
}

// ===== RENDER LIST =====

function renderList(list) {
    const el = document.getElementById("item-list");
    if (!el) return;

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
    if (!el) return;

    if (!item) {
        el.innerHTML = "Select an item to inspect it.";
        return;
    }

    const name = getName(item);
    const type = getType(item);
    const rarity = getRarity(item);
    const attunement = getAttunement(item);
    const content = getContent(item);
    const image = item.image || "";
    const link = item.link || item.url || "";

    el.innerHTML = `
        <div class="statblock">
            <h4>${escapeHTML(name)}</h4>
            <div class="type">${escapeHTML(type)} • ${escapeHTML(rarity)} • Attunement: ${escapeHTML(attunement)}</div>
            <hr>
            ${image ? `<div class="image"><img src="${escapeAttr(image)}" alt="${escapeAttr(name)}"></div>` : ""}
            <div class="ability">${content}</div>
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
    if (!select) return;

    select.innerHTML = '<option value="all">All Types</option>';

    const types = [...new Set(items.map(item => getType(item)))].filter(Boolean);
    types.sort((a, b) => a.localeCompare(b));

    types.forEach(type => {
        const opt = document.createElement("option");
        opt.value = type;
        opt.textContent = type;
        select.appendChild(opt);
    });
}

function getName(item) {
    return item?.name || item?.title || "Unnamed Item";
}

function getType(item) {
    return item?.type || item?.category || item?.itemType || "Unknown";
}

function getRarity(item) {
    return item?.rarity || item?.rarityText || item?.rarity_name || "Common";
}

function getRarityValue(item) {
    const rarity = String(getRarity(item)).toLowerCase().trim();

    const map = {
        common: 1,
        uncommon: 2,
        rare: 3,
        "very rare": 4,
        veryrare: 4,
        legendary: 5,
        mythic: 6,
        ethereal: 7,
        unbound: 8
    };

    return map[rarity] || map[rarity.replace(/\s+/g, "")] || 0;
}

function getAttunement(item) {
    return item?.attunement || item?.attune || "No";
}

function getContent(item) {
    const raw = item?.content || item?.description || item?.desc || "No description available.";
    return raw;
}

function getShortDescription(item) {
    const text = stripHTML(getContent(item)).replace(/\s+/g, " ").trim();
    return text.length > 140 ? text.slice(0, 137) + "..." : text;
}

function stripHTML(html) {
    const temp = document.createElement("div");
    temp.innerHTML = String(html);
    return temp.textContent || temp.innerText || "";
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
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
