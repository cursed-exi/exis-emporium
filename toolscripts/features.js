const FILES = {
    feats: "../data/features/feats.json",
    classes: "../data/features/classes.json",
    subclasses: "../data/features/subclasses.json",
    backgrounds: "../data/features/backgrounds.json"
};

let allFeatures = [];
let filteredFeatures = [];
let currentType = "feats";

const display =
document.getElementById("feature-display");

const carousel =
document.getElementById("feature-carousel");

const searchBar =
document.getElementById("search-bar");

const sourceFilter =
document.getElementById("source-filter");

/* ============================= */

async function loadType(type){

    currentType = type;

    try{

        const response =
        await fetch(FILES[type]);

        allFeatures =
        await response.json();

        populateSourceFilter();

        applyFilters();

    }catch(error){

        console.error(error);

        display.innerHTML = `
            <h3>Error</h3>
            <p>Failed to load feature data.</p>
        `;
    }
}

/* ============================= */

function populateSourceFilter(){

    sourceFilter.innerHTML =
    `<option value="all">All Sources</option>`;

    const sources =
    [...new Set(

        allFeatures
        .map(feature => feature.source)
        .filter(Boolean)

    )];

    sources.sort();

    sources.forEach(source => {

        const option =
        document.createElement("option");

        option.value = source;
        option.textContent = source;

        sourceFilter.appendChild(option);

    });

}

/* ============================= */

function applyFilters(){

    const search =
    searchBar.value.toLowerCase();

    const source =
    sourceFilter.value;

    filteredFeatures =
    allFeatures.filter(feature => {

        const searchMatch =
        feature.name
        .toLowerCase()
        .includes(search);

        const sourceMatch =
        source === "all"
        || feature.source === source;

        return searchMatch && sourceMatch;

    });

    renderCarousel();

}

/* ============================= */

function renderCarousel(){

    carousel.innerHTML = "";

    if(filteredFeatures.length === 0){

        carousel.innerHTML =
        "<p>No features found.</p>";

        return;
    }

    filteredFeatures.forEach(feature => {

        const card =
        document.createElement("div");

        card.className =
        "feature-card";

        card.innerHTML = `

            <h4>${feature.name}</h4>

            <div class="meta">

                ${feature.source || ""}

            </div>

        `;

        card.addEventListener("click", () => {

            document
            .querySelectorAll(".feature-card")
            .forEach(card =>
                card.classList.remove("active")
            );

            card.classList.add("active");

            renderFeature(feature);

        });

        carousel.appendChild(card);

    });

    carousel.firstElementChild
    ?.classList.add("active");

    renderFeature(
        filteredFeatures[0]
    );

}

/* ============================= */

function renderFeature(feature){

    let html = `

        <h2>${feature.name}</h2>

        <div class="meta">

            ${feature.type}

            ${feature.parent
                ? " | " + feature.parent
                : ""
            }

        </div>

    `;

    feature.sections.forEach(section => {

        html += `

            <h3>${section.title}</h3>

        `;

        if(section.content){

            section.content.forEach(paragraph => {

                html += `
                    <p>${paragraph}</p>
                `;

            });

        }

        if(section.table){

            html += "<table>";

            html += "<tr>";

            section.table.headers.forEach(header => {

                html += `<th>${header}</th>`;

            });

            html += "</tr>";

            section.table.rows.forEach(row => {

                html += "<tr>";

                row.forEach(cell => {

                    html += `<td>${cell}</td>`;

                });

                html += "</tr>";

            });

            html += "</table>";
        }

    });

    display.innerHTML = html;
}

/* ============================= */

document
.querySelectorAll(".feature-type")
.forEach(button => {

    button.addEventListener("click", () => {

        document
        .querySelectorAll(".feature-type")
        .forEach(button =>
            button.classList.remove("active")
        );

        button.classList.add("active");

        loadType(
            button.dataset.type
        );

    });

});

/* ============================= */

searchBar.addEventListener(
    "input",
    applyFilters
);

sourceFilter.addEventListener(
    "change",
    applyFilters
);

/* ============================= */

loadType("feats");
