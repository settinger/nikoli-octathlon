class Octathlon {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.akari = new Akari(this);
    this.corral = new Corral(this);
    this.corralsyu = new Corralsyu(this);
    this.countryRoad = new CountryRoad(this);
    this.fillomino = new Fillomino(this);
    this.heyawake = new Heyawake(this);
    this.hitori = new Hitori(this);
    this.hitorilink = new Hitorilink(this);
    this.kurodoko = new Kurodoko(this);
    this.masyu = new Masyu(this);
    this.nurikabe = new Nurikabe(this);
    this.nurikoro = new Nurikoro(this);
    this.shikaku = new Shikaku(this);
    this.slitherlink = new Slitherlink(this);

    this.markVertices = false;
  }

  // Take snapshot of current octathlon state (in a way that doesn't create a recursive object)
  snapshot() {
    const snapshot = {
      akariGivens: make2dArray(this.rows, this.columns),
      akariShading: make2dArray(this.rows, this.columns),
      akariObjects: make2dArray(this.rows, this.columns),
      shikakuGivens: make2dArray(this.rows, this.columns),
      shikakuClues: make2dArray(this.rows, this.columns),
      shikakuRooms: make2dArray(this.rows, this.columns),
      heyawakeGivens: make2dArray(this.rows, this.columns),
      heyawakeClues: make2dArray(this.rows, this.columns),
      heyawakeShading: make2dArray(this.rows, this.columns),
      nurikabeGivens: make2dArray(this.rows, this.columns),
      nurikabeValues: make2dArray(this.rows, this.columns),
      nurikabeShading: make2dArray(this.rows, this.columns),
      fillominoGivens: make2dArray(this.rows, this.columns),
      fillominoRooms: make2dArray(this.rows, this.columns),
      masyuGivens: make2dArray(this.rows, this.columns),
      masyuClues: make2dArray(this.rows, this.columns),
      masyuLoops: make2dArray(this.rows, this.columns),
      corralGivens: make2dArray(this.rows, this.columns),
      corralShading: make2dArray(this.rows, this.columns),
      corralLoops: make2dArray(this.rows, this.columns),
      hitoriGivens: make2dArray(this.rows, this.columns),
      hitoriValues: make2dArray(this.rows, this.columns),
    };

    // Using the Akari cells: build an array of Akari clues, Akari/Hitori cell shading, Akari objects
    this.akari.board.flat().forEach((cell) => {
      snapshot.akariGivens[cell.row][cell.column] = cell.value;

      snapshot.akariShading[cell.row][cell.column] =
        (cell.shaded << 0) | (cell.unshaded << 1);

      snapshot.akariObjects[cell.row][cell.column] =
        (cell.wall << 0) |
        (cell.lamp << 1) |
        (cell.auxMark << 2) |
        ((cell.clueCertainty && cell.realClue) << 3) |
        ((cell.clueCertainty && !cell.realClue) << 4);
    });

    // Ushing the Shikaku cells: build array of Shikaku clues, Shikaku/Heyawake rooms, Shikaku clue truth
    this.shikaku.board.flat().forEach((cell) => {
      snapshot.shikakuGivens[cell.row][cell.column] = cell.value;

      snapshot.shikakuClues[cell.row][cell.column] =
        ((cell.clueCertainty && cell.realClue) << 0) |
        ((cell.clueCertainty && !cell.realClue) << 1);

      snapshot.shikakuRooms[cell.row][cell.column] =
        (cell.walls.top << 0) |
        (cell.walls.left << 1) |
        (cell.walls.right << 2) |
        (cell.walls.bottom << 3) |
        (cell.bridges.top << 4) |
        (cell.bridges.left << 5) |
        (cell.bridges.right << 6) |
        (cell.bridges.bottom << 7);
    });

    // Using the Heyawake cells: build array of Heyawake clues, Heyawake clue truth, Heyawake/Kurodoko cell shading
    this.heyawake.board.flat().forEach((cell) => {
      snapshot.heyawakeGivens[cell.row][cell.column] = cell.value;

      snapshot.heyawakeClues[cell.row][cell.column] =
        ((cell.clueCertainty && cell.realClue) << 0) |
        ((cell.clueCertainty && !cell.realClue) << 1);

      snapshot.heyawakeShading[cell.row][cell.column] =
        (cell.shaded << 0) | (cell.unshaded << 1);
    });

    // Using the Nurikabe cells: build array of Nurikoro givens, Nurikabe values, Nurikabe shading / Fillomino clue truth
    this.nurikabe.board.flat().forEach((cell) => {
      snapshot.nurikabeGivens[cell.row][cell.column] = cell.originalValue;

      snapshot.nurikabeValues[cell.row][cell.column] = cell.value;

      snapshot.nurikabeShading[cell.row][cell.column] =
        (cell.shaded << 0) | (cell.unshaded << 1);
    });

    // Using the Fillomino cells, build array of Fillomino givens, Fillomino/Country Road rooms
    this.fillomino.board.flat().forEach((cell) => {
      snapshot.fillominoGivens[cell.row][cell.column] = cell.value;

      snapshot.fillominoRooms[cell.row][cell.column] =
        (cell.walls.top << 0) |
        (cell.walls.left << 1) |
        (cell.walls.right << 2) |
        (cell.walls.bottom << 3) |
        (cell.bridges.top << 4) |
        (cell.bridges.left << 5) |
        (cell.bridges.right << 6) |
        (cell.bridges.bottom << 7);
    });

    // Using the Masyu cells, build array of Masyu givens, Masyu/Country Road loop, Masyu cell truth
    this.masyu.board.flat().forEach((cell) => {
      snapshot.masyuGivens[cell.row][cell.column] = cell.value;

      snapshot.masyuClues[cell.row][cell.column] = cell.realClue << 0;

      snapshot.masyuLoops[cell.row][cell.column] =
        (cell.loops.top << 0) |
        (cell.loops.left << 1) |
        (cell.loops.right << 2) |
        (cell.loops.bottom << 3) |
        (cell.crosses.top << 4) |
        (cell.crosses.left << 5) |
        (cell.crosses.right << 6) |
        (cell.crosses.bottom << 7);
    });

    // Using the Corralsyu cells, build array of Corral givens
    this.corralsyu.board.flat().forEach((cell) => {
      snapshot.corralGivens[cell.row][cell.column] = cell.corralValue;
    });

    // Using the Corral cells, build array of Corral shading and Corral/Slitherlink loops
    this.corral.board.flat().forEach((cell) => {
      snapshot.corralShading[cell.row][cell.column] =
        (cell.shaded << 0) | (cell.unshaded << 1);

      snapshot.corralLoops[cell.row][cell.column] =
        (cell.loops.top << 0) |
        (cell.loops.left << 1) |
        (cell.loops.right << 2) |
        (cell.loops.bottom << 3) |
        (cell.crosses.top << 4) |
        (cell.crosses.left << 5) |
        (cell.crosses.right << 6) |
        (cell.crosses.bottom << 7);
    });

    // Using the Hitorilink cells, build array of Hitori givens
    this.hitorilink.board.flat().forEach((cell) => {
      snapshot.hitoriGivens[cell.row][cell.column] = cell.value;
    });

    // Using the Hitori cells, build array of Hitori/Slitherlink cell values
    this.hitori.board.flat().forEach((cell) => {
      snapshot.hitoriValues[cell.row][cell.column] = cell.value;
    });

    return snapshot;
  }

  // Download snapshot as text file
  download() {
    const blob = new Blob([JSON.stringify(this.snapshot())], {
      type: "text/plain;charset=utf-8",
    });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.style.display = "none";
    a.href = url;
    a.download = "snapshot.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Restore game data from uploaded save file
  restore(snapshot) {
    console.log(snapshot.akariGivens);
  }

  // Upload function
  upload() {
    const reader = new FileReader();
    reader.onload = (e) => {
      const snapshot = JSON.parse(e.target.result);
      this.restore(snapshot);
    };

    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = e.target.files[0];
      reader.readAsText(file, "UTF-8");
    };
    input.style.display = "none";
    input.click();
  }
}
