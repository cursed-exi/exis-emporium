const items = [
{
    id: "lantern_core",
    name: "Lantern Core",
    image: "../img/items/lantern_core.webp",

    type: "Wondrous Item",
    rarity: "Rare",
    attunement: "Yes",

    desc: "A softly glowing crystal.",
    effect: "Cast Light at will. 1/day Daylight."
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

        <p>${i.desc}</p>

        <div class="action">
            <strong>Effect.</strong> ${i.effect}
        </div>

    </div>`;
}