class SlitherlinkCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }
}

class Slitherlink extends Puzzle {
  constructor(parent) {
    super(parent);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        this.board[row][col] = new SlitherlinkCell(row, col);
      }
    }
    this.populateNeighbors();
  }
}
