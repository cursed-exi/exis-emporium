const timeline = document.getElementById("timeline");
const regionPicker = document.getElementById("timeline-region");
let worldTimeline = [];
let localTimelines = [];

/* ===========================================================
   BUILD
   =========================================================== */

document.addEventListener("DOMContentLoaded", loadTimeline);

async function loadTimeline() {
    try {
        const [worldResponse, localResponse] = await Promise.all([
            fetch("/exis-emporium/data/timeline/timeline.json"),
            fetch("/exis-emporium/data/timeline/timeline_local.json")
        ]);

        if (!worldResponse.ok || !localResponse.ok) {
            throw new Error("Timeline data could not be loaded.");
        }

        worldTimeline = await worldResponse.json();
        localTimelines = await localResponse.json();
        populateRegionPicker();
        buildTimeline();
    } catch (error) {
        timeline.innerHTML = "<p>Timeline data could not be loaded.</p>";
        console.error(error);
    }
}

function populateRegionPicker() {
    regionPicker.innerHTML = "";

    localTimelines.forEach(region => {
        const option = document.createElement("option");
        option.value = region.id;
        option.textContent = region.name;
        regionPicker.appendChild(option);
    });

    regionPicker.addEventListener("change", buildTimeline);
}

function buildTimeline(){

    timeline.innerHTML = "";

    const selectedRegion = localTimelines.find(region => region.id === regionPicker.value);
    const regionColors = getRegionColors(selectedRegion);
    timeline.style.setProperty("--region-color", regionColors.color);
    timeline.style.setProperty("--region-highlight", regionColors.highlight);
    const worldEvents = collectEvents(worldTimeline, "world");
    const localEvents = collectEvents(selectedRegion?.timeline || [], "local");
    const worldAgeHeadings = collectWorldAgeHeadings(worldTimeline);
    const years = [...new Set([...worldEvents.keys(), ...localEvents.keys()])]
        .sort((first, second) => yearValue(first) - yearValue(second));

    const legend = document.createElement("div");
    legend.className = "timeline-legend";
    legend.innerHTML = `
        <span class="timeline-legend-world">World timeline</span>
        <span class="timeline-legend-local">${selectedRegion?.name || "Regional"} timeline</span>
    `;
    timeline.appendChild(legend);

    const line = document.createElement("div");
    line.className = "timeline-line timeline-line--dual";

    years.forEach(year => {
        (worldAgeHeadings.get(year) || []).forEach(age => {
            line.appendChild(buildAgeHeading(age));
        });

        line.appendChild(buildYear(year, worldEvents.get(year) || [], localEvents.get(year) || []));
    });

    if (!localEvents.size) {
        const emptyState = document.createElement("div");
        emptyState.className = "timeline-event timeline-event--local timeline-empty";
        emptyState.textContent = "No regional events have been added yet.";
        line.appendChild(emptyState);
    }

    timeline.appendChild(line);
}

function getRegionColors(region) {
    return {
        color: region?.color || "",
        highlight: region?.highlightColor || ""
    };
}

function collectWorldAgeHeadings(ages) {
    const headingsByYear = new Map();

    ages.forEach(age => {
        const firstYear = age.events[0]?.year;

        if (!firstYear) {
            return;
        }

        if (!headingsByYear.has(firstYear)) {
            headingsByYear.set(firstYear, []);
        }

        headingsByYear.get(firstYear).push(age);
    });

    return headingsByYear;
}

function buildAgeHeading(age) {
    const heading = document.createElement("section");
    heading.className = "timeline-age timeline-age--world";
    heading.innerHTML = `
        <h2>${age.age}</h2>
        <p>${age.subtitle}</p>
    `;

    return heading;
}

function collectEvents(ages, type) {
    const eventsByYear = new Map();

    ages.forEach(age => {
        age.events.forEach(event => {
            if (!eventsByYear.has(event.year)) {
                eventsByYear.set(event.year, []);
            }

            eventsByYear.get(event.year).push({ ...event, age: age.age, type });
        });
    });

    return eventsByYear;
}

function yearValue(year) {
    return Number(year.replaceAll(".", "").replace("+", "")) || 0;
}

function buildYear(year, worldEvents, localEvents){

    const row = document.createElement("div");
    row.className = "timeline-row";

    const marker = document.createElement("div");
    marker.className = "timeline-marker";

    marker.innerHTML = `
        <div class="timeline-year">${year}</div>
    `;

    row.appendChild(marker);

    const cards = document.createElement("div");
    cards.className = "timeline-events";

    [...worldEvents, ...localEvents].forEach(event=>{

        const card = document.createElement("div");
        card.className = `timeline-event timeline-event--${event.type}`;

        card.innerHTML = `
            <div class="timeline-event-age">${event.age}</div>
            <h3>${event.title}</h3>
            <p>${event.text}</p>
        `;

        cards.appendChild(card);

    });

    row.appendChild(cards);

    return row;

}
