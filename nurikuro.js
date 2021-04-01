class Nurikuro extends Puzzle {
  constructor(parent) {
    super(parent);
    this.name = "Nurikuro";
    this.cellType = Cell;
    this.initialize();
  }

  // When cell is clicked: Toggle status
  // Possible statuses: Uncertain, shaded, unshaded
  clickCell(cell, event, leftClick = true) {
    if (~cell.value) {
      cell.markUnshaded();
    } else cell.toggleShading(leftClick);
    this.update();

    // Linked board updates:
    // Nurikabe shaded cells are Fillomino liars
    // Copy shadedness to Nurikabe puzzle
    if (cell.shaded) {
      this.parent.fillomino.board[cell.row][cell.column].markFalseClue();
    } else if (cell.unshaded) {
      this.parent.fillomino.board[cell.row][cell.column].markTrueClue();
    } else {
      this.parent.fillomino.board[cell.row][cell.column].markUncertainClue();
    }
    this.parent.fillomino.update();
    this.parent.nurikabe.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.nurikabe.board[cell.row][cell.column].unshaded = cell.unshaded;
    this.parent.nurikabe.update();
  }
}
