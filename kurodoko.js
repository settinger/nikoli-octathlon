class KurodokoCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.value = -1;
    this.upperBound = -1;
    this.lowerBound = -1;
    this.shaded = false;
    this.unshaded = false;
  }
}

class Kurodoko extends Puzzle {
  constructor(parent) {
    super(parent);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        this.board[row][col] = new KurodokoCell(row, col);
      }
    }
    this.populateNeighbors();
  }
}
