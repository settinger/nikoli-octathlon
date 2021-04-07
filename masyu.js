class MasyuCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's HTML representation
  // For Masyu, do not bother with cellCertainty property;
  // treat all cells as simply true or false
  update() {
    let classes = this.defaultClasses.slice();
    this.shaded && classes.push("shaded");
    this.unshaded && classes.push("unshaded");
    ~this.value && classes.push("pearl");
    classes.push(!!this.value ? "white" : "black");
    ~this.value && this.realClue && classes.push("true");
    ~this.value && !this.realClue && classes.push("false");

    this.node.className.baseVal = "";
    this.node.classList.add(...classes);
  }
}

class Masyu extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = MasyuCell;
    this.name = "Masyu";
    this.useLoops = true;
    this.useCrosses = true;
    this.initialize();
  }

  // When Masyu cell is clicked:
  // If set to mark vertices, toggle loop and cross status
  // If set to mark cells, toggle cell truth status
  clickCell(cell, event, leftClick = true) {
    if (this.parent.currMark == "vertices") {
      cell.toggleLoop(cell.eventDirection(event), leftClick);
    } else {
      cell.realClue = !cell.realClue;
    }
    this.update();

    // Linked boards:
    // copy loops/crosses to Country Road
    // If pearl is true, mark it on corralsyu and copy corralsyu value to corral
    cell.transfer(this.parent.countryRoad, "loops");
    cell.transfer(this.parent.countryRoad, "crosses");
    this.parent.countryRoad.update();

    this.parent.corralsyu.board[cell.row][cell.column].realClue = cell.realClue;
    this.parent.corral.board[cell.row][cell.column].value = cell.realClue
      ? this.parent.corralsyu.board[cell.row][cell.column].corralValue
      : -1;

    this.parent.corralsyu.update();
    this.parent.corral.update();
  }
}
