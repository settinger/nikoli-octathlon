class CountryRoadCell extends Cell {
  constructor(row, column) {
    super(row, column);

    this.nodeText.setAttributes({
      x: this.x + this.width * 0.1,
      y: this.y + this.height * 0.1,
      "text-anchor": "start",
      "alignment-baseline": "hanging",
      "font-size": this.height * 0.6,
    });
  }
}

class CountryRoad extends Puzzle {
  constructor(parent) {
    super(parent);
    this.name = "Country Road";
    this.cellType = CountryRoadCell;
    this.useWalls = true;
    this.useLoops = true;
    this.useCrosses = true;
    this.initialize();
  }

  // What to do when a cell is clicked
  // Left click toggles loops/crosses, right click toggles walls/bridges
  clickCell(cell, event, leftClick = true) {
    leftClick
      ? cell.toggleLoop(cell.eventDirection(event))
      : cell.toggleWall(cell.eventDirection(event));
    this.update();

    // Linked boards:
    // Copy rooms/bridges to Fillomino
    // Copy loops/crosses to Masyu
    cell.transfer(this.parent.fillomino, "walls");
    cell.transfer(this.parent.fillomino, "bridges");
    cell.transfer(this.parent.masyu, "loops");
    cell.transfer(this.parent.masyu, "crosses");
    this.parent.fillomino.update();
    this.parent.masyu.update();
  }
}
