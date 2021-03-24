class CorralCell extends Cell {
  constructor(row, column) {
    super(row, column);
  }

  // Add or remove an edge segment
  // Slightly different than default toggleEdge because in Corral, edge crosses are not necessary
  toggleEdge(direction) {
    const dir = direction.direction;
    const opp = direction.opposite;
    const neighbor = this.neighbors[dir];
    this.edges[dir] = !this.edges[dir];
    this.crosses[dir] = false;
    if (~neighbor) {
      neighbor.edges[opp] = !neighbor.edges[opp];
      neighbor.crosses[opp] = false;
    }
  }

  // Update cell's HTML form
  update() {
    this.node.innerHTML = "";

    this.node.className = "corral cell";
    this.edges.top && this.node.classList.add("topedge");
    this.edges.left && this.node.classList.add("leftedge");
    this.edges.right && this.node.classList.add("rightedge");
    this.edges.bottom && this.node.classList.add("bottomedge");
    this.shaded && this.node.classList.add("shaded");
    this.unshaded && this.node.classList.add("unshaded");

    if (~this.value) {
      this.node.innerText = String(this.value);
    }

    // If there is an edge on the cell, add edge divs
    // I tried doing this with border CSS and it looked awful
    if (this.edges.top) {
      const div = document.createElement("div");
      div.classList.add("topedge");
      this.node.appendChild(div);
    }
    if (this.edges.left) {
      const div = document.createElement("div");
      div.classList.add("leftedge");
      this.node.appendChild(div);
    }
    if (this.edges.right) {
      const div = document.createElement("div");
      div.classList.add("rightedge");
      this.node.appendChild(div);
    }
    if (this.edges.bottom) {
      const div = document.createElement("div");
      div.classList.add("bottomedge");
      this.node.appendChild(div);
    }
  }
}

class Corral extends Puzzle {
  constructor(parent) {
    super(parent);
    this.cellType = CorralCell;
    this.initializeCells();
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
