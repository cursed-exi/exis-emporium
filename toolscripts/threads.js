const threadSelect =
document.getElementById("thread-select");

const searchBar =
document.getElementById("strand-search");

const cardContainer =
document.getElementById("card-container");

const prevBtn =
document.getElementById("prev-btn");

const nextBtn =
document.getElementById("next-btn");

const flipBtn =
document.getElementById("flip-btn");

let threads = [];

let currentThread = 0;
let currentStrand = 0;
let flipped = false;

async function loadThreads(){

const manifest =
await fetch("data/manifest.json")
.then(r => r.json());

const loaded =
await Promise.all(

manifest.threads.map(file =>
fetch(file).then(r => r.json())
)

);

threads = loaded;

populateThreads();

render();

}

function populateThreads(){

threadSelect.innerHTML = "";

threads.forEach((thread,index)=>{

const option =
document.createElement("option");

option.value = index;
option.textContent = thread.name;

threadSelect.appendChild(option);

});

}

function getVisibleStrands(){

const thread =
threads[currentThread];

const search =
searchBar.value
.toLowerCase()
.trim();

if(!search)
return thread.strands;

return thread.strands.filter(s => {

const text = (

s.strand +
" " +
s.levels +
" " +
s.divinity +
" " +
s.content

).toLowerCase();

return text.includes(search);

});

}

function render(){

const visible =
getVisibleStrands();

if(!visible.length){

cardContainer.innerHTML =
"<div class='note-box'>No matching strands.</div>";

return;

}

if(currentStrand >= visible.length)
currentStrand = 0;

const thread =
threads[currentThread];

const strand =
visible[currentStrand];

cardContainer.innerHTML = `

<div
class="thread-card ${flipped ? "flipped" : ""}"
id="thread-card">

<div class="thread-face thread-front">

<img src="${thread.cardImage}">

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

function toggleFlip(){

flipped = !flipped;

render();

}

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

currentStrand = 0;

render();

}
);

prevBtn.addEventListener(
"click",
() => {

const visible =
getVisibleStrands();

currentStrand--;

if(currentStrand < 0)
currentStrand =
visible.length - 1;

render();

}
);

nextBtn.addEventListener(
"click",
() => {

const visible =
getVisibleStrands();

currentStrand++;

if(currentStrand >= visible.length)
currentStrand = 0;

render();

}
);

flipBtn.addEventListener(
"click",
toggleFlip
);

loadThreads();
