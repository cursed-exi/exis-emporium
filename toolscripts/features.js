const FILES = {
    feats: "../data/features/feats.json",
    classes: "../data/features/classes.json",
    subclasses: "../features/data/subclasses.json",
    backgrounds: "../data/features/backgrounds.json"
};

let allFeatures = [];
let filteredFeatures = [];
let currentType = "feats";

const display = document.getElementById("feature-display");
const carousel = document.getElementById("feature-carousel");

const searchBar = document.getElementById("search-bar");
const sourceFilter = document.getElementById("source-filter");

async function loadType(type){

    currentType = type;

    const response = await fetch(FILES[type]);

    allFeatures = await response.json();

    populateSourceFilter();

    applyFilters();
}

function populateSourceFilter(){

    sourceFilter.innerHTML =
        `<option value="all">All Sources</option>`;

    const sources =
        [...new Set(
            allFeatures
            .map(x => x.source)
            .filter(Boolean)
        )];

    sources.sort();

    for(const source of sources){

        const option =
            document.createElement("option");

        option.value = source;
        option.textContent = source;

        sourceFilter.appendChild(option);
    }
}

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

        card.className = "feature-card";

        card.innerHTML = `
            <h4>${feature.name}</h4>

            <div class="meta">
                ${feature.source || ""}
            </div>
        `;

        card.onclick = () => {

            document
                .querySelectorAll(".feature-card")
                .forEach(x =>
                    x.classList.remove("active"));

            card.classList.add("active");

            renderFeature(feature);
        };

        carousel.appendChild(card);
    });

    carousel.firstChild.classList.add("active");

    renderFeature(filteredFeatures[0]);
}

function renderFeature(feature){

    let html = `
        <h2>${feature.name}</h2>

        <div class="meta">
            ${feature.type || ""}
            ${feature.parent ? " | " + feature.parent : ""}
        </div>
    `;

    if(feature.sections){

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

            if(section.html){

                html += section.html;
            }

        });

    } else {

        html += feature.content || "";
    }

    display.innerHTML = html;
}

document
.querySelectorAll(".feature-type")
.forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".feature-type")
            .forEach(x =>
                x.classList.remove("active"));

        button.classList.add("active");

        loadType(
            button.dataset.type
        );
    });

});

searchBar.addEventListener(
    "input",
    applyFilters
);

sourceFilter.addEventListener(
    "change",
    applyFilters
);

loadType("feats");
