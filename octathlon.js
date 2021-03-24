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

    // Add click events that affect multiple boards
  }

  update() {
    this.akari.update();
    this.shikaku.update();
  }
}
