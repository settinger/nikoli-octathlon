class ShikakuCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.clueCertainty = false;
    this.realClue = false;
    this.value = -1;
    this.walls = { top: false, left: false, right: false, bottom: false };
    this.bridges = { top: false, left: false, right: false, bottom: false };
  }

  // Mark a cell's clue as known-true or known-false
  markCertain() {
    this.clueCertainty = true;
  }
  markUncertain() {
    this.clueCertainty = false;
  }
  markTrue() {
    this.clueCertainty = true;
    this.realClue = true;
  }
  markFalse() {
    this.clueCertainty = true;
    this.realClue = false;
  }

  // Toggle certainty of cell
  // Possible options: Uncertain; certain and clue is false; certain and clue is true
  toggleCertainty(forward = true) {
    if (!this.clueCertainty) {
      this.clueCertainty = true;
      this.realClue = forward;
    } else if (this.clueCertainty && this.realClue) {
      forward ? (this.realClue = false) : (this.clueCertainty = false);
    } else {
      forward ? (this.clueCertainty = false) : (this.realClue = true);
    }
  }

  // Add or remove a wall
  toggleWall(direction) {
    if (direction == "top" && ~this.neighbors.top) {
      this.walls.top = !this.walls.top;
      this.bridges.top = false;
      this.neighbors.top.walls.bottom = !this.neighbors.top.walls.bottom;
      this.neighbors.top.bridges.bottom = false;
    }
    if (direction == "left" && ~this.neighbors.left) {
      this.walls.left = !this.walls.left;
      this.bridges.left = false;
      this.neighbors.left.walls.right = !this.neighbors.left.walls.right;
      this.neighbors.left.bridges.right = false;
    }
    if (direction == "right" && ~this.neighbors.right) {
      this.walls.right = !this.walls.right;
      this.bridges.right = false;
      this.neighbors.right.walls.left = !this.neighbors.right.walls.left;
      this.neighbors.right.bridges.left = false;
    }
    if (direction == "bottom" && ~this.neighbors.bottom) {
      this.walls.bottom = !cell.walls.bottom;
      this.bridges.bottom = false;
      this.neighbors.bottom.walls.top = !this.neighbors.bottom.walls.top;
      this.neighbors.bottom.bridges.top = false;
    }
  }

  // Add or remove a bridge
  toggleBridge(direction) {
    if (direction == "top" && ~this.neighbors.top) {
      this.bridges.top = !this.bridges.top;
      this.walls.top = false;
      this.neighbors.top.bridges.bottom = !this.neighbors.top.bridges.bottom;
      this.neighbors.top.walls.bottom = false;
    }
    if (direction == "left" && ~this.neighbors.left) {
      this.bridges.left = !this.bridges.left;
      this.walls.left = false;
      this.neighbors.left.bridges.right = !this.neighbors.left.bridges.right;
      this.neighbors.left.walls.right = false;
    }
    if (direction == "right" && ~this.neighbors.right) {
      this.bridges.right = !this.bridges.right;
      this.walls.right = false;
      this.neighbors.right.bridges.left = !this.neighbors.right.bridges.left;
      this.neighbors.right.walls.left = false;
    }
    if (direction == "bottom" && ~this.neighbors.bottom) {
      this.bridges.bottom = !this.bridges.bottom;
      this.walls.bottom = false;
      this.neighbors.bottom.bridges.top = !this.neighbors.bottom.bridges.top;
      this.neighbors.bottom.walls.top = false;
    }
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
    this.node.className = "shikaku cell";
    this.walls.top && this.node.classList.add("topwall");
    this.walls.left && this.node.classList.add("leftwall");
    this.walls.right && this.node.classList.add("rightwall");
    this.walls.bottom && this.node.classList.add("bottomwall");
    this.bridges.top && this.node.classList.add("topbridge");
    this.bridges.left && this.node.classList.add("leftbridge");
    this.bridges.right && this.node.classList.add("rightbridge");
    this.bridges.bottom && this.node.classList.add("bottombridge");
    this.node.classList.add(this.clueCertainty ? "certain" : "uncertain");

    // If there is a bridge in the cell, add a bridge div
    if (this.bridges.top) {
      const div = document.createElement("div");
      div.classList.add("topbridge");
      this.node.appendChild(div);
    }
    if (this.bridges.left) {
      const div = document.createElement("div");
      div.classList.add("leftbridge");
      this.node.appendChild(div);
    }
    if (this.bridges.right) {
      const div = document.createElement("div");
      div.classList.add("rightbridge");
      this.node.appendChild(div);
    }
    if (this.bridges.bottom) {
      const div = document.createElement("div");
      div.classList.add("bottombridge");
      this.node.appendChild(div);
    }
  }
}

class Shikaku extends Puzzle {
  constructor(parent) {
    super(parent);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const newCell = new ShikakuCell(row, col);
        newCell.walls = {
          top: row == 0,
          left: col == 0,
          right: col == this.columns - 1,
          bottom: row == this.rows - 1,
        };
        newCell.node.addEventListener("click", (e) =>
          this.leftClick(e, newCell)
        );
        newCell.node.addEventListener("contextmenu", (e) =>
          this.rightClick(e, newCell)
        );
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

  // Update the table element
  update() {
    // clear existing grid
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

  // What to do when a cell is left-clicked
  // If configured to mark vertices, toggle the walls
  // If configured to mark cells, toggle the cell certainty
  leftClick(event, cell) {
    event.preventDefault();

    if (this.parent.markVertices) {
      // Get coordinate of event within cell
      let [x, y] = [
        event.offsetX - cell.width / 2,
        event.offsetY - cell.height / 2,
      ];
      // Figure out if event is in the top, left, right, or bottom of cell
      if (x < 0 && -x > Math.abs(y)) {
        cell.toggleWall("left");
      } else if (x > 0 && x > Math.abs(y)) {
        cell.toggleWall("right");
      } else if (y > 0 && y > Math.abs(x)) {
        cell.toggleWall("bottom");
      } else {
        cell.toggleWall("top");
      }
    } else {
      cell.toggleCertainty();
    }

    this.update();
  }

  // What to do when right-clicked
  // If configured to mark vertices, toggle the auxiliary marks (bridges)
  // If configured to mark cells, toggle the cell certainty
  rightClick(event, cell) {
    event.preventDefault();

    if (this.parent.markVertices) {
      // Get coordinate of event within cell
      let [x, y] = [
        event.offsetX - cell.width / 2,
        event.offsetY - cell.height / 2,
      ];
      // Figure out if event is in the top, left, right, or bottom of cell
      if (x < 0 && -x > Math.abs(y)) {
        cell.toggleBridge("left");
      } else if (x > 0 && x > Math.abs(y)) {
        cell.toggleBridge("right");
      } else if (y > 0 && y > Math.abs(x)) {
        cell.toggleBridge("bottom");
      } else {
        cell.toggleBridge("top");
      }
    } else {
      cell.toggleCertainty(false);
    }
    this.update();
  }
}
