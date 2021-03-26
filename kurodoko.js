class KurodokoCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.originalValue = -1;
  }

  // Change the cell's clue value
  // Options are: -1 (uncertain) through this.originalValue
  toggleValue(leftClick = true) {
    let clue = this.value;
    clue = leftClick ? clue + 1 : clue - 1;
    clue = ((clue + this.originalValue + 3) % (this.originalValue + 2)) - 1;
    this.value = clue;
  }

  // Update cell's html form
  update() {
    this.node.innerHTML = "";
    this.node.className = `kurodoko cell row${this.row} col${this.column}`;
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    // If the cell has a value, put it in a circle div
    if (~this.originalValue) {
      this.node.classList.add("clue");
      const clue = document.createElement("div");
      clue.classList.add("clue");
      clue.innerText = ~this.value ? String(this.value) : "";
      // if (this.upperBound == this.lowerBound) {
      //   clue.innerText = this.upperBound;
      // } else {
      //   clue.classList.add("bounded");
      //   clue.innerHTML = `&ge;${this.lowerBound}<br/>&le;${this.upperBound}`;
      // }
      this.node.appendChild(clue);
    }

    // If the cell is marked unshaded (and no clue), put an auxiliary mark
    if (this.unshaded && !~this.originalValue) {
      const dot = document.createElement("div");
      dot.classList.add("marked");
      this.node.appendChild(dot);
    }
  }
}

class Kurodoko extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = KurodokoCell;
    this.initializeCells();
  }

  // Populate grid with givens
  populate(array) {
    this.board.flat().forEach((cell) => {
      cell.originalValue = array[cell.row][cell.column];
    });
  }

  // When cell is clicked: toggle status
  // Possible statuses: Uncertain, shaded, unshaded
  // When clue cell is clicked, toggle cell value
  clickCell(cell, event, leftClick = true) {
    if (~cell.originalValue) {
      cell.markUnshaded();
      cell.toggleValue(leftClick);
    } else {
      cell.toggleShading(leftClick);
    }
    this.update();

    // Linked boards:
    // Copy cell shadedness to Heyawake
    // Change Nurikabe clue number
    this.parent.heyawake.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.heyawake.board[cell.row][cell.column].unshaded = cell.unshaded;
    this.parent.heyawake.update();
    if (~cell.originalValue) {
      this.parent.nurikabe.board[cell.row][cell.column].value = ~cell.value
        ? cell.originalValue - cell.value
        : -1;
      this.parent.nurikabe.update();
    }
  }
}
