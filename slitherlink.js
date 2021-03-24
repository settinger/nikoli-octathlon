class SlitherlinkCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.edges = { top: false, left: false, right: false, bottom: false };
  }

  // Cycle between edge segment options: Uncertain, edge segment, edge cross
  // Slightly different than toggleLoop() because edge segments can be toggled on the perimeter of the grid (loops can't)
  // Very different from Corral toggleEdge() because Corral does not need edge crosses
  toggleEdge(direction, leftClick = true) {
    const dir = direction.direction;
    const opp = direction.opposite;
    const neighbor = this.neighbors[dir];
    if (!this.edges[dir] && !this.crosses[dir]) {
      // Option 1: Neither edge nor cross on vertex. If left-click, add edge; if right-click, add cross
      this.edges[dir] = leftClick;
      this.crosses[dir] = !leftClick;
      if (~neighbor) {
        neighbor.edges[opp] = leftClick;
        neighbor.crosses[opp] = !leftClick;
      }
    } else if (this.edges[dir]) {
      // Option 2: Edge on vertex. If left-click, change to cross; if right-click, remove edge
      this.edges[dir] = false;
      this.crosses[dir] = leftClick;
      if (~neighbor) {
        neighbor.edges[opp] = false;
        neighbor.crosses[opp] = leftClick;
      }
    } else {
      // Option 3: Cross on vertex. If left-click, remove cross; if right-click, change to edge
      this.edges[dir] = !leftClick;
      this.crosses[dir] = false;
      if (~neighbor) {
        neighbor.edges[opp] = !leftClick;
        neighbor.crosses[opp] = false;
      }
    }
  }

  // Update cell's html representation
  update() {
    this.node.innerHTML = "";

    // Clear CSS classes and re-assign
    this.node.className = "slitherlink cell";
    this.edges.top && this.node.classList.add("topedge");
    this.edges.left && this.node.classList.add("leftedge");
    this.edges.right && this.node.classList.add("rightedge");
    this.edges.bottom && this.node.classList.add("bottomedge");
    this.crosses.top && this.node.classList.add("topcross");
    this.crosses.left && this.node.classList.add("leftcross");
    this.crosses.right && this.node.classList.add("rightcross");
    this.crosses.bottom && this.node.classList.add("bottomcross");

    // Add corner dots
    // Top left corner
    const tlDot = document.createElement("div");
    tlDot.classList.add("corner");
    tlDot.style.top = "-5%";
    tlDot.style.left = "-5%";
    this.node.appendChild(tlDot);
    // If cell has no right side neighbor, add top right corner
    if (!~this.neighbors.right) {
      const trDot = tlDot.cloneNode();
      trDot.style.left = "95%";
      this.node.appendChild(trDot);
    }
    // If cell has no neighbor below, add bottom left corner
    if (!~this.neighbors.bottom) {
      const blDot = tlDot.cloneNode();
      blDot.style.top = "95%";
      this.node.appendChild(blDot);
    }
    // If cell has no neighbor below OR to the right, add bottom right corner
    if (!~this.neighbors.right && !~this.neighbors.bottom) {
      const brDot = tlDot.cloneNode();
      brDot.style.top = "95%";
      brDot.style.left = "95%";
      this.node.appendChild(brDot);
    }

    // If there is an edge on the cell, add edge divs
    // I tried doing this with border CSS and it looked awful
    if (this.edges.top) {
      const div = document.createElement("div");
      div.classList.add("topedge");
      this.node.appendChild(div);
    }
    if (this.edges.left) {
      const div = document.createElement("div");
      div.classList.add("leftedge");
      this.node.appendChild(div);
    }
    if (this.edges.right) {
      const div = document.createElement("div");
      div.classList.add("rightedge");
      this.node.appendChild(div);
    }
    if (this.edges.bottom) {
      const div = document.createElement("div");
      div.classList.add("bottomedge");
      this.node.appendChild(div);
    }

    // If there is a cross in the cell, add cross divs
    if (this.crosses.top) {
      const div = document.createElement("div");
      div.classList.add("topcross");
      this.node.appendChild(div);
    }
    if (this.crosses.left) {
      const div = document.createElement("div");
      div.classList.add("leftcross");
      this.node.appendChild(div);
    }
    if (this.crosses.right) {
      const div = document.createElement("div");
      div.classList.add("rightcross");
      this.node.appendChild(div);
    }
    if (this.crosses.bottom) {
      const div = document.createElement("div");
      div.classList.add("bottomcross");
      this.node.appendChild(div);
    }
  }
}

class Slitherlink extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = SlitherlinkCell;
    this.initializeCells();
  }

  // What to do when a cell is clicked
  // Toggle loops/crosses
  clickCell(cell, event, leftClick = true) {
    cell.toggleEdge(cell.eventDirection(event), leftClick);
    this.update();
  }
}
