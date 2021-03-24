class SlitherlinkCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Change the cell's clue value
  // Options are: -1 (uncertain), 0, 1, 2, 3, 4
  toggleValue(leftClick = true) {
    let clue = this.value;
    clue = leftClick ? clue + 1 : clue - 1;
    clue = ((clue + 7) % 6) - 1;
    this.value = clue;
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

    if (~this.value) {
      this.node.innerText = String(this.value);
    }

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
  // Mark cells: Cycle the values in the cells
  // Mark vertices: toggle loops/crosses
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      cell.toggleEdge(cell.eventDirection(event), leftClick);
    } else {
      cell.toggleValue(leftClick);
    }
    this.update();

    // Linked boards:
    // Copy edges/crosses to Corral
    // Subtract clue from Hitorilink and give to Hitori board
    cell.transfer(this.parent.corral, "edges");
    cell.transfer(this.parent.corral, "crosses");
    this.parent.corral.update();

    if (~cell.value) {
      this.parent.hitori.board[cell.row][cell.column].value =
        (this.parent.hitorilink.board[cell.row][cell.column].value -
          cell.value +
          10) %
        10;
    } else {
      this.parent.hitori.board[cell.row][cell.column].value = -1;
    }
    this.parent.hitori.update();
  }
}
