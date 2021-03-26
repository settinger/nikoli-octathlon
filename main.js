// Initialize Octathlon class
const game = new Octathlon(10, 10);

// Get some fixed divs
const $container = document.getElementById("container");
const $indicator = document.getElementById("indicator");
$container.classList.add("mark-cells");
$indicator.innerText = "Mark cell centers";
const $snapshot = document.getElementById("snapshot");
$snapshot.addEventListener("click", (e) => game.download());
const $restore = document.getElementById("restore");
$restore.addEventListener("click", (e) => game.upload());

const toggle = (e) => {
  if (
    e instanceof MouseEvent ||
    (e instanceof KeyboardEvent && e.code == "Space")
  ) {
    e.preventDefault();
    game.markVertices = !game.markVertices;
    $container.classList.toggle("mark-cells");
    $container.classList.toggle("mark-vertices");
    $indicator.innerText = game.markVertices
      ? "Mark cell vertices"
      : "Mark cell centers";
  }
};
document.addEventListener("keypress", toggle);
$indicator.addEventListener("click", toggle);

// Generate the grid of puzzles

// The Kurodoko grid in row 1, column 3
const kurodokoDiv = document.createElement("div");
kurodokoDiv.style.gridColumn = 3;
kurodokoDiv.style.gridRow = 1;
kurodokoDiv.classList.add("puzzle", "kurodoko");
kurodokoDiv.innerHTML = `
<div class="puzzleName">Kurodoko</div>
<div class="rules">Same shaded cells as Heyawake<br/>
Sum clues with Nurikabe clues
</div>
`;
kurodokoDiv.appendChild(game.kurodoko.node);
$container.appendChild(kurodokoDiv);
game.kurodoko.populate(nurikabeGivens);
game.kurodoko.update();

// Nurikabe grid in row 1 column 4
const nurikabeDiv = document.createElement("div");
nurikabeDiv.style.gridColumn = 4;
nurikabeDiv.style.gridRow = 1;
nurikabeDiv.classList.add("puzzle", "nurikabe");
nurikabeDiv.innerHTML = `
<div class="puzzleName">Nurikabe</div>
<div class="rules">Sum clues with Kurodoko clues<br/>
Nurikabe shaded cells are Fillomino liars</div>`;
nurikabeDiv.appendChild(game.nurikabe.node);
$container.appendChild(nurikabeDiv);
game.nurikabe.populate(nurikabeGivens);
game.nurikabe.update();

// Nuri-koro grid in row 2 column 4
// Nurikabe grid in row 1 column 4
const nurikoroDiv = document.createElement("div");
nurikoroDiv.style.gridColumn = 4;
nurikoroDiv.style.gridRow = 2;
nurikoroDiv.classList.add("puzzle", "nurikabe");
nurikoroDiv.innerHTML = `
<div class="puzzleName">Nurikabe+Kurodoko</div>
<div class="rules">Clues are sum of Nurikabe and Kurodoko clues<br/>
Nurikabe shaded cells are Fillomino liars</div>`;
nurikoroDiv.appendChild(game.nurikoro.node);
$container.appendChild(nurikoroDiv);
game.nurikoro.populate(nurikabeGivens);
game.nurikoro.update();

const akariDiv = document.createElement("div");
akariDiv.style.gridColumn = 1;
akariDiv.style.gridRow = 2;
akariDiv.classList.add("puzzle", "akari");
akariDiv.innerHTML = `
<div class="puzzleName">Akari</div>
<div class="rules">Clue in wall: real clue<br/>
Clue not in wall: ignore number<br/>
Walls same as Hitori shaded cells<br/>
Akari light bulb <-> Real Shikaku clue
</div>
`;
akariDiv.appendChild(game.akari.node);
$container.appendChild(akariDiv);
game.akari.populate(akariGivens);
game.akari.update();

const shikakuDiv = document.createElement("div");
shikakuDiv.style.gridColumn = 2;
shikakuDiv.style.gridRow = 2;
shikakuDiv.classList.add("puzzle", "shikaku");
shikakuDiv.innerHTML = `
<div class="puzzleName">Shikaku</div>
<div class="rules">Akari light bulb <-> Real Shikaku clue<br/>
Same rectangles in Shikaku and Heyawake</div>`;
shikakuDiv.appendChild(game.shikaku.node);
$container.appendChild(shikakuDiv);
game.shikaku.populate(shikakuGivens);
game.shikaku.update();

const heyawakeDiv = document.createElement("div");
heyawakeDiv.style.gridColumn = 3;
heyawakeDiv.style.gridRow = 2;
heyawakeDiv.classList.add("puzzle", "heyawake");
heyawakeDiv.innerHTML = `
<div class="puzzleName">Heyawake</div>
<div class="rules">Clues are real only if in top-left corner of a room<br/>
Same rectangles in Shikaku and Heyawake<br/>
Same shaded cells in Heyawake and Kurodoko</div>`;
heyawakeDiv.appendChild(game.heyawake.node);
$container.appendChild(heyawakeDiv);
game.heyawake.populate(heyawakeGivens);
game.heyawake.update();

const countryDiv = document.createElement("div");
countryDiv.style.gridColumn = 3;
countryDiv.style.gridRow = 3;
countryDiv.classList.add("puzzle", "countryroad");
countryDiv.innerHTML = `
<div class="puzzleName">Country Road</div>
<div class="rules">At most one clue per room<br/>
Same rooms as Fillomino<br/>
Same loop as Masyu</div>`;
countryDiv.appendChild(game.countryRoad.node);
$container.appendChild(countryDiv);
game.countryRoad.populate(countryRoadGivens);
game.countryRoad.update();

const fillominoDiv = document.createElement("div");
fillominoDiv.style.gridColumn = 4;
fillominoDiv.style.gridRow = 3;
fillominoDiv.classList.add("puzzle", "fillomino");
fillominoDiv.innerHTML = `
<div class="puzzleName">Fillomino</div>
<div class="rules">Same rooms as Country Road<br/>
Nurikabe shaded cells are liars</div>`;
fillominoDiv.appendChild(game.fillomino.node);
$container.appendChild(fillominoDiv);
game.fillomino.populate(fillominoGivens);
game.fillomino.update();

const hitoriDiv = document.createElement("div");
hitoriDiv.style.gridColumn = 1;
hitoriDiv.style.gridRow = 4;
hitoriDiv.classList.add("puzzle", "hitori");
hitoriDiv.innerHTML = `
<div class="puzzleName">Hitori</div>
<div class="rules">Shaded cells same as Akari walls<br/>
Add numbers mod 10 to Slitherlink clues</div>`;
hitoriDiv.appendChild(game.hitori.node);
$container.appendChild(hitoriDiv);
game.hitori.update();

const slitherlinkDiv = document.createElement("div");
slitherlinkDiv.style.gridColumn = 2;
slitherlinkDiv.style.gridRow = 4;
slitherlinkDiv.classList.add("puzzle", "slitherlink");
slitherlinkDiv.innerHTML = `
<div class="puzzleName">Slitherlink</div>
<div class="rules">Clue in every cell<br/>
Same loop as Corral<br/>
Add clues mod 10 to Hitori numbers</div>`;
slitherlinkDiv.appendChild(game.slitherlink.node);
$container.appendChild(slitherlinkDiv);
game.slitherlink.update();

const hitorilinkDiv = document.createElement("div");
hitorilinkDiv.style.gridColumn = 1;
hitorilinkDiv.style.gridRow = 3;
hitorilinkDiv.classList.add("puzzle", "hitori", "hitorilink");
hitorilinkDiv.innerHTML = `
<div class="puzzleName">Hitori + Slitherlink</div>
<div class="rules">Slitherlink clue + Hitori clue, mod 10, equals given clue<br/>
Same shaded cells as Akari</div>`;
hitorilinkDiv.appendChild(game.hitorilink.node);
$container.appendChild(hitorilinkDiv);
game.hitorilink.populate(hitoriGivens);
game.hitorilink.update();

const corralDiv = document.createElement("div");
corralDiv.style.gridColumn = 3;
corralDiv.style.gridRow = 4;
corralDiv.classList.add("puzzle", "corral");
corralDiv.innerHTML = `
<div class="puzzleName">Corral</div>
<div class="rules">Same loop as Slitherlink<br/>
If correct clue in Masyu, put number in Corral cell</div>`;
corralDiv.appendChild(game.corral.node);
$container.appendChild(corralDiv);
game.corral.update();

const masyuDiv = document.createElement("div");
masyuDiv.style.gridColumn = 4;
masyuDiv.style.gridRow = 4;
masyuDiv.classList.add("puzzle", "masyu");
masyuDiv.innerHTML = `
<div class="puzzleName">Masyu</div>
<div class="rules">Same loop as Country Road<br/>
If correct clue in Masyu, put number in Corral cell</div>`;
masyuDiv.appendChild(game.masyu.node);
$container.appendChild(masyuDiv);
game.masyu.populate(masyuGivens);
game.masyu.update();

const corralsyuDiv = document.createElement("div");
corralsyuDiv.style.gridColumn = 2;
corralsyuDiv.style.gridRow = 3;
corralsyuDiv.classList.add("puzzle", "corralsyu", "corral", "masyu");
corralsyuDiv.innerHTML = `
<div class="puzzleName">Corral + Masyu</div>
<div class="rules">If correct clue in Masyu, copy corresponding number from full Corral grid to emtpy one</div>`;
corralsyuDiv.appendChild(game.corralsyu.node);
$container.appendChild(corralsyuDiv);
game.corralsyu.populate(corralGivens, masyuGivens);
game.corralsyu.update();
