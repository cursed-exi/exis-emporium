let items = [];

// ===== INIT =====

document.addEventListener("DOMContentLoaded", async () => {

    await loadItems();

    renderList(items);

    document.getElementById("search-bar")
        .addEventListener("input", search);
});


// ===== LOAD (EXPANDED) =====

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


// ===== SEARCH =====

function search(e) {

    const q = e.target.value.toLowerCase();

    renderList(items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.rarity.toLowerCase().includes(q)
    ));
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

        item.innerHTML = `
            <strong>${i.name}</strong><br>
            <span style="color:#aaa;">${i.type}</span><br>
            ${i.rarity}
        `;

        item.onclick = () => render(i);

        el.appendChild(item);
    });
}


// ===== DISPLAY =====

function render(i) {

    document.getElementById("item-display").innerHTML = `
    <div class="statblock">

        ${i.image ? `
        <div class="image">
            <img src="${i.image}">
        </div>` : ""}

        <h4>${i.name}</h4>
        <div class="type">${i.type} | ${i.rarity}</div>

        <hr>

        <p><strong>Attunement</strong> ${i.attunement}</p>

        <hr>

        ${i.content || ""}

    </div>`;
}
