class HeyawakeCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.clueCertainty = false;
    this.realClue = false;
    this.value = -1;
    this.shaded = false;
    this.unshaded = false;
    this.walls = { top: false, left: false, right: false, bottom: false };
  }

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
  markShaded() {
    this.shaded = true;
    this.unshaded = false;
  }
  markUnshaded() {
    this.shaded = false;
    this.unshaded = true;
  }
  markVague() {
    this.shaded = false;
    this.unshaded = false;
  }

  // Add or remove a wall
  toggleWall(direction) {
    if (direction == "top" && ~this.neighbors.top) {
      this.walls.top = !this.walls.top;
      this.neighbors.top.walls.bottom = !this.neighbors.top.walls.bottom;
    }
    if (direction == "left" && ~this.neighbors.left) {
      this.walls.left = !this.walls.left;
      this.neighbors.left.walls.right = !this.neighbors.left.walls.right;
    }
    if (direction == "right" && ~this.neighbors.right) {
      this.walls.right = !this.walls.right;
      this.neighbors.right.walls.left = !this.neighbors.right.walls.left;
    }
    if (direction == "bottom" && ~this.neighbors.bottom) {
      this.walls.bottom = !cell.walls.bottom;
      this.neighbors.bottom.walls.top = !this.neighbors.bottom.walls.top;
    }
  }

  // Toggle cell certainty
  // Possible options: Uncertain, Certain and clue is false, certain and clue is true;
  toggleCertainty(forward = true) {
    if (!this.clueCertainty) {
      forward ? this.markTrue() : this.markFalse();
    } else if (this.realClue) {
      forward ? this.markFalse() : this.markUncertain();
    } else {
      forward ? this.markUncertain() : this.markFalse();
    }
  }

  // Toggle cell shading
  // Possible options: Shaded, unshaded, unclear
  toggleShading(forward = true) {
    if (this.shaded) {
      forward ? this.markUnshaded() : this.markVague();
    } else if (this.unshaded) {
      forward ? this.markVague() : this.markShaded();
    } else {
      forward ? this.markShaded() : this.markUnshaded();
    }
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";
    if (
      (!this.clueCertainty && ~this.value) ||
      (this.clueCertainty && this.realClue && ~this.value)
    ) {
      this.node.innerText = String(this.value);
    }

    this.node.className = "heyawake cell";
    this.walls.top && this.node.classList.add("topwall");
    this.walls.left && this.node.classList.add("leftwall");
    this.walls.right && this.node.classList.add("rightwall");
    this.walls.bottom && this.node.classList.add("bottomwall");
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");
    this.node.classList.add(this.clueCertainty ? "certain" : "uncertain");
  }
}

class Heyawake extends Puzzle {
  constructor(parent) {
    super(parent);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const newCell = new HeyawakeCell(row, col);
        newCell.walls = {
          top: row == 0,
          left: col == 0,
          right: col == this.columns - 1,
          bottom: row == this.rows - 1,
        };
        newCell.node.addEventListener("click", (e) =>
          this.click(e, newCell, true)
        );
        newCell.node.addEventListener("contextmenu", (e) =>
          this.click(e, newCell, false)
        );
        this.board[row][col] = newCell;
      }
    }
    this.populateNeighbors();
  }

  // Initialize the grid with givens
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

  // What happens when a cell is clicked in Heyawake
  // If configured to mark vertices, toggle walls
  // If configured to mark cells, toggle cell shadedness (left click) or certainty (right click)
  click(event, cell, leftclick = true) {
    event.preventDefault();

    if (this.parent.markVertices) {
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
      leftclick ? cell.toggleShading() : cell.toggleCertainty();
    }
    this.update();
  }
}
