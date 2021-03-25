class CountryRoadCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Update cell's html representation
  update() {
    this.node.innerHTML = "";

    // Clear CSS classes and re-assign
    this.node.className = "countryroad cell";
    this.walls.top && this.node.classList.add("topwall");
    this.walls.left && this.node.classList.add("leftwall");
    this.walls.right && this.node.classList.add("rightwall");
    this.walls.bottom && this.node.classList.add("bottomwall");
    this.bridges.top && this.node.classList.add("topbridge");
    this.bridges.left && this.node.classList.add("leftbridge");
    this.bridges.right && this.node.classList.add("rightbridge");
    this.bridges.bottom && this.node.classList.add("bottombridge");
    this.loops.top && this.node.classList.add("toploop");
    this.loops.left && this.node.classList.add("leftloop");
    this.loops.right && this.node.classList.add("rightloop");
    this.loops.bottom && this.node.classList.add("bottomloop");
    this.crosses.top && this.node.classList.add("topcross");
    this.crosses.left && this.node.classList.add("leftcross");
    this.crosses.right && this.node.classList.add("rightcross");
    this.crosses.bottom && this.node.classList.add("bottomcross");

    // If there is a value in the cell, indicate in small font
    if (~this.value) {
      this.node.innerText = String(this.value);
      this.node.classList.add("clue");
    }

    // If there is a loop segment in the cell, add loop divs
    if (this.loops.top) {
      const div = document.createElement("div");
      div.classList.add("toploop");
      this.node.appendChild(div);
    }
    if (this.loops.left) {
      const div = document.createElement("div");
      div.classList.add("leftloop");
      this.node.appendChild(div);
    }
    if (this.loops.right) {
      const div = document.createElement("div");
      div.classList.add("rightloop");
      this.node.appendChild(div);
    }
    if (this.loops.bottom) {
      const div = document.createElement("div");
      div.classList.add("bottomloop");
      this.node.appendChild(div);
    }

    // If there is a cross in the cell, add cross divs
    if (this.crosses.top) {
      const div = document.createElement("div");
      div.classList.add("topcross");
      this.node.appendChild(div);
    }
    if (this.crosses.left) {
      const div = document.createElement("div");
      div.classList.add("leftcross");
      this.node.appendChild(div);
    }
    if (this.crosses.right) {
      const div = document.createElement("div");
      div.classList.add("rightcross");
      this.node.appendChild(div);
    }
    if (this.crosses.bottom) {
      const div = document.createElement("div");
      div.classList.add("bottomcross");
      this.node.appendChild(div);
    }
  }
}

class CountryRoad extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = CountryRoadCell;
    this.initializeCells();
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
