class Hitori extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = Cell;
    this.initialize();
  }

  // When cell is clicked: Toggle status
  // Possible statuses: Uncertain, shaded, unshaded
  clickCell(cell, event, leftClick = true) {
    cell.toggleShading(leftClick);
    this.update();

    // Linked board events:
    // Transfer shading to Akari board and Hitorilink board
    this.parent.hitorilink.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.hitorilink.board[cell.row][cell.column].unshaded =
      cell.unshaded;
    this.parent.hitorilink.update();

    if (cell.shaded) {
      this.parent.akari.board[cell.row][cell.column].markWall();
    } else if (cell.unshaded) {
      this.parent.akari.board[cell.row][cell.column].markUnshaded();
    } else {
      this.parent.akari.board[cell.row][cell.column].markVague();
    }
    this.parent.akari.update();
  }
}
