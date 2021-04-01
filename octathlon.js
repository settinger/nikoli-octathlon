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
    this.nurikuro = new Nurikuro(this);
    this.shikaku = new Shikaku(this);
    this.slitherlink = new Slitherlink(this);

    this.markVertices = false;

    // this.node = newSVG("svg");
    // this.node.setAttributes({ viewBox: "-50 -50 1300 1700", width: "100%" });
  }

  // Take snapshot of current octathlon state (in a way that doesn't create a recursive object)
  snapshot() {
    const snapshot = {
      akariGivens: make2dArray(this.rows, this.columns),
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
      countryRoadGivens: make2dArray(this.rows, this.columns),
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

      snapshot.akariObjects[cell.row][cell.column] =
        (cell.shaded << 0) |
        (cell.unshaded << 1) |
        (cell.lamp << 2) |
        (cell.auxMark << 3) |
        (cell.clueCertainty << 4) |
        (cell.realClue << 5);
    });

    // Ushing the Shikaku cells: build array of Shikaku clues, Shikaku/Heyawake rooms, Shikaku clue truth
    this.shikaku.board.flat().forEach((cell) => {
      snapshot.shikakuGivens[cell.row][cell.column] = cell.value;

      snapshot.shikakuClues[cell.row][cell.column] =
        (cell.clueCertainty << 0) | (cell.realClue << 1);

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
        (cell.clueCertainty << 0) | (cell.realClue << 1);

      snapshot.heyawakeShading[cell.row][cell.column] =
        (cell.shaded << 0) | (cell.unshaded << 1);
    });

    // Using the Nurikabe cells: build array of Nurikuro givens, Nurikabe values, Nurikabe shading / Fillomino clue truth
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

    // Using the Country Road cells, build array of Country Road givens
    this.countryRoad.board.flat().forEach((cell) => {
      snapshot.countryRoadGivens[cell.row][cell.column] = cell.value;
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
        (cell.edges.top << 0) |
        (cell.edges.left << 1) |
        (cell.edges.right << 2) |
        (cell.edges.bottom << 3) |
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
    document.activeElement.blur();
  }

  // Restore game data from uploaded save file
  restore(snapshot) {
    // Function to get the value of a particular bit of an integer
    const getBit = (int, bit) => {
      return !!((int >> bit) & 1);
    };

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        let akariGivens = snapshot.akariGivens[row][col];
        let akariObjects = snapshot.akariObjects[row][col];
        let shikakuGivens = snapshot.shikakuGivens[row][col];
        let shikakuClues = snapshot.shikakuClues[row][col];
        let shikakuRooms = snapshot.shikakuRooms[row][col];
        let heyawakeGivens = snapshot.heyawakeGivens[row][col];
        let heyawakeClues = snapshot.heyawakeClues[row][col];
        let heyawakeShading = snapshot.heyawakeShading[row][col];
        let nurikabeGivens = snapshot.nurikabeGivens[row][col];
        let nurikabeValues = snapshot.nurikabeValues[row][col];
        let nurikabeShading = snapshot.nurikabeShading[row][col];
        let fillominoGivens = snapshot.fillominoGivens[row][col];
        let fillominoRooms = snapshot.fillominoRooms[row][col];
        let countryRoadGivens = snapshot.countryRoadGivens[row][col];
        let masyuGivens = snapshot.masyuGivens[row][col];
        let masyuClues = snapshot.masyuClues[row][col];
        let masyuLoops = snapshot.masyuLoops[row][col];
        let corralGivens = snapshot.corralGivens[row][col];
        let corralShading = snapshot.corralShading[row][col];
        let corralLoops = snapshot.corralLoops[row][col];
        let hitoriGivens = snapshot.hitoriGivens[row][col];
        let hitoriValues = snapshot.hitoriValues[row][col];

        let cell;

        // Akari board: use akariGivens, akariObjects
        cell = this.akari.board[row][col];
        cell.value = akariGivens;
        cell.shaded = getBit(akariObjects, 0);
        cell.unshaded = getBit(akariObjects, 1);
        cell.lamp = getBit(akariObjects, 2);
        cell.auxMark = getBit(akariObjects, 3);
        cell.clueCertainty = getBit(akariObjects, 4);
        cell.realClue = getBit(akariObjects, 5);

        // Shikaku board: use shikakuGivens, shikakuClues, shikakuRooms
        cell = this.shikaku.board[row][col];
        cell.value = shikakuGivens;
        cell.clueCertainty = getBit(shikakuClues, 0);
        cell.realClue = getBit(shikakuClues, 1);
        cell.walls = {
          top: getBit(shikakuRooms, 0),
          left: getBit(shikakuRooms, 1),
          right: getBit(shikakuRooms, 2),
          bottom: getBit(shikakuRooms, 3),
        };
        cell.bridges = {
          top: getBit(shikakuRooms, 4),
          left: getBit(shikakuRooms, 5),
          right: getBit(shikakuRooms, 6),
          bottom: getBit(shikakuRooms, 7),
        };

        // Heyawake: use shikakuRooms, heyawakeGivens, heyawakeClues, heyawakeShading
        cell = this.heyawake.board[row][col];
        cell.value = heyawakeGivens;
        cell.walls = {
          top: getBit(shikakuRooms, 0),
          left: getBit(shikakuRooms, 1),
          right: getBit(shikakuRooms, 2),
          bottom: getBit(shikakuRooms, 3),
        };
        cell.bridges = {
          top: getBit(shikakuRooms, 4),
          left: getBit(shikakuRooms, 5),
          right: getBit(shikakuRooms, 6),
          bottom: getBit(shikakuRooms, 7),
        };
        cell.clueCertainty = getBit(heyawakeClues, 0);
        cell.realClue = getBit(heyawakeClues, 1);
        cell.shaded = getBit(heyawakeShading, 0);
        cell.unshaded = getBit(heyawakeShading, 1);

        // Kurodoko: use heyawakeShading, nurikabeGivens, nurikabeValues
        cell = this.kurodoko.board[row][col];
        cell.originalValue = nurikabeGivens;
        cell.shaded = getBit(heyawakeShading, 0);
        cell.unshaded = getBit(heyawakeShading, 1);
        cell.value = ~nurikabeValues ? nurikabeGivens - nurikabeValues : -1;

        // Nurikabe: use nurikabeGivens, nurikabeValues, nurikabeShading
        cell = this.nurikabe.board[row][col];
        cell.originalValue = nurikabeGivens;
        cell.shaded = getBit(nurikabeShading, 0);
        cell.unshaded = getBit(nurikabeShading, 1);
        cell.value = ~nurikabeValues ? nurikabeValues : -1;

        // Nurikuro: use nurikabeGivens, nurikabeShading
        cell = this.nurikuro.board[row][col];
        cell.value = nurikabeGivens;
        cell.shaded = getBit(nurikabeShading, 0);
        cell.unshaded = getBit(nurikabeShading, 1);

        // Fillomino: use fillominoGivens, nurikabeShading, fillominoRooms
        cell = this.fillomino.board[row][col];
        cell.value = fillominoGivens;
        cell.walls = {
          top: getBit(fillominoRooms, 0),
          left: getBit(fillominoRooms, 1),
          right: getBit(fillominoRooms, 2),
          bottom: getBit(fillominoRooms, 3),
        };
        cell.bridges = {
          top: getBit(fillominoRooms, 4),
          left: getBit(fillominoRooms, 5),
          right: getBit(fillominoRooms, 6),
          bottom: getBit(fillominoRooms, 7),
        };
        cell.clueCertainty =
          getBit(nurikabeShading, 0) || getBit(nurikabeShading, 1);
        cell.realClue = getBit(nurikabeShading, 1) && cell.clueCertainty;

        // Country Road: use countryRoadGivens, fillominoRooms, masyuLoops
        cell = this.countryRoad.board[row][col];
        cell.value = countryRoadGivens;
        cell.walls = {
          top: getBit(fillominoRooms, 0),
          left: getBit(fillominoRooms, 1),
          right: getBit(fillominoRooms, 2),
          bottom: getBit(fillominoRooms, 3),
        };
        cell.bridges = {
          top: getBit(fillominoRooms, 4),
          left: getBit(fillominoRooms, 5),
          right: getBit(fillominoRooms, 6),
          bottom: getBit(fillominoRooms, 7),
        };
        cell.loops = {
          top: getBit(masyuLoops, 0),
          left: getBit(masyuLoops, 1),
          right: getBit(masyuLoops, 2),
          bottom: getBit(masyuLoops, 3),
        };
        cell.crosses = {
          top: getBit(masyuLoops, 4),
          left: getBit(masyuLoops, 5),
          right: getBit(masyuLoops, 6),
          bottom: getBit(masyuLoops, 7),
        };

        // Masyu: use masyuGivens, masyuLoops, masyuClues
        cell = this.masyu.board[row][col];
        cell.value = masyuGivens;
        cell.realClue = !!masyuClues;
        cell.loops = {
          top: getBit(masyuLoops, 0),
          left: getBit(masyuLoops, 1),
          right: getBit(masyuLoops, 2),
          bottom: getBit(masyuLoops, 3),
        };
        cell.crosses = {
          top: getBit(masyuLoops, 4),
          left: getBit(masyuLoops, 5),
          right: getBit(masyuLoops, 6),
          bottom: getBit(masyuLoops, 7),
        };

        // Corralsyu: use corralGivens, corralShading, masyuClues
        cell = this.corralsyu.board[row][col];
        cell.corralValue = corralGivens;
        cell.masyuValue = masyuGivens;
        cell.shaded = getBit(corralShading, 0);
        cell.unshaded = getBit(corralShading, 1);
        cell.realClue = !!masyuClues;

        // Corral: use corralShading, corralLoops
        cell = this.corral.board[row][col];
        cell.value = !!masyuClues ? corralGivens : -1;
        cell.shaded = getBit(corralShading, 0);
        cell.unshaded = getBit(corralShading, 1);
        cell.edges = {
          top: getBit(corralLoops, 0),
          left: getBit(corralLoops, 1),
          right: getBit(corralLoops, 2),
          bottom: getBit(corralLoops, 3),
        };
        cell.crosses = {
          top: getBit(corralLoops, 4),
          left: getBit(corralLoops, 5),
          right: getBit(corralLoops, 6),
          bottom: getBit(corralLoops, 7),
        };

        // Slitherlink: use corralLoops, hitoriGivens, hitoriValues
        cell = this.slitherlink.board[row][col];
        cell.value = ~hitoriValues
          ? (hitoriGivens - hitoriValues + 10) % 10
          : -1;
        cell.edges = {
          top: getBit(corralLoops, 0),
          left: getBit(corralLoops, 1),
          right: getBit(corralLoops, 2),
          bottom: getBit(corralLoops, 3),
        };
        cell.crosses = {
          top: getBit(corralLoops, 4),
          left: getBit(corralLoops, 5),
          right: getBit(corralLoops, 6),
          bottom: getBit(corralLoops, 7),
        };

        // Hitori: use akariObjects, hitoriGivens, hitoriValues
        cell = this.hitori.board[row][col];
        cell.value = hitoriValues;
        cell.shaded = getBit(akariObjects, 0);
        cell.unshaded = getBit(akariObjects, 1);

        // Hitorilink: use akariObjects, hitoriGivens
        cell = this.hitorilink.board[row][col];
        cell.value = hitoriGivens;
        cell.shaded = getBit(akariObjects, 0);
        cell.unshaded = getBit(akariObjects, 1);
      }
    }
    this.akari.update();
    this.shikaku.update();
    this.heyawake.update();
    this.kurodoko.update();
    this.nurikabe.update();
    this.nurikuro.update();
    this.fillomino.update();
    this.countryRoad.update();
    this.masyu.update();
    this.corralsyu.update();
    this.corral.update();
    this.slitherlink.update();
    this.hitori.update();
    this.hitorilink.update();
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
    input.accept = ".txt";
    input.onchange = (e) => {
      const file = e.target.files[0];
      reader.readAsText(file, "UTF-8");
    };
    input.style.display = "none";
    input.click();
    document.activeElement.blur();
  }
}
