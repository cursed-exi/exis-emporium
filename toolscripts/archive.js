// ===== DATA =====

const articles = [
{
    id: "unbound_gear",
    title: "Unbound Gear",
    date: "2026-04-22",
    category: "Mechanics Discussion",
    description: "A system for evolving weapons with flavour and utility.",
    link: "../Articles/2026/unbound_gear.html"
},
{
    id: "atomized_networks",
    title: "Atomized Networks",
    date: "2026-04-15",
    category: "Worldbuilding",
    description: "How to make worlds feel alive and cooperative.",
    link: "../Articles/2026/atomized_networks.html"
},
{
    id: "breaking_the_npcs",
    title: "Breaking the NPCs",
    date: "2026-04-08",
    category: "Mechanics Discussion",
    description: "Legendary Break System and boss design.",
    link: "../Articles/2026/breaking_the_npcs.html"
},
{
    id: "yerdan_story",
    title: "The Tale of Yerdan – how an elf became a unit",
    date: "2026-04-01",
    category: "Short Story",
    description: "A chaotic tale from a campaign that became a running joke.",
    link: "../index.html" // since it's inline on homepage
}
];


// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {

    populateCategories();
    renderList(articles);

    document.getElementById("search-bar").addEventListener("input", filter);
    document.getElementById("category").addEventListener("change", filter);
    document.getElementById("sort").addEventListener("change", filter);
});


// ===== FILTER =====

function filter() {

    const q = document.getElementById("search-bar").value.toLowerCase();
    const cat = document.getElementById("category").value;
    const sort = document.getElementById("sort").value;

    let list = articles.filter(a =>
        a.title.toLowerCase().includes(q) &&
        (cat === "all" || a.category === cat)
    );

    // sorting
    if (sort === "new") {
        list.sort((a,b) => new Date(b.date) - new Date(a.date));
    }
    else if (sort === "old") {
        list.sort((a,b) => new Date(a.date) - new Date(b.date));
    }
    else if (sort === "name") {
        list.sort((a,b) => a.title.localeCompare(b.title));
    }

    renderList(list);
}


// ===== RENDER =====

function renderList(list) {

    const el = document.getElementById("article-list");
    el.innerHTML = "";

    if (list.length === 0) {
        el.innerHTML = "<p>No articles found.</p>";
        return;
    }

    list.forEach(a => {

        const item = document.createElement("div");
        item.className = "post-preview";

        item.innerHTML = `
            <h2><a href="${a.link}">${a.title}</a></h2>
            <div class="meta">
                ${formatDate(a.date)} | ${a.category}
            </div>
            <p>${a.description}</p>
            <a class="read-link" href="${a.link}">Read more →</a>
        `;

        el.appendChild(item);
    });
}


// ===== HELPERS =====

function formatDate(dateStr) {
    const d = new Date(dateStr);

    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


// ===== AUTO CATEGORY =====

function populateCategories() {

    const select = document.getElementById("category");

    const cats = [...new Set(articles.map(a => a.category))];

    cats.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
    });
}