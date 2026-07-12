const threadSelect = document.getElementById("thread-select");
const searchBar = document.getElementById("strand-search");
const cardContainer = document.getElementById("card-container");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const flipBtn = document.getElementById("flip-btn");

let threads = [];

let currentThread = 0;
let currentStrand = 0;
let flipped = false;

const THREAD_FILES = [
    "../data/threads/the_dragon.json"
];

/* =========================
   LOAD THREADS
========================= */

async function loadThreads() {

    try {

        threads = await Promise.all(

            THREAD_FILES.map(async file => {

                const response = await fetch(file);

                if (!response.ok) {
                    throw new Error(
                        `Failed loading ${file}`
                    );
                }

                return response.json();

            })

        );

        populateThreads();
        render();

    }

    catch (error) {

        console.error(error);

        cardContainer.innerHTML = `
        <div class="note-box">
            Failed to load thread data.
        </div>
        `;

    }

}

/* =========================
   THREAD FILTER
========================= */

function getVisibleThreads() {

    const search =
        searchBar.value
            .toLowerCase()
            .trim();

    if (!search)
        return threads;

    return threads.filter(thread => {

        const text = (

            (thread.name || "") +
            " " +
            (thread.id || "") +
            " " +
            (thread.tags || []).join(" ")

        ).toLowerCase();

        return text.includes(search);

    });

}

/* =========================
   DROPDOWN
========================= */

function populateThreads() {

    const visibleThreads =
        getVisibleThreads();

    threadSelect.innerHTML = "";

    visibleThreads.forEach((thread, index) => {

        const option =
            document.createElement("option");

        option.value = index;
        option.textContent = thread.name;

        threadSelect.appendChild(option);

    });

}

/* =========================
   RENDER
========================= */

function render() {

    const visibleThreads =
        getVisibleThreads();

    if (!visibleThreads.length) {

        cardContainer.innerHTML = `
        <div class="note-box">
            No matching threads.
        </div>
        `;

        return;

    }

    if (currentThread >= visibleThreads.length)
        currentThread = 0;

    const thread =
        visibleThreads[currentThread];

    if (currentStrand >= thread.strands.length)
        currentStrand = 0;

    const strand =
        thread.strands[currentStrand];

    cardContainer.innerHTML = `

    <div
        class="thread-card ${flipped ? "flipped" : ""}"
        id="thread-card">

        <div class="thread-face thread-front">

            <img
                src="${thread.cardImage}"
                alt="${thread.name}">

        </div>

        <div class="thread-face thread-back">

            <h3>${thread.name}</h3>

            <div class="strand-number">
                ${strand.strand}
            </div>

            <p>
                <strong>Levels:</strong>
                ${strand.levels}
            </p>

            <p>
                <strong>Divinity:</strong>
                ${strand.divinity}
            </p>

            <hr>

            ${strand.content}

        </div>

    </div>

    `;

    document
        .getElementById("thread-card")
        .addEventListener(
            "click",
            toggleFlip
        );

}

/* =========================
   FLIP
========================= */

function toggleFlip() {

    flipped = !flipped;

    render();

}

/* =========================
   EVENTS
========================= */

threadSelect.addEventListener(
    "change",
    e => {

        currentThread =
            Number(e.target.value);

        currentStrand = 0;
        flipped = false;

        render();

    }
);

searchBar.addEventListener(
    "input",
    () => {

        currentThread = 0;
        currentStrand = 0;

        populateThreads();
        render();

    }
);

prevBtn.addEventListener(
    "click",
    () => {

        const visibleThreads =
            getVisibleThreads();

        if (!visibleThreads.length)
            return;

        const thread =
            visibleThreads[currentThread];

        currentStrand--;

        if (currentStrand < 0)
            currentStrand =
                thread.strands.length - 1;

        render();

    }
);

nextBtn.addEventListener(
    "click",
    () => {

        const visibleThreads =
            getVisibleThreads();

        if (!visibleThreads.length)
            return;

        const thread =
            visibleThreads[currentThread];

        currentStrand++;

        if (
            currentStrand >=
            thread.strands.length
        ) {
            currentStrand = 0;
        }

        render();

    }
);

flipBtn.addEventListener(
    "click",
    toggleFlip
);

loadThreads();
