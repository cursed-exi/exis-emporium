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
    const tracks = document.createElement("div");
    tracks.className = "timeline-tracks";

    tracks.appendChild(buildTrack("World timeline", worldTimeline, "world"));

    if (selectedRegion) {
        tracks.appendChild(buildTrack(`${selectedRegion.name} timeline`, selectedRegion.timeline, "local"));
    }

    timeline.appendChild(tracks);
}

function buildTrack(title, ages, type) {
    const track = document.createElement("section");
    track.className = `timeline-track timeline-track--${type}`;

    const heading = document.createElement("h2");
    heading.className = "timeline-track-title";
    heading.textContent = title;
    track.appendChild(heading);

    const line = document.createElement("div");
    line.className = "timeline-line";

    ages.forEach(age => buildAge(age, line));

    if (!ages.some(age => age.events.length)) {
        const emptyState = document.createElement("div");
        emptyState.className = "timeline-event timeline-empty";
        emptyState.textContent = "No regional events have been added yet.";
        line.appendChild(emptyState);
    }

    track.appendChild(line);

    return track;

}

/* ===========================================================
   AGE
   =========================================================== */

function buildAge(age, line){

    const heading = document.createElement("section");
    heading.className = "timeline-age";

    heading.innerHTML = `
        <h2>${age.age}</h2>
        <p>${age.subtitle}</p>
    `;

    // The heading remains a separate era, but lives on the shared line.
    line.appendChild(heading);

    const years = {};

    age.events.forEach(event=>{

        if(!years[event.year])
            years[event.year]=[];

        years[event.year].push(event);

    });

    Object.keys(years).forEach(year=>{

        line.appendChild(buildYear(year, years[year]));

    });

}

/* ===========================================================
   YEAR
   =========================================================== */

function buildYear(year, events){

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

    events.forEach(event=>{

        const card = document.createElement("div");
        card.className = "timeline-event";

        card.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.text}</p>
        `;

        cards.appendChild(card);

    });

    row.appendChild(cards);

    return row;

}
