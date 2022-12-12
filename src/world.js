export default class World extends Phaser.Scene
{
	constructor() {
		super('Welcome to Web Colonization');
        this.controls = null;
	}

	preload() {
        this.load.image('base_tiles', 'assets/tiles/fantasyhextiles_v3.png');
        this.load.tilemapTiledJSON('map', 'assets/tiles/hexagon-tilemap.json');
    }

    create() {
    
        var map = this.add.tilemap('map');
        var tileset = map.addTilesetImage('tileset', 'base_tiles');

        map.createLayer('Calque 1', tileset);

        var cursors = this.input.keyboard.createCursorKeys();
    
        this.cameras.main.setZoom(2);
        this.cameras.main.centerOn(200, 100);
    
        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.02,
            drag: 0.0005,
            maxSpeed: 0.7
        };
    
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        
    }

    update(time, delta) {
        this.controls.update(delta)
    }
}
