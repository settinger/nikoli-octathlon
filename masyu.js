class MasyuCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }
}

class Masyu extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = MasyuCell;
    this.initializeCells();
  }
}
