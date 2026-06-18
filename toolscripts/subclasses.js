let subclasses = [];

document.addEventListener("DOMContentLoaded", async () => {

    await loadSubclasses();

    initFilters();
    applyFilters();

    document
        .getElementById("search-bar")
        .addEventListener("input", applyFilters);

    document
        .getElementById("class-filter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("role-filter")
        .addEventListener("change", applyFilters);
});

// =====================================
// LOAD
// =====================================

async function loadSubclasses() {

    const files = [
        "subclasses"
    ];

    const results = await Promise.all(

        files.map(file =>

            fetch(
                `/exis-emporium/data/subclasses/${file}.json`
            )
            .then(response => {

                if (!response.ok) {
                    return [];
                }

                return response.json();
            })
            .catch(() => [])
        )
    );

    subclasses = results.flat();
}

// =====================================
// HELPERS
// =====================================

function uniqueValues(values) {

    return [

        ...new Set(

            values
                .filter(Boolean)
                .map(v => String(v).trim())
        )
    ];
}

function fillSelect(
    select,
    values,
    label
) {

    select.innerHTML =
        `<option value="all">${label}</option>`;

    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);
    });
}

// =====================================
// FILTERS
// =====================================

function initFilters() {

    fillSelect(

        document.getElementById(
            "class-filter"
        ),

        uniqueValues(
            subclasses.map(
                s => s.class
            )
        ).sort(),

        "All Classes"
    );

    fillSelect(

        document.getElementById(
            "role-filter"
        ),

        uniqueValues(
            subclasses.map(
                s => s.role
            )
        ).sort(),

        "All Roles"
    );
}

function applyFilters() {

    const search =

        document
            .getElementById(
                "search-bar"
            )
            .value
            .toLowerCase();

    const selectedClass =

        document
            .getElementById(
                "class-filter"
            )
            .value;

    const selectedRole =

        document
            .getElementById(
                "role-filter"
            )
            .value;

    const filtered = subclasses.filter(
        subclass => {

            const matchesSearch =

                subclass.name
                    .toLowerCase()
                    .includes(search);

            const matchesClass =

                selectedClass === "all" ||

                subclass.class ===
                selectedClass;

            const matchesRole =

                selectedRole === "all" ||

                subclass.role ===
                selectedRole;

            return (

                matchesSearch &&
                matchesClass &&
                matchesRole
            );
        }
    );

    renderList(filtered);
}

// =====================================
// LIST
// =====================================

function renderList(list) {

    const container =
        document.getElementById(
            "item-list"
        );

    container.innerHTML = "";

    if (!list.length) {

        container.innerHTML =
            "<p>No subclasses found.</p>";

        return;
    }

    list.forEach(subclass => {

        const entry =
            document.createElement("div");

        entry.className = "note-box";

        entry.innerHTML = `
            <strong>${subclass.name}</strong><br>
            ${subclass.class}
            ${
                subclass.role
                ? `<br><span class="meta">${subclass.role}</span>`
                : ""
            }
        `;

        entry.addEventListener(
            "click",
            () => renderSubclass(
                subclass
            )
        );

        container.appendChild(
            entry
        );
    });
}

// =====================================
// CONTENT BLOCKS
// =====================================

function renderContentBlock(
    block
) {

    switch(block.type) {

        case "paragraph":

            return `
                <p>
                    ${block.text}
                </p>
            `;

        case "feature":

            return `
                <div class="action">
                    <strong>
                        ${block.level}th Level - ${block.name}.
                    </strong>
                    ${block.text}
                </div>
            `;

        case "table":

            return `
                <table>

                    <tr>

                        ${block.headers
                            .map(header => `
                                <th>
                                    ${header}
                                </th>
                            `)
                            .join("")}

                    </tr>

                    ${block.rows
                        .map(row => `

                            <tr>

                                ${row
                                    .map(cell => `
                                        <td>
                                            ${cell}
                                        </td>
                                    `)
                                    .join("")}

                            </tr>

                        `)
                        .join("")}

                </table>
            `;

        case "image":

            return `
                <div class="image">

                    <img
                        src="${block.src}"
                        alt=""
                    >

                    ${
                        block.caption
                        ? `
                        <div class="caption">
                            ${block.caption}
                        </div>
                        `
                        : ""
                    }

                </div>
            `;

        case "note":

            return `
                <div class="note-box">
                    ${block.text}
                </div>
            `;

        case "html":

            return block.html;

        default:

            return "";
    }
}

// =====================================
// DISPLAY
// =====================================

function renderSubclass(
    subclass
) {

    const content =

        (subclass.content || [])

        .map(
            renderContentBlock
        )

        .join("");

    document
        .getElementById(
            "item-display"
        )
        .innerHTML = `

        <div class="statblock">

            ${
                subclass.image
                ? `
                <div class="image">
                    <img
                        src="${subclass.image}"
                        alt="${subclass.name}"
                    >
                </div>
                `
                : ""
            }

            <h4>
                ${subclass.name}
            </h4>

            <div class="type">

                ${subclass.class}

                ${
                    subclass.role
                    ? ` | ${subclass.role}`
                    : ""
                }

            </div>

            <hr>

            ${content}

        </div>
    `;
}
