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

    // Most games use some of the following properties
    this.value = -1;
    this.shaded = false;
    this.unshaded = false;
    this.clueCertainty = false;
    this.realClue = false;
    this.loops = { top: false, left: false, right: false, bottom: false };
    this.crosses = { top: false, left: false, right: false, bottom: false };
    this.walls = { top: false, left: false, right: false, bottom: false };
  }

  // Most games use some of the following methods
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

  // If an event occurs within the cell, get coordinates of the event
  // [0, 0] = center of cell
  // Positive x = right side of cell
  // Positive y = bottom of cell
  eventDirection(event) {
    let [x, y] = [
      event.offsetX - this.width / 2,
      event.offsetY - this.height / 2,
    ];
    // Figure out if event is in the top, left, right, or bottom of cell
    if (x < 0 && -x > Math.abs(y)) {
      return { direction: "left", opposite: "right" };
    } else if (x > 0 && x > Math.abs(y)) {
      return { direction: "right", opposite: "left" };
    } else if (y > 0 && y > Math.abs(x)) {
      return { direction: "bottom", opposite: "top" };
    } else {
      return { direction: "top", opposite: "bottom" };
    }
  }

  // Add or remove a wall
  toggleWall(direction) {
    const dir = direction.direction;
    const opp = direction.opposite;
    const neighbor = this.neighbors[dir];
    if (~neighbor) {
      this.walls[dir] = !this.walls[dir];
      neighbor.walls[opp] = !neighbor.walls[opp];
    }
  }

  // Cycle between loop segment options: Uncertain, loop segment, loop cross
  toggleLoop(direction, leftClick = true) {
    const dir = direction.direction;
    const opp = direction.opposite;
    const neighbor = this.neighbors[dir];
    if (~neighbor) {
      if (!this.loops[dir] && !this.crosses[dir]) {
        // Option 1: Neither loop nor cross on vertex. If left-click, add loop; if right-click, add cross
        this.loops[dir] = leftClick;
        neighbor.loops[opp] = leftClick;
        this.crosses[dir] = !leftClick;
        neighbor.crosses[opp] = !leftClick;
      } else if (this.loops[dir]) {
        // Option 2: Loop on vertex. If left-click, change to cross; if right-click, remove loop
        this.loops[dir] = false;
        neighbor.loops[opp] = false;
        this.crosses[dir] = leftClick;
        neighbor.crosses[opp] = leftClick;
      } else {
        // Option 3: Cross on vertex. If left-click, remove cross; if right-click, change to loop
        this.loops[dir] = !leftClick;
        neighbor.loops[opp] = !leftClick;
        this.crosses[dir] = false;
        neighbor.crosses[opp] = false;
      }
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
        // Initialize boundary grid walls (not all puzzles use this)
        newCell.walls = {
          top: row == 0,
          bottom: row == this.rows - 1,
          left: col == 0,
          right: col == this.columns - 1,
        };

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
    this.board.flat().forEach((cell) => {
      cell.value = array[cell.row][cell.column];
    });
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
