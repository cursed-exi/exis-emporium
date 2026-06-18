let entries = [];

const searchBar = document.getElementById("search-bar");
const filtersDiv = document.getElementById("filters");
const listDiv = document.getElementById("entry-list");
const displayDiv = document.getElementById("entry-display");

const filterOrder = [];
const filterElements = {};

fetch("../data/features/generic.json")
.then(r => r.json())
.then(data => {

    entries = data;

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
        wrapper.style.display =
            index === 0
            ? "inline-block"
            : "none";

        wrapper.style.marginRight = "8px";

        const select = document.createElement("select");

        select.className = "ui-select";

        select.innerHTML =
            `<option value="all">${filterName}</option>`;

        select.addEventListener("change", () => {

            resetLowerFilters(filterName);

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

    updateFilters();
}

function resetLowerFilters(changedFilter) {

    const index =
        filterOrder.indexOf(changedFilter);

    for (
        let i = index + 1;
        i < filterOrder.length;
        i++
    ) {

        filterElements[
            filterOrder[i]
        ].select.value = "all";
    }
}

function populateFilter(filterName) {

    const select =
        filterElements[filterName].select;

    const current =
        select.value;

    select.innerHTML =
        `<option value="all">${filterName}</option>`;

    let filtered = [...entries];

    const index =
        filterOrder.indexOf(filterName);

    for (let i = 0; i < index; i++) {

        const previous =
            filterOrder[i];

        const value =
            filterElements[
                previous
            ].select.value;

        if (value === "all")
            continue;

        filtered = filtered.filter(entry =>
            entry.filters &&
            entry.filters[previous] === value
        );
    }

    const values =
        [...new Set(

            filtered
            .map(entry =>
                entry.filters
                ? entry.filters[filterName]
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

    if (
        [...select.options]
        .some(o => o.value === current)
    ) {
        select.value = current;
    }
}

function updateFilters() {

    filterOrder.forEach((filterName, index) => {

        const wrapper =
            filterElements[
                filterName
            ].wrapper;

        if (index === 0) {

            wrapper.style.display =
                "inline-block";

            populateFilter(filterName);

            return;
        }

        wrapper.style.display = "none";
    });

    for (
        let i = 1;
        i < filterOrder.length;
        i++
    ) {

        const previous =
            filterOrder[i - 1];

        const previousValue =
            filterElements[
                previous
            ].select.value;

        if (previousValue === "all")
            break;

        const current =
            filterOrder[i];

        populateFilter(current);

        filterElements[
            current
        ].wrapper.style.display =
            "inline-block";

        if (
            filterElements[
                current
            ].select.value === "all"
        ) {
            break;
        }
    }
}

function getFilteredEntries() {

    let filtered = [...entries];

    const search =
        searchBar.value
        .toLowerCase()
        .trim();

    if (search) {

        filtered =
            filtered.filter(entry =>
                entry.name
                .toLowerCase()
                .includes(search)
            );
    }

    filterOrder.forEach(filterName => {

        const value =
            filterElements[
                filterName
            ].select.value;

        if (value === "all")
            return;

        filtered =
            filtered.filter(entry =>
                entry.filters &&
                entry.filters[
                    filterName
                ] === value
            );
    });

    return filtered;
}

function render() {

    const filtered =
        getFilteredEntries();

    listDiv.innerHTML = "";

    if (filtered.length === 0) {

        listDiv.innerHTML =
            "<p>No entries found.</p>";

        return;
    }

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

    showEntry(filtered[0]);
}

function showEntry(entry) {

    let filterInfo = "";

    if (entry.filters) {

        Object.entries(entry.filters)
        .forEach(([key, value]) => {

            filterInfo += `
                <p>
                    <strong>${key}:</strong>
                    ${value}
                </p>
            `;
        });
    }

    displayDiv.innerHTML = `

        <div class="statblock">

            <h3>${entry.name}</h3>

            ${
                entry.image
                ? `
                <div class="image">
                    <img src="${entry.image}"
                         alt="${entry.name}">
                </div>
                `
                : ""
            }

            ${filterInfo}

            ${entry.content || ""}

        </div>
    `;
}

searchBar.addEventListener(
    "input",
    render
);
