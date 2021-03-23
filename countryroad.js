class CountryRoadCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }
}

class CountryRoad extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = CountryRoadCell;
    this.initializeCells();
  }
}
