class Fillomino extends Puzzle {
  constructor(parent) {
    super(parent);
    this.name = "Fillomino";
    this.cellType = Cell;
    this.useWalls = true;
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
