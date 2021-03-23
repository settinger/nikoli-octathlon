// Classes for Akari cells and grids

class AkariCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.value = -1; // Given value of cell
    this.clueCertainty = false; // Do we know for sure if the cell contains a true or false clue?
    this.realClue = false; // If clueCertainty == true, Is the cell a real clue or a false clue?
    this.auxMark = false; // Presence of an auxiliary mark (i.e. no lamp, no wall)
    this.wall = false; // Presence of wall in cell
    this.lamp = false; // Presence of lamp in cell
    this.illuminated = false; // Illumination status of cell
  }

  illuminate() {
    this.clueCertainty = true; // We are certain that any given clues are false
    this.realClue = false;
    this.illuminated = true;
    this.wall = false;
  }

  // Mark a cell as uncertain
  markUncertain() {
    this.clueCertainty = false;
  }

  // Mark a ceil as known not a wall, but that's it
  markVague() {
    this.clueCertainty = true;
    this.realClue = false;
    this.auxMark = false;
    this.wall = false;
    this.lamp = false;
  }

  // Mark a cell as known not a wall, not a lamp
  markAux() {
    this.clueCertainty = true; // We are certain that any givens are false
    this.realClue = false; // Any givens in this cell are false
    this.auxMark = true;
    this.wall = false;
    this.lamp = false;
  }

  // Mark a cell as a lamp
  markLamp() {
    this.clueCertainty = true;
    this.realClue = false;
    this.lamp = true;
    this.wall = false;
  }

  // Mark a cell as a wall
  markWall() {
    this.clueCertainty = true; // We are certain that any given clues are true
    this.realClue = true;
    this.auxMark = false;
    this.wall = true;
    this.lamp = false;
    this.illuminated = false;
  }

  // Update cell's html representation
  update() {
    this.node.innerHTML = "";
    if (
      (!this.clueCertainty && ~this.value) ||
      (this.clueCertainty && this.realClue && ~this.value)
    ) {
      this.node.innerText = String(this.value);
    }
    // Clear CSS classes and re-assign
    this.node.className = "akari cell";
    this.wall && this.node.classList.add("wall");
    this.lamp && this.node.classList.add("lamp");
    this.illuminated && this.node.classList.add("illuminated");
    this.auxMark && this.node.classList.add("marked");
    this.node.classList.add(this.clueCertainty ? "certain" : "uncertain");

    // If there is a lamp in the cell, add a big circle
    if (this.lamp) {
      const light = document.createElement("div");
      light.classList.add("lamp");
      this.node.appendChild(light);
    }

    // If there is an auxiliary mark in the cell, add a small green circle
    if (this.auxMark && this.clueCertainty) {
      const dot = document.createElement("div");
      dot.classList.add("marked");
      this.node.appendChild(dot);
    }
  }
}

class Akari extends Puzzle {
  constructor(parent) {
    super(parent);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const newCell = new AkariCell(row, col);
        newCell.node.addEventListener("click", (event) => {
          event.preventDefault();
          this.clickCell(newCell);
        });
        newCell.node.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          this.clickCell(newCell, false);
        });
        this.board[row][col] = newCell;
      }
    }
    this.populateNeighbors();
  }

  // Initialize the puzzle with givens
  populate(array) {
    for (let row = 0; row < array.length; row++) {
      for (let col = 0; col < array[0].length; col++) {
        this.board[row][col].value = array[row][col];
      }
    }
  }

  // Return a list of all cells with lamps
  lamps() {
    return this.board.flat().filter((cell) => cell.lamp);
  }

  // Check completeness of solution
  complete() {
    return this.board.flat().some((cell) => !cell.clueCertainty);
  }

  // Check that the right number of lamps are around each clue
  correctLamps() {
    for (let cell of this.board.flat()) {
      if (cell.clueCertainty && cell.realClue && cell.value >= 0) {
        // Get the number of lamps there *should* be around the cell
        const correctNumLamps = cell.value;

        // Get the number of actual lamps around the cell
        const certainLamps = Object.values(cell.neighbors).filter(
          (neighbor) => neighbor.lamp
        ).length;

        // Get the number of uncertain cells around the cell
        const uncertainCells = Object.values(cell.neighbors).filter(
          (neighbor) => !neighbor.clueCertainty || !neighbor.cellCertainty
        ).length;

        // Test fails if there are too many lamps or not enough possible
        if (
          certainLamps > correctNumLamps ||
          correctNumLamps < certainLamps + uncertainCells
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // Check that no lamps can see each other
  noSeeLamp() {
    for (let lampCell in this.lamps()) {
      let newCell = lampCell;

      // Look for lamps upward
      while (1) {
        newCell = newCell.neighbors.top;
        if (!~newCell) {
          break;
        }
        if (!newCell.clueCertainty || newCell.wall) {
          break;
        }
        if (newCell.lamp) {
          return false;
        }
      }

      // Look for lamps downward
      newCell = lampCell;
      while (1) {
        newCell = newCell.neighbors.bottom;
        if (!~newCell) {
          break;
        }
        if (!newCell.clueCertainty || newCell.wall) {
          break;
        }
        if (newCell.lamp) {
          return false;
        }
      }

      // Look for lamps leftward
      newCell = lampCell;
      while (1) {
        newCell = newCell.neighbors.left;
        if (!~newCell) {
          break;
        }
        if (!newCell.clueCertainty || newCell.wall) {
          break;
        }
        if (newCell.lamp) {
          return false;
        }
      }

      // Look for lamps rightward
      newCell = lampCell;
      while (1) {
        newCell = newCell.neighbors.right;
        if (!~newCell) {
          break;
        }
        if (!newCell.clueCertainty || newCell.wall) {
          break;
        }
        if (newCell.lamp) {
          return false;
        }
      }
    }
    return true;
  }

  // illuminate all definitely-not-wall cells in 4 directions from each laps
  illuminateBoard() {
    // Remove all illumination from board
    this.board.flat().forEach((cell) => {
      cell.illuminated = false;
    });

    // Apply lumination
    for (let lampCell of this.lamps()) {
      // Illuminate all possible cells
      lampCell.illuminate();
      let newCell = lampCell;

      // Illuminate cells upward
      while (1) {
        newCell = newCell.neighbors.top;
        if (!~newCell) {
          break;
        }
        if (newCell.clueCertainty && !newCell.wall) {
          newCell.illuminate();
        } else {
          break;
        }
      }

      // Reset current row/column, illuminate cells downward
      newCell = lampCell;
      while (1) {
        newCell = newCell.neighbors.bottom;
        if (!~newCell) {
          break;
        }
        if (newCell.clueCertainty && !newCell.wall) {
          newCell.illuminate();
        } else {
          break;
        }
      }

      // Reset current row/column, illuminate cells leftward
      newCell = lampCell;
      while (1) {
        newCell = newCell.neighbors.left;
        if (!~newCell) {
          break;
        }
        if (newCell.clueCertainty && !newCell.wall) {
          newCell.illuminate();
        } else {
          break;
        }
      }

      // Reset current row/column, illuminate cells rightward
      newCell = lampCell;
      while (1) {
        newCell = newCell.neighbors.right;
        if (!~newCell) {
          break;
        }
        if (newCell.clueCertainty && !newCell.wall) {
          newCell.illuminate();
        } else {
          break;
        }
      }
    }
  }

  // Place a lamp (illuminate all definitely-not-wall cells in 4 directions)
  placeLamp(row, col) {
    const cell = this.board[row][col];
    cell.illuminate();
    cell.lamp = true;
  }

  // Update the table element
  update() {
    this.illuminateBoard();
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

  // What happens when a cell is clicked in Akari:
  // Toggle between the following conditions:
  // Uncertain, certain but indetermined, certain wall, certain lamp, certain unmarked
  clickCell(cell, forward = true) {
    if (!cell.clueCertainty) {
      forward ? cell.markVague() : cell.markAux();
    } else if (!cell.wall && !cell.auxMark && !cell.lamp) {
      forward ? cell.markWall() : cell.markUncertain();
    } else if (cell.wall) {
      forward ? cell.markLamp() : cell.markVague();
    } else if (cell.lamp) {
      forward ? cell.markAux() : cell.markWall();
    } else {
      forward ? cell.markUncertain() : cell.markLamp();
    }
    this.update();
  }
}
