class Shikaku extends Puzzle {
  constructor(parent) {
    super(parent);
    this.name = "Shikaku";
    this.cellType = Cell;
    this.useWalls = true;
    this.useBridges = true;
    this.initialize();
  }

  // What to do when a cell is clicked
  // If configured to mark vertices: left click toggles walls, right click toggles bridges
  // If configured to mark cells and cell has clue, toggle clue certainty
  clickCell(cell, event, leftClick = true) {
    if (this.parent.currMark == "vertices") {
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
