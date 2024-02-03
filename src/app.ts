import 'phaser';
import configureGame from './game/ui/Config';

let game: Phaser.Game | null = null;
let config = configureGame(game);
game = new Phaser.Game(config);
