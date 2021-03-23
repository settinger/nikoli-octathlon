class FillominoCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }
}

class Fillomino extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = FillominoCell;
    this.initializeCells();
  }
}
