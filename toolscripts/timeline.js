const timeline = document.getElementById("timeline");
let timelineData = [];

/* ===========================================================
   BUILD
   =========================================================== */

document.addEventListener("DOMContentLoaded", loadTimeline);

async function loadTimeline() {
    try {
        const response = await fetch("/exis-emporium/data/timeline/timeline.json");

        if (!response.ok) {
            throw new Error("Timeline data could not be loaded.");
        }

        timelineData = await response.json();
        buildTimeline();
    } catch (error) {
        timeline.innerHTML = "<p>Timeline data could not be loaded.</p>";
        console.error(error);
    }
}

function buildTimeline(){

    timeline.innerHTML = "";

    // Every era shares this one continuous timeline line.
    const line = document.createElement("div");
    line.className = "timeline-line";

    timelineData.forEach(age => {

        buildAge(age, line);

    });

    timeline.appendChild(line);

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
        <div class="timeline-dot"></div>
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
