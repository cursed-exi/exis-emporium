const CR_ROWS = [
{cr:"0",value:0,hp:[1,10],ac:11,ab:2,dc:10,dpr:[0,4]},
{cr:"1/8",value:0.125,hp:[7,35],ac:12,ab:3,dc:11,dpr:[4,7]},
{cr:"1/4",value:0.25,hp:[11,40],ac:12,ab:3,dc:11,dpr:[5,9]},
{cr:"1/2",value:0.5,hp:[16,50],ac:13,ab:3,dc:12,dpr:[7,12]},
{cr:"1",value:1,hp:[30,70],ac:14,ab:4,dc:13,dpr:[12,17]},
{cr:"2",value:2,hp:[40,90],ac:14,ab:5,dc:13,dpr:[17,26]},
{cr:"3",value:3,hp:[50,110],ac:15,ab:5,dc:14,dpr:[26,34]},
{cr:"4",value:4,hp:[60,130],ac:15,ab:6,dc:14,dpr:[34,43]},
{cr:"5",value:5,hp:[80,150],ac:16,ab:6,dc:15,dpr:[43,55]},
{cr:"6",value:6,hp:[100,180],ac:16,ab:7,dc:15,dpr:[55,68]},
{cr:"7",value:7,hp:[120,200],ac:17,ab:8,dc:16,dpr:[68,81]},
{cr:"8",value:8,hp:[140,220],ac:17,ab:8,dc:16,dpr:[81,94]},
{cr:"9",value:9,hp:[160,250],ac:17,ab:9,dc:17,dpr:[94,111]},
{cr:"10",value:10,hp:[180,270],ac:17,ab:9,dc:17,dpr:[111,128]},
{cr:"11",value:11,hp:[200,300],ac:18,ab:10,dc:18,dpr:[128,145]},
{cr:"12",value:12,hp:[220,330],ac:18,ab:10,dc:18,dpr:[145,170]},
{cr:"13",value:13,hp:[250,350],ac:19,ab:11,dc:19,dpr:[170,187]},
{cr:"14",value:14,hp:[270,380],ac:19,ab:11,dc:19,dpr:[187,213]},
{cr:"15",value:15,hp:[300,400],ac:19,ab:12,dc:20,dpr:[213,238]},
{cr:"16",value:16,hp:[330,450],ac:19,ab:12,dc:20,dpr:[238,272]},
{cr:"17",value:17,hp:[350,500],ac:20,ab:13,dc:21,dpr:[272,298]},
{cr:"18",value:18,hp:[400,550],ac:20,ab:13,dc:21,dpr:[298,340]},
{cr:"19",value:19,hp:[450,600],ac:20,ab:14,dc:22,dpr:[340,383]},
{cr:"20",value:20,hp:[500,700],ac:20,ab:14,dc:22,dpr:[383,425]}
];

const TRAITS = [
["Legendary Actions",2],
["Legendary Resistance",1],
["Lair Actions",1],
["Spellcasting",1],
["Multiattack",0.5],
["Pack Tactics",0.5],
["AoE Damage",1],
["Battlefield Control",0.5],
["Damage Resistance",0.5],
["Damage Immunity",0.5],
["Condition Immunities",0.5],
["Magic Resistance",0.5],
["Regeneration",0.5],
["High Healing",1],
["Flight",0.5],
["Teleportation",0.5],
["Reactive Defense",0.5],
["Strong Reactions",0.5],
["Summons Minions",1]
];

const traitGrid = document.getElementById("trait-grid");
let selectedTraits = 0;

TRAITS.forEach(([name,mod])=>{
const div=document.createElement("div");
div.className="trait-tile";
div.dataset.mod=mod;
div.innerHTML=`
<strong>${name}</strong>
<span class="trait-value">(+${mod})</span>
`;

div.addEventListener("click",()=>{
div.classList.toggle("active");
calculateCR();
});

traitGrid.appendChild(div);
});

function nearestRow(value,key){
for(const row of CR_ROWS){
if(value>=row[key][0] && value<=row[key][1]){
return row;
}
}
return CR_ROWS[CR_ROWS.length-1];
}

function calculateCR(){

const hp=+document.getElementById("hp").value;
const ac=+document.getElementById("ac").value;
const ab=+document.getElementById("attackBonus").value;
const dc=+document.getElementById("saveDc").value;
const dpr=+document.getElementById("dpr").value;

const hpRow=nearestRow(hp,"hp");
const dprRow=nearestRow(dpr,"dpr");

let defensive=hpRow.value+((ac-hpRow.ac)/2);

let offensive=dprRow.value;
offensive+=(ab-dprRow.ab)/2;
offensive+=(dc-dprRow.dc)/2;
offensive/=2;

selectedTraits=0;

document.querySelectorAll(".trait-tile.active")
.forEach(tile=>{
selectedTraits+=Number(tile.dataset.mod);
});

const raw=((defensive+offensive)/2)+selectedTraits;
const rounded=Math.max(0,Math.round(raw));

document.getElementById("cr-result").textContent=rounded;
document.getElementById("raw-cr").textContent=raw.toFixed(1);
document.getElementById("defensive-cr").textContent=defensive.toFixed(1);
document.getElementById("offensive-cr").textContent=offensive.toFixed(1);
document.getElementById("trait-total").textContent=
"+"+selectedTraits.toFixed(1);
}

document.querySelectorAll(".cr-input")
.forEach(input=>{
input.addEventListener("input",calculateCR);
});

const tbody=document.querySelector("#cr-table tbody");

CR_ROWS.forEach(r=>{
tbody.innerHTML+=`
<tr>
<td>${r.cr}</td>
<td>${r.hp[0]}-${r.hp[1]}</td>
<td>${r.ac}</td>
<td>+${r.ab}</td>
<td>${r.dc}</td>
<td>${r.dpr[0]}-${r.dpr[1]}</td>
</tr>`;
});

calculateCR();
