class HitorilinkCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";
    this.node.className = "hitori hitorilink cell";
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
  }
}
