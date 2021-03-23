class SlitherlinkCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.walls = { top: false, left: false, right: false, bottom: false };
    this.crosses = { top: false, left: false, right: false, bottom: false };
  }
}

class Slitherlink extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = SlitherlinkCell;
    this.initializeCells();

    // Add initial wall state
    for (let cell of this.board.flat()) {
      cell.walls = {
        top: cell.row == 0,
        left: cell.column == 0,
        right: cell.column == this.columns - 1,
        bottom: cell.row == this.rows - 1,
      };
    }
  }
}
