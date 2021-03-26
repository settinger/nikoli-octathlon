class NurikoroCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";
    this.node.className = `nurikabe nurikoro cell row${this.row} col${this.column}`;
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    // If the cell has a value, include it
    if (~this.value) {
      this.node.innerText = String(this.value);
      this.node.classList.add("clue");
    }

    // If the cell is marked unshaded, put an auxiliary mark
    if (this.unshaded && !~this.value) {
      const dot = document.createElement("div");
      dot.classList.add("marked");
      this.node.appendChild(dot);
    }
  }
}

class Nurikoro extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = NurikoroCell;
    this.initializeCells();
  }

  // When cell is clicked: Toggle status
  // Possible statuses: Uncertain, shaded, unshaded
  clickCell(cell, event, leftClick = true) {
    if (~cell.value) {
      cell.markUnshaded();
    } else cell.toggleShading(leftClick);
    this.update();

    // Linked board updates:
    // Nurikabe shaded cells are Fillomino liars
    // Copy shadedness to Nurikabe puzzle
    if (cell.shaded) {
      this.parent.fillomino.board[cell.row][cell.column].markFalseClue();
    } else if (cell.unshaded) {
      this.parent.fillomino.board[cell.row][cell.column].markTrueClue();
    } else {
      this.parent.fillomino.board[cell.row][cell.column].markUncertainClue();
    }
    this.parent.fillomino.update();
    this.parent.nurikabe.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.nurikabe.board[cell.row][cell.column].unshaded = cell.unshaded;
    this.parent.nurikabe.update();
  }
}
