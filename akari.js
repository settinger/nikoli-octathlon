// Classes for Akari cells and grids

class AkariCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.auxMark = false; // Presence of an auxiliary mark (i.e. no lamp, no wall)
    this.lamp = false; // Presence of lamp in cell
    this.illuminated = false; // Illumination status of cell
  }

  illuminate() {
    this.illuminated = true;
    this.shaded = false;
    this.unshaded = true;
  }

  // Mark a ceil as unknown shading
  markVague() {
    this.clueCertainty = false;
    this.auxMark = false;
    this.lamp = false;
    this.illuminated = false;
    this.shaded = false;
    this.unshaded = false;
  }

  // Mark a cell as unshaded (but not known if it's a lamp or not)
  markUnshadedButVague() {
    if (~this.value) {
      this.clueCertainty = true;
      this.realClue = false;
    }
    this.auxMark = false;
    this.lamp = false;
    this.shaded = false;
    this.unshaded = true;
  }

  // Mark a cell as known not a wall, not a lamp
  markAux() {
    if (~this.value) {
      this.clueCertainty = true;
      this.realClue = false;
    }
    this.auxMark = true;
    this.lamp = false;
    this.shaded = false;
    this.unshaded = true;
  }

  // Mark a cell as a lamp
  markLamp() {
    if (~this.value) {
      this.clueCertainty = true;
      this.realClue = false;
    }
    this.lamp = true;
    this.auxMark = false;
    this.shaded = false;
    this.unshaded = true;
  }

  // Mark a cell as a wall
  markWall() {
    if (~this.value) {
      this.clueCertainty = true;
      this.realClue = true;
    }
    this.auxMark = false;
    this.lamp = false;
    this.illuminated = false;
    this.shaded = true;
    this.unshaded = false;
  }

  // Cycle between shading styles for a cell: Vague, wall, lamp, unshaded and aux mark, unshaded and no aux mark
  toggleShading(leftClick = true) {
    if (!this.shaded && !this.unshaded) {
      leftClick ? this.markWall() : this.markUnshadedButVague();
    } else if (this.shaded) {
      leftClick ? this.markLamp() : this.markVague();
    } else if (this.lamp) {
      leftClick ? this.markAux() : this.markWall();
    } else if (this.auxMark) {
      leftClick ? this.markUnshadedButVague() : this.markLamp();
    } else {
      leftClick ? this.markVague() : this.markAux();
    }
  }

  // Update cell's HTML representation
  update() {
    let classes = this.defaultClasses.slice();
    this.shaded && classes.push("shaded");
    this.unshaded && classes.push("unshaded");
    this.lamp && classes.push("lamp");
    this.illuminated && classes.push("illuminated");
    this.auxMark && classes.push("marked");
    ~this.value && classes.push("clue");
    ~this.value && this.clueCertainty && this.realClue && classes.push("true");
    ~this.value &&
      this.clueCertainty &&
      !this.realClue &&
      classes.push("false");

    this.node.className.baseVal = "";
    this.node.classList.add(...classes);

    this.nodeText.textContent = ~this.value ? this.value : "";
  }
}

class Akari extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = AkariCell;
    this.initialize();

    this.illuminated = false;
  }

  // Once object is inserted into document, add a toggle button
  addButton() {
    this.toggle = document.createElement("button");
    this.toggle.innerText = "Toggle Lights";
    this.toggle.addEventListener("click", (e) => {
      this.toggleLights();
      this.update();
    });
    this.node.parentNode.appendChild(this.toggle);
  }

  // Return a list of all cells with lamps
  lamps() {
    return this.board.flat().filter((cell) => cell.lamp);
  }

  // Change if the lights illuminate all unshaded cells they can see
  toggleLights() {
    this.illuminated = !this.illuminated;

    // Remove "illuminated" property from each cell
    this.board.flat().forEach((cell) => {
      cell.illuminated = false;
    });

    // Apply lumination if board has illuminated property
    if (this.illuminated) {
      for (let lampCell of this.lamps()) {
        // Illuminate all possible cells
        lampCell.illuminate();
        let newCell = lampCell;

        for (let direction of ["top", "left", "right", "bottom"]) {
          newCell = lampCell;
          while (1) {
            newCell = newCell.neighbors[direction];
            if (!~newCell) break;
            if (newCell.unshaded) {
              newCell.illuminate();
            } else {
              break;
            }
          }
        }
      }
    }
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
  // Toggle shading
  // Automatically assign clue truth based on clue shading
  clickCell(cell, event, leftClick = true) {
    cell.toggleShading(leftClick);
    this.update();

    // Linked board events:
    // If Akari click produces a light, mark corresponding Shikaku clue as true
    // If Akari click produces an aux or wall, mark corresponding Shikaku clue as false
    // If Akari click produces a wall, mark corresponding Hitori + Hitorilink cell as shaded
    // If Akari click removes produces a light or aux, mark corresponding Hitori + Hitorilink cells as unshaded
    if (cell.lamp) {
      this.parent.shikaku.board[cell.row][cell.column].markTrueClue();
    } else if (cell.auxMark || cell.shaded) {
      this.parent.shikaku.board[cell.row][cell.column].markFalseClue();
    } else {
      this.parent.shikaku.board[cell.row][cell.column].markUncertainClue();
    }

    if (cell.shaded) {
      this.parent.hitori.board[cell.row][cell.column].markShaded();
      this.parent.hitorilink.board[cell.row][cell.column].markShaded();
    } else if (cell.unshaded) {
      this.parent.hitori.board[cell.row][cell.column].markUnshaded();
      this.parent.hitorilink.board[cell.row][cell.column].markUnshaded();
    } else {
      this.parent.hitori.board[cell.row][cell.column].markVague();
      this.parent.hitorilink.board[cell.row][cell.column].markVague();
    }
    this.parent.shikaku.update();
    this.parent.hitori.update();
    this.parent.hitorilink.update();
  }
}
