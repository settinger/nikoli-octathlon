// Classes for Akari cells and grids

class AkariCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.auxMark = false; // Presence of an auxiliary mark (i.e. no lamp, no wall)
    this.wall = false; // Presence of wall in cell
    this.lamp = false; // Presence of lamp in cell
    this.illuminated = false; // Illumination status of cell
  }

  illuminate() {
    this.illuminated = true;
    this.wall = false;
  }

  // Mark a ceil as unknown shading
  markVague() {
    this.auxMark = false;
    this.wall = false;
    this.lamp = false;
  }

  // Mark a cell as known not a wall, not a lamp
  markAux() {
    this.auxMark = true;
    this.wall = false;
    this.lamp = false;
  }

  // Mark a cell as a lamp
  markLamp() {
    this.lamp = true;
    this.wall = false;
    this.auxMark = false;
  }

  // Mark a cell as a wall
  markWall() {
    this.auxMark = false;
    this.wall = true;
    this.lamp = false;
    this.illuminated = false;
  }

  // Cycle between shading styles for a cell: Uncertain, wall, lamp, unshaded
  toggleShading(leftClick = true) {
    if (!this.lamp && !this.wall && !this.auxMark) {
      leftClick ? this.markWall() : this.markAux();
    } else if (this.wall) {
      leftClick ? this.markLamp() : this.markVague();
    } else if (this.lamp) {
      leftClick ? this.markAux() : this.markWall();
    } else {
      leftClick ? this.markVague() : this.markLamp();
    }
  }

  // Update cell's html representation
  update() {
    this.node.innerHTML = "";

    // Clear CSS classes and re-assign
    this.node.className = "akari cell";
    this.wall && this.node.classList.add("wall");
    this.lamp && this.node.classList.add("lamp");
    (this.lamp || this.illuminated) && this.node.classList.add("illuminated");
    this.auxMark && this.node.classList.add("marked");
    !this.auxMark &&
      !this.wall &&
      !this.lamp &&
      this.node.classList.add("uncertain");

    // If there is a value in the cell, indicate the truth status of that clue
    // If the clue is known true, add a circle div
    if (~this.value) {
      this.node.innerText = String(this.value);
      this.node.classList.add("clue");
      if (this.clueCertainty) {
        if (!this.realClue) {
          this.node.classList.add("false");
        } else {
          this.node.classList.add("true");
          const truthRing = document.createElement("div");
          truthRing.classList.add("true", "clue");
          this.node.appendChild(truthRing);
        }
      }
    }

    // If there is a lamp in the cell, add a big circle
    if (this.lamp) {
      const light = document.createElement("div");
      light.classList.add("lamp");
      this.node.appendChild(light);
    }

    // If there is an auxiliary mark in the cell, add a small green circle
    if (this.auxMark) {
      const dot = document.createElement("div");
      dot.classList.add("marked");
      this.node.appendChild(dot);
    }
  }
}

class Akari extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = AkariCell;
    this.initializeCells();
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
        if (newCell.auxMark) {
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
        if (newCell.auxMark) {
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
        if (newCell.auxMark) {
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
        if (newCell.auxMark) {
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

  // What happens when a cell is clicked in Akari:
  // If cell has a number in it:
  // Left click cycles between uncertain shading, wall, lamp, unshaded
  // Right click cycles between uncertain clue, certain true clue, certain false clue
  // If cell does not have a number in it:
  // Left and right click cycle between uncertain, wall, lamp, unshaded
  clickCell(cell, event, leftClick = true) {
    if (~cell.value) {
      leftClick ? cell.toggleShading() : cell.toggleCertainty();
    } else {
      cell.toggleShading(leftClick);
    }
    this.illuminateBoard();
    this.update();
  }
}
