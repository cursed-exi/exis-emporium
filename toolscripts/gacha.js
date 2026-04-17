// ===== GACHA SYSTEM =====

let currentBanner = "standard";

// get items safely
function getCurrentItems() {
    return banners[currentBanner].items;
}

// weighted roll
function rollGacha() {
    const items = getCurrentItems();

    const totalWeight = items.reduce((sum, item) => sum + item.chance, 0);
    const roll = Math.random() * totalWeight;

    let cumulative = 0;

    for (let item of items) {
        cumulative += item.chance;
        if (roll <= cumulative) return item;
    }

    return items[0];
}

function rarityClass(rarity) {
    return "gacha-" + rarity.toLowerCase();
}


// ===== MAIN =====

document.addEventListener("DOMContentLoaded", () => {

    const rollBtn = document.getElementById("roll-btn");
    const multiBtn = document.getElementById("multi-roll-btn");
    const grid = document.getElementById("gacha-grid");
    const detail = document.getElementById("gacha-detail");

    const bannerGrid = document.getElementById("banner-grid");
    const bannerImage = document.getElementById("banner-image");
    const bannerFlavor = document.getElementById("banner-flavor");

    // ===== BUILD BANNER GRID =====

    for (let key in banners) {
        const banner = banners[key];

        const tile = document.createElement("div");
        tile.className = "banner-tile";
        tile.dataset.key = key;

        tile.textContent = banner.name;

        // color border
        if (banner.color) {
            tile.style.borderColor = banner.color;
        }

        tile.addEventListener("click", () => {
            currentBanner = key;
            updateBannerUI();
            updateSelection();
        });

        bannerGrid.appendChild(tile);
    }

    // ===== UPDATE UI =====

    function updateSelection() {
        document.querySelectorAll(".banner-tile").forEach(tile => {
            tile.style.boxShadow = "none";

            if (tile.dataset.key === currentBanner) {
                const color = banners[currentBanner].color;
                if (color) {
                    tile.style.boxShadow = `0 0 10px ${color}`;
                }
            }
        });
    }

    function updateBannerUI() {
        const banner = banners[currentBanner];

        bannerImage.src = banner.image;
        bannerFlavor.textContent = banner.flavor;

        if (banner.color) {
            bannerImage.style.boxShadow = `0 0 15px ${banner.color}`;
            bannerFlavor.style.borderLeft = `3px solid ${banner.color}`;
        }
    }

    updateBannerUI();
    updateSelection();

    // ===== RENDER =====

    function renderItems(items) {
    grid.innerHTML = "";

    items.forEach((item) => {

        const div = document.createElement("div");
        div.className = `gacha-item ${rarityClass(item.rarity)}`;

        let revealed = false;

        // start hidden
        div.innerHTML = `<strong>?</strong>`;

        div.addEventListener("click", () => {

            // first click → reveal
            if (!revealed) {
                revealed = true;

                div.innerHTML = `
                    <div class="gacha-stars">${"★".repeat(item.stars)}</div>
                    <div class="gacha-name">${item.name}</div>
                `;
            } 
            // second click → show details
            else {
                detail.innerHTML = `
                    <div class="gacha-stars">${"★".repeat(item.stars)}</div>
                    <strong>${item.name}</strong><br>
                    <em>${item.rarity}</em>
                    <hr>
                    ${item.desc}
                    ${item.lore ? `<div class="quote-box">${item.lore}</div>` : ""}
                `;
            }

        });

        grid.appendChild(div);
        saveLoot(item);
    });
}

    // ===== BUTTONS =====

    rollBtn.addEventListener("click", () => {
        detail.innerHTML = "The lantern flickers...";
        renderItems([rollGacha()]);
    });

    multiBtn.addEventListener("click", () => {
        detail.innerHTML = "The lantern surges...";

        let results = [];
        for (let i = 0; i < 10; i++) {
            results.push(rollGacha());
        }

        renderItems(results);
    });

});


// ===== STORAGE =====

function saveLoot(item) {
    let inventory = JSON.parse(localStorage.getItem("gachaInventory")) || [];
    inventory.push(item);
    localStorage.setItem("gachaInventory", JSON.stringify(inventory));
}