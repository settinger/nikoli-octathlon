class CorralsyuCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.corralValue = -1;
    this.masyuValue = -1;
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";

    this.node.className = "corralsyu corral masyu cell";

    // Shade the cell with corral colors
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    // For Masyu, ignore clueCertainty property, treat all cells as either true or false
    this.node.classList.add(this.realClue ? "true" : "false");

    // If cell is shaded (black pearl), add a black pearl div
    if (~this.masyuValue && !this.masyuValue) {
      const div = document.createElement("div");
      div.classList.add("pearl", "black");
      div.innerText = String(this.corralValue);
      this.node.appendChild(div);
    }

    // If cell is unshaded (white pearl), add a white pearl div
    if (~this.masyuValue && this.masyuValue) {
      const div = document.createElement("div");
      div.classList.add("pearl", "white");
      div.innerText = String(this.corralValue);
      this.node.appendChild(div);
    }
  }
}

class Corralsyu extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = CorralsyuCell;
    this.initializeCells();
  }

  // Populate this one with Corral and Masyu givens
  populate(cArray, mArray) {
    this.board.flat().forEach((cell) => {
      cell.corralValue = cArray[cell.row][cell.column];
      cell.masyuValue = mArray[cell.row][cell.column];
    });
  }

  // When a cell is clicked:
  // If left click, toggle Corral shadedness
  // if right click, toggle Masyu truth
  clickCell(cell, event, leftClick = true) {
    leftClick ? cell.toggleShading() : (cell.realClue = !cell.realClue);
    this.update();
  }
}
