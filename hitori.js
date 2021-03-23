class HitoriCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }
}

class Hitori extends Puzzle {
  constructor(parent) {
    super(parent);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        this.board[row][col] = new HitoriCell(row, col);
      }
    }
    this.populateNeighbors();
  }
}
