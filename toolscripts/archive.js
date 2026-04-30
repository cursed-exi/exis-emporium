let articles = [];

// ===== INIT =====

document.addEventListener("DOMContentLoaded", async () => {

    await loadArticles();

    populateCategories();
    populateYears();
    renderList(articles);

    document.getElementById("search-bar").addEventListener("input", filter);
    document.getElementById("category").addEventListener("change", filter);
    document.getElementById("year").addEventListener("change", filter);
    document.getElementById("sort").addEventListener("change", filter);
});


// ===== LOAD ARTICLES =====

async function loadArticles() {

    const years = ["2026"]; // add more years here

    const results = await Promise.all(
        years.map(y =>
            fetch(`/exis-emporium/data/${y}.json`)
                .then(res => {
                    if (!res.ok) return [];
                    return res.json();
                })
                .catch(() => [])
        )
    );

    articles = results.flat();
}


// ===== FILTER =====

function filter() {

    const q = document.getElementById("search-bar").value.toLowerCase();
    const cat = document.getElementById("category").value;
    const year = document.getElementById("year").value;
    const sort = document.getElementById("sort").value;

    let list = articles.filter(a =>
        a.title.toLowerCase().includes(q) &&
        (cat === "all" || a.category === cat) &&
        (year === "all" || a.date.startsWith(year))
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


// ===== AUTO YEARS =====

function populateYears() {

    const select = document.getElementById("year");

    const years = [...new Set(
        articles.map(a => a.date.split("-")[0])
    )];

    // newest first
    years.sort((a,b) => b - a);

    years.forEach(y => {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        select.appendChild(opt);
    });
}
