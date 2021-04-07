// Initialize Octathlon class
const game = new Octathlon(10, 10);

// Get some fixed divs
const $container = $("container");
const $indicator = $("indicator");
$container.classList.add("mark-cells");
const $snapshot = $("snapshot");
$snapshot.addEventListener("click", (e) => game.download());
const $restore = $("restore");
$restore.addEventListener("click", (e) => game.upload());

const toggle = (e) => {
  if (
    e instanceof MouseEvent ||
    (e instanceof KeyboardEvent && e.code == "Space")
  ) {
    e.preventDefault();
    game.markPref = game.markPref == "vertices" ? "cells" : "vertices";
    game.currMark = game.markPref;
    $container.classList.toggle("mark-cells");
    $container.classList.toggle("mark-vertices");
    $("inputStatus").innerText =
      game.markPref == "vertices"
        ? "Current input mostly affects vertices."
        : "Current input mostly affects cells.";
  }
};
document.addEventListener("keypress", toggle);
$indicator.addEventListener("click", toggle);

// Generate the text box that indicates current input methods available
const inputsDivTop = document.createElement("div");
inputsDivTop.id = "inputMethodsTop";
$container.appendChild(inputsDivTop);

const inputsDivBottom = document.createElement("div");
inputsDivBottom.id = "inputMethodsBottom";
$container.appendChild(inputsDivBottom);

// Generate the grid of puzzles

const kurodokoDiv = document.createElement("div");
kurodokoDiv.style.gridColumn = 3;
kurodokoDiv.style.gridRow = 1;
kurodokoDiv.classList.add("puzzle", "kurodoko");
kurodokoDiv.innerHTML = `
<div class="puzzleName"><a href="#nurikuro-rules">Kurodoko</a></div>`;
kurodokoDiv.appendChild(game.kurodoko.node);
$container.appendChild(kurodokoDiv);
game.kurodoko.populate(nurikabeGivens);
game.kurodoko.update();

const nurikabeDiv = document.createElement("div");
nurikabeDiv.style.gridColumn = 4;
nurikabeDiv.style.gridRow = 1;
nurikabeDiv.classList.add("puzzle", "nurikabe");
nurikabeDiv.innerHTML = `
<div class="puzzleName"><a href="#nurikuro-rules">Nurikabe</a></div>`;
nurikabeDiv.appendChild(game.nurikabe.node);
$container.appendChild(nurikabeDiv);
game.nurikabe.populate(nurikabeGivens);
game.nurikabe.update();

const akariDiv = document.createElement("div");
akariDiv.style.gridColumn = 1;
akariDiv.style.gridRow = 2;
akariDiv.classList.add("puzzle", "akari");
akariDiv.innerHTML = `
<div class="puzzleName"><a href="#akari-rules">Akari</a></div>`;
akariDiv.appendChild(game.akari.node);
$container.appendChild(akariDiv);
game.akari.populate(akariGivens);
game.akari.addButton();
game.akari.update();

const heyawakeDiv = document.createElement("div");
heyawakeDiv.style.gridColumn = 3;
heyawakeDiv.style.gridRow = 2;
heyawakeDiv.classList.add("puzzle", "heyawake");
heyawakeDiv.innerHTML = `
<div class="puzzleName"><a href="#heyawake-rules">Heyawake</a></div>
<div class="rules">Clues are real only if in<br/>top-left corner of a room</div>`;
heyawakeDiv.appendChild(game.heyawake.node);
$container.appendChild(heyawakeDiv);
game.heyawake.populate(heyawakeGivens);
game.heyawake.update();

const nurikuroDiv = document.createElement("div");
nurikuroDiv.style.gridColumn = 4;
nurikuroDiv.style.gridRow = 2;
nurikuroDiv.classList.add("puzzle", "nurikabe");
nurikuroDiv.innerHTML = `
<div class="puzzleName"><a href="#nurikuro-rules">Nurikabe + Kurodoko</a></div>`;
nurikuroDiv.appendChild(game.nurikuro.node);
$container.appendChild(nurikuroDiv);
game.nurikuro.populate(nurikabeGivens);
game.nurikuro.update();

const shikakuDiv = document.createElement("div");
shikakuDiv.style.gridColumn = 2;
shikakuDiv.style.gridRow = 2;
shikakuDiv.classList.add("puzzle", "shikaku");
shikakuDiv.innerHTML = `
<div class="puzzleName"><a href="#shikaku-rules">Shikaku</a></div>`;
shikakuDiv.appendChild(game.shikaku.node);
$container.appendChild(shikakuDiv);
game.shikaku.populate(shikakuGivens);
game.shikaku.update();

const countryDiv = document.createElement("div");
countryDiv.style.gridColumn = 3;
countryDiv.style.gridRow = 3;
countryDiv.classList.add("puzzle", "countryroad");
countryDiv.innerHTML = `
<div class="puzzleName"><a href="#country-road-rules">Country Road</a></div>
<div class="rules">At most one clue per room</div>`;
countryDiv.appendChild(game.countryRoad.node);
$container.appendChild(countryDiv);
game.countryRoad.populate(countryRoadGivens);
game.countryRoad.update();

const fillominoDiv = document.createElement("div");
fillominoDiv.style.gridColumn = 4;
fillominoDiv.style.gridRow = 3;
fillominoDiv.classList.add("puzzle", "fillomino");
fillominoDiv.innerHTML = `
<div class="puzzleName"><a href="#fillomino-rules">Fillomino</a></div>`;
fillominoDiv.appendChild(game.fillomino.node);
$container.appendChild(fillominoDiv);
game.fillomino.populate(fillominoGivens);
game.fillomino.update();

const hitoriDiv = document.createElement("div");
hitoriDiv.style.gridColumn = 1;
hitoriDiv.style.gridRow = 4;
hitoriDiv.classList.add("puzzle", "hitori");
hitoriDiv.innerHTML = `
<div class="puzzleName"><a href="#hitorilink-rules">Hitori</a></div>`;
hitoriDiv.appendChild(game.hitori.node);
$container.appendChild(hitoriDiv);
game.hitori.update();

const slitherlinkDiv = document.createElement("div");
slitherlinkDiv.style.gridColumn = 2;
slitherlinkDiv.style.gridRow = 4;
slitherlinkDiv.classList.add("puzzle", "slitherlink");
slitherlinkDiv.innerHTML = `
<div class="puzzleName"><a href="#hitorilink-rules">Slitherlink</a></div>
<div class="rules">Clue in every cell</div>`;
slitherlinkDiv.appendChild(game.slitherlink.node);
$container.appendChild(slitherlinkDiv);
game.slitherlink.update();

const hitorilinkDiv = document.createElement("div");
hitorilinkDiv.style.gridColumn = 1;
hitorilinkDiv.style.gridRow = 3;
hitorilinkDiv.classList.add("puzzle", "hitori", "hitorilink");
hitorilinkDiv.innerHTML = `
<div class="puzzleName"><a href="#hitorilink-rules">Hitori + Slitherlink</a></div>`;
hitorilinkDiv.appendChild(game.hitorilink.node);
$container.appendChild(hitorilinkDiv);
game.hitorilink.populate(hitoriGivens);
game.hitorilink.update();

const corralDiv = document.createElement("div");
corralDiv.style.gridColumn = 3;
corralDiv.style.gridRow = 4;
corralDiv.classList.add("puzzle", "corral");
corralDiv.innerHTML = `
<div class="puzzleName"><a href="#corralsyu-rules">Corral</a></div>`;
corralDiv.appendChild(game.corral.node);
$container.appendChild(corralDiv);
game.corral.update();

const masyuDiv = document.createElement("div");
masyuDiv.style.gridColumn = 4;
masyuDiv.style.gridRow = 4;
masyuDiv.classList.add("puzzle", "masyu");
masyuDiv.innerHTML = `
<div class="puzzleName"><a href="#corralsyu-rules">Masyu</a></div>`;
masyuDiv.appendChild(game.masyu.node);
$container.appendChild(masyuDiv);
game.masyu.populate(masyuGivens);
game.masyu.update();

const corralsyuDiv = document.createElement("div");
corralsyuDiv.style.gridColumn = 2;
corralsyuDiv.style.gridRow = 3;
corralsyuDiv.classList.add("puzzle", "corralsyu", "corral", "masyu");
corralsyuDiv.innerHTML = `
<div class="puzzleName"><a href="#corralsyu-rules">Corral + Masyu</a></div>`;
corralsyuDiv.appendChild(game.corralsyu.node);
$container.appendChild(corralsyuDiv);
game.corralsyu.populate(corralGivens, masyuGivens);
game.corralsyu.update();
