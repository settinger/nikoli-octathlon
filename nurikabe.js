class NurikabeCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.upperBound = -1;
    this.lowerBound = -1;
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";
    this.node.className = "nurikabe cell";
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    // If the cell has a value, put it in a circle div
    if (~this.value) {
      this.node.classList.add("clue");
      const clue = document.createElement("div");
      clue.classList.add("clue");
      if (this.upperBound == this.lowerBound) {
        clue.innerText = this.upperBound;
      } else {
        clue.classList.add("bounded");
        clue.innerHTML = `&ge;${this.lowerBound}<br/>&le;${this.upperBound}`;
      }
      this.node.appendChild(clue);
    }

    // If the cell is marked unshaded, put an auxiliary mark
    if (this.unshaded) {
      const dot = document.createElement("div");
      dot.classList.add("marked");
      this.node.appendChild(dot);
    }
  }
}

class Nurikabe extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = NurikabeCell;
    this.initializeCells();
  }

  // Populate grid with givens
  populate(array) {
    for (let row = 0; row < array.length; row++) {
      for (let col = 0; col < array[0].length; col++) {
        const value = array[row][col];
        this.board[row][col].value = value;
        if (~value) {
          this.board[row][col].upperBound = value - 1;
          this.board[row][col].lowerBound = 1;
        }
      }
    }
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
    // Copy shadedness to Nuri-koro puzzle
    if (cell.shaded) {
      this.parent.fillomino.board[cell.row][cell.column].markFalseClue();
    } else if (cell.unshaded) {
      this.parent.fillomino.board[cell.row][cell.column].markTrueClue();
    } else {
      this.parent.fillomino.board[cell.row][cell.column].markUncertainClue();
    }
    this.parent.fillomino.update();
    this.parent.nurikoro.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.nurikoro.board[cell.row][cell.column].unshaded = cell.unshaded;
    this.parent.nurikoro.update();
  }
}
