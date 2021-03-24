class HeyawakeCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";

    this.node.className = "heyawake cell";
    this.walls.top && this.node.classList.add("topwall");
    this.walls.left && this.node.classList.add("leftwall");
    this.walls.right && this.node.classList.add("rightwall");
    this.walls.bottom && this.node.classList.add("bottomwall");
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    // If there is a value in the cell, indicate the truth status of that clue
    if (~this.value) {
      this.node.innerText = String(this.value);
      this.node.classList.add("clue");
      if (this.clueCertainty) {
        if (!this.realClue) {
          this.node.classList.add("false");
        } else {
          this.node.classList.add("true");
          const truthRing = document.createElement("div");
          truthRing.classList.add("true", "clue");
          this.node.appendChild(truthRing);
        }
      }
    }
  }
}

class Heyawake extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = HeyawakeCell;
    this.initializeCells();
  }

  // What happens when a cell is clicked in Heyawake
  // If configured to mark vertices, toggle walls
  // If configured to mark cells:
  // If cell has a clue, toggle cell shadedness (left click) or clue truth (right click)
  // If cell has no clue, toggle cell shadedness
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      cell.toggleWall(cell.eventDirection(event));
    } else if (~cell.value) {
      leftClick ? cell.toggleShading() : cell.toggleCertainty();
    } else {
      cell.toggleShading(leftClick);
    }
    this.update();
  }
}
