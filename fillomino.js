class FillominoCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's html representation
  update() {
    this.node.innerHTML = "";

    // Clear CSS classes and re-assign
    this.node.className.baseVal = `fillomino cell row${this.row} col${this.column}`;
    this.walls.top && this.node.classList.add("topwall");
    this.walls.left && this.node.classList.add("leftwall");
    this.walls.right && this.node.classList.add("rightwall");
    this.walls.bottom && this.node.classList.add("bottomwall");
    this.bridges.top && this.node.classList.add("topbridge");
    this.bridges.left && this.node.classList.add("leftbridge");
    this.bridges.right && this.node.classList.add("rightbridge");
    this.bridges.bottom && this.node.classList.add("bottombridge");
    //this.node.classList.add(this.clueCertainty ? "certain" : "uncertain");

    // If there is a value in the cell, indicate the truth status of that clue
    // If the clue is known true, add a circle div
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

class Fillomino extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = FillominoCell;
    this.initialize();
  }

  // What to do when a cell is clicked
  // If configured to mark vertices: left click toggles walls, right click toggles bridges
  // If configured to mark cells and cell has clue, toggle clue certainty
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      cell.toggleWall(cell.eventDirection(event), leftClick);
    } else if (~cell.value) {
      cell.toggleCertainty(leftClick);
    }
    this.update();

    // Linked board updates:
    // Fillomino true cells are Nurikabe unshaded cells
    // Fillomino false cells are Nurikabe shaded cells
    // Copy walls/bridges to Country Road
    if (~cell.value) {
      if (cell.clueCertainty && cell.realClue) {
        this.parent.nurikabe.board[cell.row][cell.column].markUnshaded();
        this.parent.nurikuro.board[cell.row][cell.column].markUnshaded();
      } else if (cell.clueCertainty && !cell.realClue) {
        this.parent.nurikabe.board[cell.row][cell.column].markShaded();
        this.parent.nurikuro.board[cell.row][cell.column].markShaded();
      } else {
        this.parent.nurikabe.board[cell.row][cell.column].markVague();
        this.parent.nurikuro.board[cell.row][cell.column].markVague();
      }
      this.parent.nurikabe.update();
      this.parent.nurikuro.update();
    }

    cell.transfer(this.parent.countryRoad, "walls");
    cell.transfer(this.parent.countryRoad, "bridges");
    this.parent.countryRoad.update();
  }
}
