class CorralsyuCell extends Cell {
  constructor(row, column) {
    super(row, column);
    this.corralValue = -1;
    this.masyuValue = -1;
    this.nodeText.setAttribute("font-size", this.height * 0.6);
  }

  // Update cell's HTML representation
  update() {
    let classes = this.defaultClasses.slice();
    this.shaded && classes.push("shaded");
    this.unshaded && classes.push("unshaded");
    ~this.masyuValue && classes.push("pearl");
    classes.push(!!this.masyuValue ? "white" : "black");
    ~this.masyuValue && this.realClue && classes.push("true");
    ~this.masyuValue && !this.realClue && classes.push("false");

    ~this.masyuValue &&
      this.clueCertainty &&
      this.realClue &&
      classes.push("true");
    ~this.masyuValue &&
      this.clueCertainty &&
      !this.realClue &&
      classes.push("false");

    this.node.className.baseVal = "";
    this.node.classList.add(...classes);

    this.nodeText.textContent = ~this.corralValue ? this.corralValue : "";
  }
}

class Corralsyu extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = CorralsyuCell;
    this.initialize();
  }

  // Populate this one with Corral and Masyu givens
  populate(cArray, mArray) {
    this.board.flat().forEach((cell) => {
      cell.corralValue = cArray[cell.row][cell.column];
      cell.masyuValue = mArray[cell.row][cell.column];
    });
  }

  // When a cell is clicked:
  // If left click, toggle Corral shadedness
  // if right click, toggle Masyu truth
  clickCell(cell, event, leftClick = true) {
    leftClick ? cell.toggleShading() : (cell.realClue = !cell.realClue);
    this.update();

    // Linked boards:
    // Copy shading status to Corral
    // Copy cell truth to Masyu
    // If pearl is true, mark it on Masyu and copy corralsyu value to corral
    this.parent.masyu.board[cell.row][cell.column].realClue = cell.realClue;
    this.parent.masyu.update();

    this.parent.corral.board[cell.row][cell.column].value = cell.realClue
      ? this.parent.corralsyu.board[cell.row][cell.column].corralValue
      : -1;

    this.parent.corral.board[cell.row][cell.column].shaded = cell.shaded;
    this.parent.corral.board[cell.row][cell.column].unshaded = cell.unshaded;
    this.parent.corral.update();
  }
}
