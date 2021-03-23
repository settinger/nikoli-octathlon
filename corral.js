class CorralCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }
}

class Corral extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = CorralCell;
    this.initializeCells();
  }
}
