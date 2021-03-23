class HeyawakeCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.walls = { top: false, left: false, right: false, bottom: false };
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
      this.walls.bottom = !this.walls.bottom;
      this.neighbors.bottom.walls.top = !this.neighbors.bottom.walls.top;
    }
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";

    this.node.className = "heyawake cell";
    this.walls.top && this.node.classList.add("topwall");
    this.walls.left && this.node.classList.add("leftwall");
    this.walls.right && this.node.classList.add("rightwall");
    this.walls.bottom && this.node.classList.add("bottomwall");
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    // If there is a value in the cell, indicate the truth status of that clue
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
  }
}

class Heyawake extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = HeyawakeCell;
    this.initializeCells();

    // Add initial wall state
    for (let cell of this.board.flat()) {
      cell.walls = {
        top: cell.row == 0,
        left: cell.column == 0,
        right: cell.column == this.columns - 1,
        bottom: cell.row == this.rows - 1,
      };
    }
  }

  // What happens when a cell is clicked in Heyawake
  // If configured to mark vertices, toggle walls
  // If configured to mark cells:
  // If cell has a clue, toggle cell shadedness (left click) or clue truth (right click)
  // If cell has no clue, toggle cell shadedness
  clickCell(cell, event, leftClick = true) {
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
    } else if (~cell.value) {
      leftClick ? cell.toggleShading() : cell.toggleCertainty();
    } else {
      cell.toggleShading(leftClick);
    }
    this.update();
  }
}
