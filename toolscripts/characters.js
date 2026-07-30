document.addEventListener("DOMContentLoaded", () => {
    loadCharacters();
});

async function loadCharacters() {
    const directory = document.getElementById("character-directory");

    try {
        const response = await fetch("../data/characters/characters.json");

        if (!response.ok) {
            throw new Error(`Could not load character data: ${response.status}`);
        }

        const data = await response.json();
        renderCharacters(directory, data.regions || []);
    } catch (error) {
        console.error(error);
        directory.textContent = "Character data could not be loaded.";
    }
}

function renderCharacters(directory, regions) {
    const fragment = document.createDocumentFragment();

    regions.forEach(region => {
        const section = document.createElement("section");
        section.className = "character-region";

        const heading = document.createElement("h3");
        heading.textContent = region.name;
        section.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "character-grid";

        [...(region.characters || [])]
            .sort((first, second) => first.name.localeCompare(second.name))
            .forEach(character => {
                const tile = document.createElement("a");
                tile.className = "character-tile";
                tile.href = `../characters/${character.page}`;

                const name = document.createElement("span");
                name.className = "character-name";
                name.textContent = character.name;

                const description = document.createElement("span");
                description.className = "character-description";
                description.textContent = character.description;

                tile.append(name, description);
                grid.appendChild(tile);
            });

        section.appendChild(grid);
        fragment.appendChild(section);
    });

    directory.replaceChildren(fragment);
}
