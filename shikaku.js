class ShikakuCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.walls = { top: false, left: false, right: false, bottom: false };
    this.bridges = { top: false, left: false, right: false, bottom: false };
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
      this.walls.bottom = !this.walls.bottom;
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
    //this.node.classList.add(this.clueCertainty ? "certain" : "uncertain");

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
    this.cellType = ShikakuCell;
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

  // What to do when a cell is clicked
  // If configured to mark vertices: left click toggles walls, right click toggles bridges
  // If configured to mark cells and cell has clue, toggle clue certainty
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      // Get coordinate of event within cell
      let [x, y] = [
        event.offsetX - cell.width / 2,
        event.offsetY - cell.height / 2,
      ];
      // Figure out if event is in the top, left, right, or bottom of cell
      if (x < 0 && -x > Math.abs(y)) {
        leftClick ? cell.toggleWall("left") : cell.toggleBridge("left");
      } else if (x > 0 && x > Math.abs(y)) {
        leftClick ? cell.toggleWall("right") : cell.toggleBridge("right");
      } else if (y > 0 && y > Math.abs(x)) {
        leftClick ? cell.toggleWall("bottom") : cell.toggleBridge("bottom");
      } else {
        leftClick ? cell.toggleWall("top") : cell.toggleBridge("top");
      }
    } else {
      if (!~cell.value) {
        return;
      }
      cell.toggleCertainty(leftClick);
    }
    this.update();
  }
}
