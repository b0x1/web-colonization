export function adaptCanavsSize(game: Phaser.Game | null) {
	if (game?.isBooted) {
		setTimeout(() => {
			game.scale.resize(window.innerWidth, window.innerHeight);
			game.canvas.setAttribute(
				'style',
				`display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
			);
		}, 100);
	}
};


