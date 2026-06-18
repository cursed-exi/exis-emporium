const FILES = {
    Feats: "./data/feats.json",
    Classes: "./data/classes.json",
    Subclasses: "./data/subclasses.json",
    Backgrounds: "./data/backgrounds.json"
};

let currentType = "Feats";
let allFeatures = [];
let filtered = [];

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
        '<option value="all">All Sources</option>';

    const sources =
        [...new Set(allFeatures.map(x => x.source))];

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

    filtered = allFeatures.filter(feature => {

        const searchMatch =
            feature.name.toLowerCase()
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

    filtered.forEach(feature => {

        const card =
            document.createElement("div");

        card.className = "feature-card";

        card.innerHTML = `
            <h4>${feature.name}</h4>

            <p class="meta">
                ${feature.source}
            </p>
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

    if(filtered.length){
        renderFeature(filtered[0]);
        carousel.firstChild.classList.add("active");
    }
}

function renderFeature(feature){

    display.innerHTML = `

        <h2>${feature.name}</h2>

        <div class="meta">

            ${feature.type}

            ${feature.parent
                ? " | " + feature.parent
                : ""}

        </div>

        ${feature.content}
    `;
}

document
.querySelectorAll(".feature-type")
.forEach(button => {

    button.onclick = () => {

        document
        .querySelectorAll(".feature-type")
        .forEach(x =>
            x.classList.remove("active"));

        button.classList.add("active");

        loadType(
            button.dataset.type
        );
    };
});

searchBar.addEventListener(
    "input",
    applyFilters
);

sourceFilter.addEventListener(
    "change",
    applyFilters
);

loadType("Feats");
