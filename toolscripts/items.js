const items = [
{
    id: "moonweave_gloves",
    name: "Moonweave Gloves",
    image: "../img/items/moonweave_gloves.png",

    type: "Equipment",
    rarity: "Legendary",
    attunement: "Yes",

    content: `
        <p><em>Soft threads shimmer like captured moonlight.</em></p>

        <p>You can cast <strong>Light</strong> at will.</p>

        <div class="action">
            <strong>Radiant Pulse.</strong> Once per day, you may cast
            <strong>Daylight</strong> without expending a spell slot.
        </div>
    `
}
];

document.addEventListener("DOMContentLoaded", () => {
    renderList(items);
    document.getElementById("search-bar").addEventListener("input", search);
});

function search(e) {
    const q = e.target.value.toLowerCase();
    renderList(items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.rarity.toLowerCase().includes(q)
    ));
}

function renderList(list) {
    const el = document.getElementById("item-list");
    el.innerHTML = "";

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