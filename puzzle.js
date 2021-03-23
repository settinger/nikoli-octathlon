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

    // Most games use the following properties
    this.value = -1;
    this.shaded = false;
    this.unshaded = false;
    this.clueCertainty = false;
    this.realClue = false;
  }

  // Most games use the following methods
  markTrueClue() {
    this.clueCertainty = true;
    this.realClue = true;
  }
  markFalseClue() {
    this.clueCertainty = true;
    this.realClue = false;
  }
  markUncertainClue() {
    this.clueCertainty = false;
  }
  markVague() {
    this.shaded = false;
    this.unshaded = false;
  }
  markShaded() {
    this.shaded = true;
    this.unshaded = false;
  }
  markUnshaded() {
    this.shaded = false;
    this.unshaded = true;
  }

  // Toggle clue certainty
  // Possible options: Uncertain, certain and clue is true, certain and clue is false;
  toggleCertainty(leftClick = true) {
    if (!this.clueCertainty) {
      leftClick ? this.markTrueClue() : this.markFalseClue();
    } else if (this.realClue) {
      leftClick ? this.markFalseClue() : this.markUncertainClue();
    } else {
      leftClick ? this.markUncertainClue() : this.markTrueClue();
    }
  }

  // Toggle cell shading
  // Possible options: Uncertain, shaded, unshaded
  toggleShading(leftClick = true) {
    if (!this.shaded && !this.unshaded) {
      leftClick ? this.markShaded() : this.markUnshaded();
    } else if (this.shaded) {
      leftClick ? this.markUnshaded() : this.markVague();
    } else {
      leftClick ? this.markVague() : this.markShaded();
    }
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
    this.cellType = Cell;
  }

  // Initially, this.board is an empty 2d array. initializeCells() has to be called in order to fill in the board.
  initializeCells() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        // Initialize a new cell
        let newCell = new this.cellType(row, col);

        // Add left-click and right-click events for cell
        newCell.node.addEventListener("click", (event) => {
          event.preventDefault();
          this.clickCell(newCell, event);
        });
        newCell.node.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          this.clickCell(newCell, event, false);
        });

        this.board[row][col] = newCell;
      }
    }

    // Once every cell in the board is populated, fill in the cell neighbors property
    this.populateNeighbors();
  }

  // Every cell has a neighbors property that should be filled in
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

  // Initialize the cell values from a given array
  populate(array) {
    for (let row = 0; row < array.length; row++) {
      for (let col = 0; col < array[0].length; col++) {
        this.board[row][col].value = array[row][col];
      }
    }
  }

  // The method called when a cell is clicked
  clickCell(cell, event, leftClick = true) {}

  // Update the table element
  update() {
    // Clear existing grid
    this.node.innerHTML = "";
    for (let row of this.board) {
      const newRow = document.createElement("tr");
      for (let cell of row) {
        cell.update();
        newRow.appendChild(cell.node);
      }
      const padding = document.createElement("td");
      padding.classList.add("table-padding");
      newRow.appendChild(padding);
      this.node.appendChild(newRow);
    }
  }
}
