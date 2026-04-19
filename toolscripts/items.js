const items = [
{
    id: "moonweave_gloves",
    name: "Moonweave Gloves",
    image: "../img/items/moonweave_gloves.png",

    type: "Equipment",
    rarity: "Unbound",
    attunement: "Yes",

    content: `
        <p>The holiest gloves left behind by the Ikrir the Radiant Moon during her Apotheosis after the fight with the Starbeast.</p>

        <div class="action">
            <strong>Tier 0.</strong> This item has a slight magical effect of giving a player a true sight of 5 times their proficiency bonus when attuned to. 
        </div>
        <div class="action">
            <strong>Tier 1.</strong> To advance to this tier once must recconect it with the place of woreship of this Goddess. When that happens they transform slightly gaining a silvery embroilment, that glows the softest silver light in darkness. Now they allow you to use Silver Arrow once per Long Rest. 
        </div>
        <div class="action">
            Silver Arrow. You shoot a blazing silver arrow from the palm of your hand, that damagesand confuses enemies. You roll an Ranged Spell Attack agains an enemy within 60 feet of you. When hit they take 3d10 fire damage that cannot be reduced in any way and must make a DC 17 Constitution Saving or be Sluggish (they can use only one of: action, bonus action or move) until the start of your next turn.  
        </div>
        <div class="action">
            <strong>Tier 2.</strong> To achieve this level one must slay a being of immense darkness and evil. After that is done, they think of the wielder worthy and attune to them. The gloves lose their physical form and meld into their user's hands, making their hands glow a bright silvery light and having a cold mist surround them. The user may now use the Silver Arrow up to three times per long rest and the True Vision extends to 10 times their proficiency bonus. They also gain ability to use Silver Veil. 
        </div>
        <div class="action">
            Silver Veil. The glove has five charges, which it regains when you complete a Long Rest. When you heal a creature or give it temporary hit points you can expend any number of those charges to add an equal number of d6's to that healing or temporary hit points. 
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
