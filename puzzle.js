const make2dArray = (rows, columns, value = 0) => {
  return Array.from(Array(rows), (row) => Array.from(columns).fill(value));
};

// Generic classes for a single cell and a single puzzle grid
class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.width = 30; // Fixed value, change this later
    this.height = 30; // Fixed value, change this later
    this.neighbors = { top: -1, bottom: -1, left: -1, right: -1 };
    this.node = document.createElement("td");
  }
}

class Puzzle {
  constructor(parent) {
    this.parent = parent;
    this.rows = parent.rows;
    this.columns = parent.columns;
    this.board = make2dArray(this.rows, this.columns);
    this.complete = false;
    this.valid = true;
    this.node = document.createElement("table");
    this.node.classList.add("puzzlegrid");
  }

  populateNeighbors() {
    for (let cell of this.board.flat()) {
      if (!cell.neighbors) {
        break;
      }
      if (cell.row > 0) {
        cell.neighbors.top = this.board[cell.row - 1][cell.column];
      }
      if (cell.row < this.rows - 1) {
        cell.neighbors.bottom = this.board[cell.row + 1][cell.column];
      }
      if (cell.column > 0) {
        cell.neighbors.left = this.board[cell.row][cell.column - 1];
      }
      if (cell.column < this.columns - 1) {
        cell.neighbors.right = this.board[cell.row][cell.column + 1];
      }
    }
  }
}
