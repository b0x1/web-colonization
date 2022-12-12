//import Phaser from 'phaser'

import World from './world.js';

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [World],
}

let game = new Phaser.Game(config);
export default game;
