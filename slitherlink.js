class SlitherlinkCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Change the cell's clue value
  // Options are: -1 (uncertain), 0, 1, 2, 3
  toggleValue(leftClick = true) {
    let clue = this.value;
    clue = leftClick ? clue + 1 : clue - 1;
    clue = ((clue + 6) % 5) - 1;
    this.value = clue;
  }
}

class Slitherlink extends Puzzle {
  constructor(parent) {
    super(parent);
    this.name = "Slitherlink";
    this.cellType = SlitherlinkCell;
    this.useEdges = true;
    this.useCrosses = true;
    this.initialize();

    // Remove original grid, append special Slitherlink grid
    this.node.removeChild(this.grid);
    this.grid = newSVG("g");
    this.grid.classList.add("grid", this.token);
    this.grid.update = () => {
      for (let row = 0; row <= this.rows; row++) {
        for (let col = 0; col <= this.columns; col++) {
          const dot = newSVG("circle", {
            cx: col * 10,
            cy: row * 10,
            fill: "black",
            r: 0.8,
            "shape-rendering": "geometricPrecision",
          });
          this.grid.appendChild(dot);
        }
      }
    };
    this.node.appendChild(this.grid);
  }

  // What to do when a cell is clicked
  // Mark cells: Cycle the values in the cells
  // Mark vertices: toggle loops/crosses
  clickCell(cell, event, leftClick = true) {
    if (this.parent.currMark == "vertices") {
      cell.toggleEdge(cell.eventDirection(event), leftClick);
    } else {
      cell.toggleValue(leftClick);
    }
    this.update();

    // Linked boards:
    // Copy edges/crosses to Corral
    // Subtract clue from Hitorilink and give to Hitori board
    cell.transfer(this.parent.corral, "edges");
    cell.transfer(this.parent.corral, "crosses");
    this.parent.corral.update();

    if (~cell.value) {
      this.parent.hitori.board[cell.row][cell.column].value =
        (this.parent.hitorilink.board[cell.row][cell.column].value -
          cell.value +
          10) %
        10;
    } else {
      this.parent.hitori.board[cell.row][cell.column].value = -1;
    }
    this.parent.hitori.update();
  }
}
