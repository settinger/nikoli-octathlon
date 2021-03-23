class HitoriCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }
}

class Hitori extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = HitoriCell;
    this.initializeCells();
  }
}
