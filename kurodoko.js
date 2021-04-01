class KurodokoCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.originalValue = -1;
    this.nodeText.setAttribute("font-size", this.height * 0.6);
  }

  // Change the cell's clue value
  // Options are: -1 (uncertain) through this.originalValue
  toggleValue(leftClick = true) {
    let clue = this.value;
    clue = leftClick ? clue + 1 : clue - 1;
    clue = ((clue + this.originalValue + 3) % (this.originalValue + 2)) - 1;
    this.value = clue;
  }

  // Update cell's HTML representation
  update() {
    let classes = this.defaultClasses.slice();
    this.shaded && classes.push("shaded");
    this.unshaded && classes.push("unshaded");
    ~this.originalValue && classes.push("clue");

    this.node.className.baseVal = "";
    this.node.classList.add(...classes);

    this.nodeText.textContent = ~this.value ? this.value : "";
  }
}

class Kurodoko extends Puzzle {
  constructor(parent) {
    super(parent);
    this.name = "Kurodoko";
    this.cellType = KurodokoCell;
    this.initialize();
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
