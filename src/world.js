export default class World extends Phaser.Scene
{
	constructor() {
		super('Welcome to Web Colonization');
	}

	preload() {
        this.load.image('base_tiles', 'assets/tiles/fantasyhextiles_v3.png');
    }

    create() {
    
        const array=[[0,  0],
                     [17,24]];

        const map = this.make.tilemap({ data:array, tileWidth: 32, tileHeight: 48});

        map.addTilesetImage("base_tiles");

        const layer = map.createLayer(0, "base_tiles", 0, 0);
    }
}
