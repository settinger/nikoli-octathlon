class NurikoroCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";
    this.node.className = "nurikabe nurikoro cell";
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    // If the cell has a value, include it
    if (~this.value) {
      this.node.innerText = String(this.value);
      this.node.classList.add("clue");
    }

    // If the cell is marked unshaded, put an auxiliary mark
    if (this.unshaded) {
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
    if (~cell.value) return;
    cell.toggleShading();
    this.update();
  }
}
