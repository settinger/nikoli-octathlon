class HitorilinkCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";
    this.node.className = `hitori hitorilink cell row${this.row} col${this.column}`;
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    if (~this.value) {
      this.node.innerText = String(this.value);
    }
  }
}

class Hitorilink extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = HitorilinkCell;
    this.initializeCells();
  }

  // When cell is clicked: Toggle status
  // Possible statuses: Uncertain, shaded, unshaded
  clickCell(cell, event, leftClick = true) {
    cell.toggleShading(leftClick);
    this.update();

    // Linked board events:
    // Transfer shading to Akari board and Hitorilink board
    this.parent.hitori.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.hitori.board[cell.row][cell.column].unshaded = cell.unshaded;
    this.parent.hitori.update();

    if (cell.shaded) {
      this.parent.akari.board[cell.row][cell.column].markWall();
      this.parent.akari.update();
    }
    if (cell.unshaded && this.parent.akari.board[cell.row][cell.column].wall) {
      this.parent.akari.board[cell.row][cell.column].markVague();
      this.parent.akari.update();
    }
  }
}
