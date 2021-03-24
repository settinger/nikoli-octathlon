class MasyuCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's html representation
  update() {
    this.node.innerHTML = "";

    // Clear CSS classes and re-assign
    this.node.className = "masyu cell";
    this.loops.top && this.node.classList.add("toploop");
    this.loops.left && this.node.classList.add("leftloop");
    this.loops.right && this.node.classList.add("rightloop");
    this.loops.bottom && this.node.classList.add("bottomloop");
    this.crosses.top && this.node.classList.add("topcross");
    this.crosses.left && this.node.classList.add("leftcross");
    this.crosses.right && this.node.classList.add("rightcross");
    this.crosses.bottom && this.node.classList.add("bottomcross");
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    // For Masyu, ignore clueCertainty property, treat all cells as either true or false
    this.node.classList.add(this.realClue ? "true" : "false");

    // If cell is shaded (black pearl), add a black pearl div
    if (this.shaded) {
      const div = document.createElement("div");
      div.classList.add("pearl", "black");
      this.node.appendChild(div);
    }

    // If cell is unshaded (white pearl), add a white pearl div
    if (this.unshaded) {
      const div = document.createElement("div");
      div.classList.add("pearl", "white");
      this.node.appendChild(div);
    }

    // If there is a loop segment in the cell, add loop divs
    if (this.loops.top) {
      const div = document.createElement("div");
      div.classList.add("toploop");
      this.node.appendChild(div);
    }
    if (this.loops.left) {
      const div = document.createElement("div");
      div.classList.add("leftloop");
      this.node.appendChild(div);
    }
    if (this.loops.right) {
      const div = document.createElement("div");
      div.classList.add("rightloop");
      this.node.appendChild(div);
    }
    if (this.loops.bottom) {
      const div = document.createElement("div");
      div.classList.add("bottomloop");
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

class Masyu extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = MasyuCell;
    this.initializeCells();
  }

  // Masyu does not use the default populate() method
  populate(array) {
    for (let row = 0; row < array.length; row++) {
      for (let col = 0; col < array[0].length; col++) {
        this.board[row][col].shaded = !array[row][col];
        this.board[row][col].unshaded = !!array[row][col];
      }
    }
  }

  // When Masyu cell is clicked:
  // If set to mark vertices, toggle loop and cross status
  // If set to mark cells, toggle cell truth status
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      cell.toggleLoop(cell.eventDirection(event), leftClick);
    } else {
      cell.realClue = !cell.realClue;
    }
    this.update();
  }
}
