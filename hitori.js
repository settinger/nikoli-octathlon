class HitoriCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";
    this.node.className = `hitori cell row${this.row} col${this.column}`;
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    if (~this.value) {
      this.node.innerText = String(this.value);
    }
  }
}

class Hitori extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = HitoriCell;
    this.initializeCells();
  }

  // When cell is clicked: Toggle status
  // Possible statuses: Uncertain, shaded, unshaded
  clickCell(cell, event, leftClick = true) {
    cell.toggleShading(leftClick);
    this.update();

    // Linked board events:
    // Transfer shading to Akari board and Hitorilink board
    this.parent.hitorilink.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.hitorilink.board[cell.row][cell.column].unshaded =
      cell.unshaded;
    this.parent.hitorilink.update();

    if (cell.shaded) {
      this.parent.akari.board[cell.row][cell.column].markWall();
    } else if (cell.unshaded) {
      this.parent.akari.board[cell.row][cell.column].markUnshaded();
    } else {
      this.parent.akari.board[cell.row][cell.column].markVague();
    }
    this.parent.akari.update();
  }
}
