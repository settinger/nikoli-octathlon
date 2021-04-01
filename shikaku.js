class ShikakuCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  /*
  // Update cell's html representation
  update() {
    this.node.innerHTML = "";

    // Clear CSS classes and re-assign
    this.node.className = `shikaku cell row${this.row} col${this.column}`;
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
  */
}

class Shikaku extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = ShikakuCell;
    this.initialize();
  }

  // What to do when a cell is clicked
  // If configured to mark vertices: left click toggles walls, right click toggles bridges
  // If configured to mark cells and cell has clue, toggle clue certainty
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      cell.toggleWall(cell.eventDirection(event), leftClick);
    } else {
      if (!~cell.value) {
        return;
      }
      cell.toggleCertainty(leftClick);
    }
    this.update();

    // Linked board events:
    // If clue is marked true, place lightbulb in Akari and mark Hitori + Hitorilink as unshaded
    // If clue is marked false/uncertain and Akari is a lightbulb, convert Akari cell to uncertain
    // Copy walls of cell (and neighbors) to Heyawake
    if (cell.clueCertainty && cell.realClue) {
      this.parent.akari.board[cell.row][cell.column].markLamp();
      this.parent.akari.update();
      this.parent.hitori.board[cell.row][cell.column].markUnshaded();
      this.parent.hitori.update();
      this.parent.hitorilink.board[cell.row][cell.column].markUnshaded();
      this.parent.hitorilink.update();
    }
    if (
      (!cell.clueCertainty || !cell.realClue) &&
      this.parent.akari.board[cell.row][cell.column].lamp
    ) {
      this.parent.akari.board[cell.row][cell.column].markVague();
      this.parent.akari.board[cell.row][cell.column].markUncertainClue();
      this.parent.akari.update();
      this.parent.hitori.board[cell.row][cell.column].markVague();
      this.parent.hitori.update();
      this.parent.hitorilink.board[cell.row][cell.column].markVague();
      this.parent.hitorilink.update();
    }

    cell.transfer(this.parent.heyawake, "walls");
    cell.transfer(this.parent.heyawake, "bridges");
    this.parent.heyawake.update();
  }
}
