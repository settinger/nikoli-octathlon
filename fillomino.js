class FillominoCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.bridges = { top: false, left: false, right: false, bottom: false };
  }

  // Add or remove a bridge
  toggleBridge(direction) {
    const dir = direction.direction;
    const opp = direction.opposite;
    const neighbor = this.neighbors[dir];
    if (~neighbor) {
      this.bridges[dir] = !this.bridges[dir];
      this.walls[dir] = false;
      neighbor.bridges[opp] = !neighbor.bridges[opp];
      neighbor.walls[opp] = false;
    }
  }

  // Update cell's html representation
  update() {
    this.node.innerHTML = "";

    // Clear CSS classes and re-assign
    this.node.className = "fillomino cell";
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

class Fillomino extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = FillominoCell;
    this.initializeCells();
  }

  // What to do when a cell is clicked
  // If configured to mark vertices: left click toggles walls, right click toggles bridges
  // If configured to mark cells and cell has clue, toggle clue certainty
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      leftClick
        ? cell.toggleWall(cell.eventDirection(event))
        : cell.toggleBridge(cell.eventDirection(event));
    } else {
      if (!~cell.value) {
        return;
      }
      cell.toggleCertainty(leftClick);
    }
    this.update();
  }
}
