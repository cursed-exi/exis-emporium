let entries = [];

const searchBar = document.getElementById("search-bar");
const filtersDiv = document.getElementById("filters");
const listDiv = document.getElementById("entry-list");
const displayDiv = document.getElementById("entry-display");

const filterOrder = [];
const filterElements = {};

const files = [
    "../data/features/generic.json",
];

Promise.all(
    files.map(
        file => fetch(file).then(r => r.json())
    )
)
.then(results => {

    entries = results.flat();

    buildFilters();
    render();
});

function buildFilters() {

    const keys = new Set();

    entries.forEach(entry => {

        if (!entry.filters) return;

        Object.keys(entry.filters).forEach(key => {
            keys.add(key);
        });
    });

    filterOrder.push(...keys);

    filterOrder.forEach((filterName, index) => {

        const wrapper = document.createElement("div");

        wrapper.className = "ui-select-wrapper";
        wrapper.style.display = index === 0
            ? "inline-block"
            : "none";

        wrapper.dataset.filter = filterName;

        const select = document.createElement("select");

        select.className = "ui-select";

        select.innerHTML =
            `<option value="all">${filterName}</option>`;

        select.addEventListener("change", () => {

            updateFilters();
            render();
        });

        wrapper.appendChild(select);
        filtersDiv.appendChild(wrapper);

        filterElements[filterName] = {
            wrapper,
            select
        };
    });

    populateFilter(filterOrder[0]);
}

function populateFilter(filterName) {

    const select =
        filterElements[filterName].select;

    const current =
        select.value;

    select.innerHTML =
        `<option value="all">${filterName}</option>`;

    let filtered = entries;

    const index =
        filterOrder.indexOf(filterName);

    for (let i = 0; i < index; i++) {

        const previous =
            filterOrder[i];

        const value =
            filterElements[previous]
            .select.value;

        if (value !== "all") {

            filtered = filtered.filter(
                e =>
                e.filters &&
                e.filters[previous] === value
            );
        }
    }

    const values =
        [...new Set(

            filtered
            .map(e =>
                e.filters
                ? e.filters[filterName]
                : null
            )
            .filter(Boolean)

        )]
        .sort();

    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);
    });

    if ([...select.options]
        .some(o => o.value === current)) {

        select.value = current;
    }
}

function updateFilters() {

    let showNext = true;

    filterOrder.forEach((filterName, index) => {

        const wrapper =
            filterElements[filterName].wrapper;

        if (index === 0) {
            wrapper.style.display =
                "inline-block";
            return;
        }

        const previous =
            filterOrder[index - 1];

        const previousValue =
            filterElements[previous]
            .select.value;

        if (
            showNext &&
            previousValue !== "all"
        ) {

            wrapper.style.display =
                "inline-block";

            populateFilter(filterName);

        } else {

            wrapper.style.display =
                "none";

            filterElements[filterName]
            .select.value = "all";

            showNext = false;
        }
    });
}

function getFilteredEntries() {

    let filtered = [...entries];

    const search =
        searchBar.value.toLowerCase();

    if (search) {

        filtered = filtered.filter(entry =>
            entry.name
            .toLowerCase()
            .includes(search)
        );
    }

    filterOrder.forEach(filterName => {

        const value =
            filterElements[filterName]
            .select.value;

        if (value === "all")
            return;

        filtered = filtered.filter(entry =>
            entry.filters &&
            entry.filters[filterName] === value
        );
    });

    return filtered;
}

function render() {

    const filtered =
        getFilteredEntries();

    listDiv.innerHTML = "";

    filtered.forEach(entry => {

        const button =
            document.createElement("button");

        button.className =
            "ui-button";

        button.style.margin =
            "4px";

        button.textContent =
            entry.name;

        button.addEventListener(
            "click",
            () => showEntry(entry)
        );

        listDiv.appendChild(button);
    });

    if (filtered.length) {
        showEntry(filtered[0]);
    }
}

function showEntry(entry) {

    displayDiv.innerHTML = `

        <div class="statblock">

            <h3>${entry.name}</h3>

            ${
                entry.image
                ? `
                <div class="image">
                    <img src="${entry.image}">
                </div>
                `
                : ""
            }

            ${entry.content}

        </div>

    `;
}

searchBar.addEventListener(
    "input",
    render
);
