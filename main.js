const $container = document.getElementById("container");
const $indicator = document.getElementById("indicator");
$indicator.innerText = "Mark cell centers";

const game = new Octathlon(10, 10);

const toggle = (e) => {
  if (
    e instanceof MouseEvent ||
    (e instanceof KeyboardEvent && e.code == "Space")
  ) {
    e.preventDefault();
    game.markVertices = !game.markVertices;
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

const akariDiv = document.createElement("div");
akariDiv.style.gridColumn = 1;
akariDiv.style.gridRow = 2;
akariDiv.classList.add("puzzle", "akari");
akariDiv.innerHTML = `
<div class="puzzleName">Akari</div>
<div class="rules">Black cell: real clue<br/>
White cell: ignore number<br/>
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
