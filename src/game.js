//import Phaser from 'phaser'

import World from './world.js';

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [World],
}

export default new Phaser.Game(config);
