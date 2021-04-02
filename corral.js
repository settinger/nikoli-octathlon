class Corral extends Puzzle {
  constructor(parent) {
    super(parent);
    this.name = "Corral";
    this.cellType = Cell;
    this.useEdges = true;
    this.initialize();
  }

  // When a cell is clicked:
  // If configured to mark vertices: toggle walls
  // Otherwise, toggle shadedness
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      cell.toggleEdge(cell.eventDirection(event));
    } else {
      cell.toggleShading(leftClick);
    }
    this.update();

    // Linked boards:
    // Copy edges/crosses to Slitherlink
    // Copy shading status to Corralsyu
    cell.transfer(this.parent.slitherlink, "edges");
    cell.transfer(this.parent.slitherlink, "crosses");
    this.parent.slitherlink.update();

    this.parent.corralsyu.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.corralsyu.board[cell.row][cell.column].unshaded = cell.unshaded;
    this.parent.corralsyu.update();
  }
}
