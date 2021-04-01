// Generic classes for a single cell and a single puzzle grid
class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.width = 10; // Fixed value, change this later
    this.height = 10; // Fixed value, change this later
    this.x = this.width * this.column;
    this.y = this.height * this.row;
    this.neighbors = { top: -1, bottom: -1, left: -1, right: -1 };
    this.node = newSVG("g");
    this.defaultClasses = ["cell", `row${this.row}`, `col${this.column}`];
    this.node.classList.add(...this.defaultClasses);
    this.node.setAttributes({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    });
    // this.node.addEventListener("click", (e) => {
    //   console.log(`${this.row}x${this.column}`);
    // });
    this.nodeRect = newSVG("rect");
    this.node.appendChild(this.nodeRect);
    this.nodeRect.setAttributes({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    });
    this.nodeText = newSVG("text");
    this.nodeText.setAttributes({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      "text-anchor": "middle",
      "alignment-baseline": "central",
      "font-size": this.height * 0.75,
    });
    this.node.appendChild(this.nodeText);
    this.nodeCircle = newSVG("circle");
    this.nodeCircle.setAttributes({
      cx: this.x + this.width / 2,
      cy: this.y + this.height / 2,
      fill: "none",
    });
    this.node.appendChild(this.nodeCircle);

    // Most games use some of the following properties
    this.value = -1;
    this.shaded = false;
    this.unshaded = false;
    this.clueCertainty = false;
    this.realClue = false;
    this.loops = { top: false, left: false, right: false, bottom: false };
    this.crosses = { top: false, left: false, right: false, bottom: false };
    this.walls = { top: false, left: false, right: false, bottom: false };
    this.bridges = { top: false, left: false, right: false, bottom: false };
    this.edges = { top: false, left: false, right: false, bottom: false };
  }

  // Most games use some of the following methods
  markTrueClue() {
    if (~this.value) {
      this.clueCertainty = true;
      this.realClue = true;
    }
  }
  markFalseClue() {
    if (~this.value) {
      this.clueCertainty = true;
      this.realClue = false;
    }
  }
  markUncertainClue() {
    this.clueCertainty = false;
  }
  markVague() {
    this.shaded = false;
    this.unshaded = false;
  }
  markShaded() {
    this.shaded = true;
    this.unshaded = false;
  }
  markUnshaded() {
    this.shaded = false;
    this.unshaded = true;
  }

  // Toggle clue certainty
  // Possible options: Uncertain, certain and clue is true, certain and clue is false;
  toggleCertainty(leftClick = true) {
    if (!this.clueCertainty) {
      leftClick ? this.markTrueClue() : this.markFalseClue();
    } else if (this.realClue) {
      leftClick ? this.markFalseClue() : this.markUncertainClue();
    } else {
      leftClick ? this.markUncertainClue() : this.markTrueClue();
    }
  }

  // Toggle cell shading
  // Possible options: Uncertain, shaded, unshaded
  toggleShading(leftClick = true) {
    if (!this.shaded && !this.unshaded) {
      leftClick ? this.markShaded() : this.markUnshaded();
    } else if (this.shaded) {
      leftClick ? this.markUnshaded() : this.markVague();
    } else {
      leftClick ? this.markVague() : this.markShaded();
    }
  }

  // If an event occurs within the cell, get coordinates of the event
  // [0, 0] = center of cell
  // Positive x = right side of cell
  // Positive y = bottom of cell
  eventDirection(event) {
    let [x, y] = [
      event.offsetX - this.width / 2,
      event.offsetY - this.height / 2,
    ];
    // Figure out if event is in the top, left, right, or bottom of cell
    if (x < 0 && -x > Math.abs(y)) {
      return { direction: "left", opposite: "right" };
    } else if (x > 0 && x > Math.abs(y)) {
      return { direction: "right", opposite: "left" };
    } else if (y > 0 && y > Math.abs(x)) {
      return { direction: "bottom", opposite: "top" };
    } else {
      return { direction: "top", opposite: "bottom" };
    }
  }

  // Cycle between wall segment options: Uncertain, wall, bridge (no wall)
  toggleWall(direction, leftClick = true) {
    const dir = direction.direction;
    const opp = direction.opposite;
    const neighbor = this.neighbors[dir];
    if (~neighbor) {
      if (!this.walls[dir] && !this.bridges[dir]) {
        // Option 1: Neither wall nor bridge on vertex. If left-click, add wall; if right-click, add bridge
        this.walls[dir] = leftClick;
        neighbor.walls[opp] = leftClick;
        this.bridges[dir] = !leftClick;
        neighbor.bridges[opp] = !leftClick;
      } else if (this.walls[dir]) {
        // Option 2: Wall on vertex. If left-click, change to bridge; if right-click, remove wall
        this.walls[dir] = false;
        neighbor.walls[opp] = false;
        this.bridges[dir] = leftClick;
        neighbor.bridges[opp] = leftClick;
      } else {
        // Option 3: Bridge on vertex. If left-click, remove bridge; if right-click, change to wall
        this.walls[dir] = !leftClick;
        neighbor.walls[opp] = !leftClick;
        this.bridges[dir] = false;
        neighbor.bridges[opp] = false;
      }
    }
  }

  // Cycle between loop segment options: Uncertain, loop segment, loop cross
  toggleLoop(direction, leftClick = true) {
    const dir = direction.direction;
    const opp = direction.opposite;
    const neighbor = this.neighbors[dir];
    if (~neighbor) {
      if (!this.loops[dir] && !this.crosses[dir]) {
        // Option 1: Neither loop nor cross on vertex. If left-click, add loop; if right-click, add cross
        this.loops[dir] = leftClick;
        neighbor.loops[opp] = leftClick;
        this.crosses[dir] = !leftClick;
        neighbor.crosses[opp] = !leftClick;
      } else if (this.loops[dir]) {
        // Option 2: Loop on vertex. If left-click, change to cross; if right-click, remove loop
        this.loops[dir] = false;
        neighbor.loops[opp] = false;
        this.crosses[dir] = leftClick;
        neighbor.crosses[opp] = leftClick;
      } else {
        // Option 3: Cross on vertex. If left-click, remove cross; if right-click, change to loop
        this.loops[dir] = !leftClick;
        neighbor.loops[opp] = !leftClick;
        this.crosses[dir] = false;
        neighbor.crosses[opp] = false;
      }
    }
  }

  // Cycle between edge segment options: Uncertain, edge segment, edge cross
  // Slightly different than toggleLoop() because edge segments can be toggled on the perimeter of the grid (loops can't)
  toggleEdge(direction, leftClick = true) {
    const dir = direction.direction;
    const opp = direction.opposite;
    const neighbor = this.neighbors[dir];
    if (!this.edges[dir] && !this.crosses[dir]) {
      // Option 1: Neither edge nor cross on vertex. If left-click, add edge; if right-click, add cross
      this.edges[dir] = leftClick;
      this.crosses[dir] = !leftClick;
      if (~neighbor) {
        neighbor.edges[opp] = leftClick;
        neighbor.crosses[opp] = !leftClick;
      }
    } else if (this.edges[dir]) {
      // Option 2: Edge on vertex. If left-click, change to cross; if right-click, remove edge
      this.edges[dir] = false;
      this.crosses[dir] = leftClick;
      if (~neighbor) {
        neighbor.edges[opp] = false;
        neighbor.crosses[opp] = leftClick;
      }
    } else {
      // Option 3: Cross on vertex. If left-click, remove cross; if right-click, change to edge
      this.edges[dir] = !leftClick;
      this.crosses[dir] = false;
      if (~neighbor) {
        neighbor.edges[opp] = !leftClick;
        neighbor.crosses[opp] = false;
      }
    }
  }

  // Transfer cell's walls/loops/edges/bridges/crosses from this puzzle to a different puzzle
  transfer(puzzle, type) {
    for (let cell of [this, ...Object.values(this.neighbors)]) {
      if (~cell) {
        puzzle.board[cell.row][cell.column][type] = Object.assign(
          {},
          cell[type]
        );
      }
    }
  }

  // Update cell's HTML representation
  update() {
    let classes = this.defaultClasses.slice();
    this.shaded && classes.push("shaded");
    this.unshaded && classes.push("unshaded");
    ~this.value && classes.push("clue");
    ~this.value && this.clueCertainty && this.realClue && classes.push("true");
    ~this.value &&
      this.clueCertainty &&
      !this.realClue &&
      classes.push("false");

    this.node.className.baseVal = "";
    this.node.classList.add(...classes);

    this.nodeText.textContent = ~this.value ? this.value : "";
  }
}

class Puzzle {
  constructor(parent) {
    this.parent = parent;
    this.rows = parent.rows;
    this.columns = parent.columns;
    this.name = "Puzzle name";
    this.description = "Puzzle description";
    this.board = make2dArray(this.rows, this.columns);
    this.complete = false;
    this.valid = true;
    this.cellType = Cell;

    // By default: assume puzzle uses a grid between cells, no walls, no loops, no edges
    this.useGrid = true;
    this.useWalls = false;
    this.useLoops = false;
    this.useEdges = false;
    this.useCrosses = false;

    this.node = newSVG("svg");
    this.node.classList.add("board");
    this.node.setAttributes({
      viewBox: `-5 -5 110 110`,
      width: "100%",
    });

    //this.node.addEventListener("mouseleave", (e) => {
    //  document.getElementById("cellstyle").innerText = ``;
    //});
  }

  // Initially, this.board is an empty 2d array. initialize() has to be called in order to fill in the board and set some final properties.
  initialize() {
    this.token = this.name.toLowerCase().split(" ").join("");
    this.node.classList.add(this.token);

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        // Initialize a new cell
        let newCell = new this.cellType(row, col);
        // Initialize boundary grid walls (not all puzzles use this)
        newCell.walls = {
          top: row == 0,
          bottom: row == this.rows - 1,
          left: col == 0,
          right: col == this.columns - 1,
        };

        // Add left-click and right-click events for cell
        newCell.node.addEventListener("click", (event) => {
          event.preventDefault();
          this.clickCell(newCell, event);
        });
        newCell.node.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          this.clickCell(newCell, event, false);
        });
        /*
        newCell.node.addEventListener("mouseover", (event) => {
          document.getElementById("cellstyle").innerText = this.parent
            .markVertices
            ? `td.row${newCell.row}.col${newCell.column} {border-color: #8888ff;}`
            : `td.row${newCell.row}.col${newCell.column} {filter: invert(5%);}`;
        });
        */

        this.board[row][col] = newCell;
      }
    }

    // Once every cell in the board is populated, fill in the cell neighbors property
    this.populateNeighbors();
    this.appendChildren();
  }

  // Every cell has a neighbors property that should be filled in
  populateNeighbors() {
    for (let cell of this.board.flat()) {
      if (!cell.neighbors) {
        break;
      }
      if (cell.row > 0) {
        cell.neighbors.top = this.board[cell.row - 1][cell.column];
      }
      if (cell.row < this.rows - 1) {
        cell.neighbors.bottom = this.board[cell.row + 1][cell.column];
      }
      if (cell.column > 0) {
        cell.neighbors.left = this.board[cell.row][cell.column - 1];
      }
      if (cell.column < this.columns - 1) {
        cell.neighbors.right = this.board[cell.row][cell.column + 1];
      }
    }
  }

  // Append cells, grid, walls, etc as child elements of the main SVG element
  appendChildren() {
    // First children of the puzzle element: the cells
    this.board.flat().forEach((cell) => {
      this.node.appendChild(cell.node);
    });
    // Next, the grid between the cells (if used)
    if (this.useGrid) {
      this.grid = newSVG("path");
      this.grid.classList.add("grid", this.token);
      this.grid.update = () => {
        let bottom = 10 * this.rows;
        let right = 10 * this.columns;
        let path = "";
        for (let row = 0; row <= this.rows; row++) {
          path += `M 0 ${10 * row} L ${right} ${10 * row} `;
        }
        for (let col = 0; col <= this.columns; col++) {
          path += `M ${10 * col} 0 L ${10 * col} ${bottom} `;
        }
        this.grid.setAttributes({ d: path, stroke: "grey", "stroke-width": 1 });
      };
      this.node.appendChild(this.grid);
    }

    // Wall node (if used)
    if (this.useWalls) {
      this.walls = newSVG("path");
      this.walls.classList.add("walls", this.token);
      this.walls.update = () => {
        let path = "";
        this.board.flat().forEach((cell) => {
          if (cell.walls.left) {
            path += `M ${cell.column * 10} ${cell.row * 10} l 0 10 `;
          }
          if (cell.walls.top) {
            path += `M ${cell.column * 10} ${cell.row * 10} l 10 0 `;
          }
          if (cell.column == this.columns - 1 && cell.walls.right) {
            path += `M ${cell.column * 10 + 10} ${cell.row * 10} l 0 10 `;
          }
          if (cell.row == this.rows - 1 && cell.walls.bottom) {
            path += `M ${cell.column * 10} ${cell.row * 10 + 10} l 10 0 `;
          }
        });
        this.walls.setAttributes({
          d: path,
          stroke: "black",
          "stroke-width": 2.5,
          "stroke-linecap": "round",
        });
      };
      this.node.appendChild(this.walls);
    }

    // Bridges nodes (if used)
    if (this.useBridges) {
      this.bridges = newSVG("path");
      this.bridges.classList.add("bridges", this.token);
      this.bridges.update = () => {
        let path = "";
        this.board.flat().forEach((cell) => {
          if (cell.bridges.left) {
            path += `M ${cell.column * 10 + 3} ${cell.row * 10 + 5} l -6 0 `;
          }
          if (cell.bridges.top) {
            path += `M ${cell.column * 10 + 5} ${cell.row * 10 + 3} l 0 -6 `;
          }
          if (cell.column == this.columns - 1 && cell.bridges.right) {
            path += `M ${cell.column * 10 + 7} ${cell.row * 10 + 5} l 6 0 `;
          }
          if (cell.row == this.rows - 1 && cell.bridges.bottom) {
            path += `M ${cell.column * 10 + 5} ${cell.row * 10 + 7} l 0 6 `;
          }
        });
        this.bridges.setAttributes({
          d: path,
          stroke: "green",
          "stroke-width": 1.5,
          "stroke-linecap": "round",
        });
      };
      this.node.appendChild(this.bridges);
    }

    // Loops node (if used)
    if (this.useLoops) {
      this.loops = newSVG("path");
      this.loops.classList.add("loops", this.token);
      this.loops.update = () => {
        let path = "";
        this.board.flat().forEach((cell) => {
          if (cell.loops.left) {
            path += `M ${cell.column * 10 + 5} ${cell.row * 10 + 5} l -10 0 `;
          }
          if (cell.loops.top) {
            path += `M ${cell.column * 10 + 5} ${cell.row * 10 + 5} l 0 -10 `;
          }
          if (cell.column == this.columns - 1 && cell.loops.right) {
            path += `M ${cell.column * 10 + 5} ${cell.row * 10 + 5} l 10 0 `;
          }
          if (cell.row == this.rows - 1 && cell.loops.bottom) {
            path += `M ${cell.column * 10 + 5} ${cell.row * 10 + 5} l 0 10 `;
          }
        });
        this.loops.setAttributes({
          d: path,
          stroke: "blue",
          "stroke-width": 2.5,
          "stroke-linecap": "round",
        });
      };
      this.node.appendChild(this.loops);
    }

    // Crosses node (if used) {
    if (this.useCrosses) {
      this.crosses = newSVG("path");
      this.crosses.classList.add("crosses", this.token);
      this.crosses.update = () => {
        let path = "";
        this.board.flat().forEach((cell) => {
          if (cell.crosses.left) {
            path += `M ${cell.column * 10} ${
              cell.row * 10 + 5
            } m -2 -2 l 4 4 m -4 0 l 4 -4 `;
          }
          if (cell.crosses.top) {
            path += `M ${cell.column * 10 + 5} ${
              cell.row * 10
            } m -2 -2 l 4 4 m -4 0 l 4 -4 `;
          }
          if (cell.column == this.columns - 1 && cell.crosses.right) {
            path += `M ${cell.column * 10 + 5} ${cell.row * 10 + 5} l 10 0 `;
          }
          if (cell.row == this.rows - 1 && cell.crosses.bottom) {
            path += `M ${cell.column * 10 + 5} ${cell.row * 10 + 5} l 0 10 `;
          }
        });
        this.crosses.setAttributes({
          d: path,
          stroke: "red",
          "stroke-width": 1.5,
          "stroke-linecap": "flat",
        });
      };
      this.node.appendChild(this.crosses);
    }

    // Edges node (if used)
    if (this.useEdges) {
      this.edges = newSVG("path");
      this.edges.classList.add("edges", this.token);
      this.edges.update = () => {
        let path = "";
        this.board.flat().forEach((cell) => {
          if (cell.edges.left) {
            path += `M ${cell.column * 10} ${cell.row * 10} l 0 10 `;
          }
          if (cell.edges.top) {
            path += `M ${cell.column * 10} ${cell.row * 10} l 10 0 `;
          }
          if (cell.column == this.columns - 1 && cell.edges.right) {
            path += `M ${cell.column * 10 + 10} ${cell.row * 10} l 0 10 `;
          }
          if (cell.row == this.rows - 1 && cell.edges.bottom) {
            path += `M ${cell.column * 10} ${cell.row * 10 + 10} l 10 0 `;
          }
        });
        this.edges.setAttributes({
          d: path,
          stroke: "blue",
          "stroke-width": 2.5,
          "stroke-linecap": "flat",
        });
      };
      this.node.appendChild(this.edges);
    }
  }

  // Initialize the cell values from a given array
  populate(array) {
    this.board.flat().forEach((cell) => {
      cell.value = array[cell.row][cell.column];
    });
  }

  // The method called when a cell is clicked
  clickCell(cell, event, leftClick = true) {}

  // Update the table element
  update() {
    // Update each cell
    this.board.flat().forEach((cell) => {
      cell.update();
    });

    // Update grid, walls, bridges, loops, crosses, edges
    if (this.useGrid) {
      this.grid.update();
    }
    if (this.useWalls) {
      this.walls.update();
    }
    if (this.useBridges) {
      this.bridges.update();
    }
    if (this.useLoops) {
      this.loops.update();
    }
    if (this.useCrosses) {
      this.crosses.update();
    }
    if (this.useEdges) {
      this.edges.update();
    }
  }
}
