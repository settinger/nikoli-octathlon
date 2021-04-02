class Heyawake extends Puzzle {
  constructor(parent) {
    super(parent);
    this.name = "Heyawake";
    this.cellType = Cell;
    this.useWalls = true;
    this.initialize();
  }

  // What happens when a cell is clicked in Heyawake
  // If configured to mark vertices, toggle walls
  // If configured to mark cells:
  // If cell has a clue, toggle cell shadedness (left click) or clue truth (right click)
  // If cell has no clue, toggle cell shadedness
  clickCell(cell, event, leftClick = true) {
    if (this.parent.markVertices) {
      cell.toggleWall(cell.eventDirection(event), leftClick);
    } else if (~cell.value) {
      leftClick ? cell.toggleShading() : cell.toggleCertainty();
    } else {
      cell.toggleShading(leftClick);
    }
    this.update();

    // Linked cell events:
    // Copy walls to Shikaku
    // Transfer shadedness to Kurodoko cell
    cell.transfer(this.parent.shikaku, "walls");
    cell.transfer(this.parent.shikaku, "bridges");
    this.parent.shikaku.update();
    this.parent.kurodoko.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.kurodoko.board[cell.row][cell.column].unshaded = cell.unshaded;
    this.parent.kurodoko.update();
  }
}
