import { adaptCanavsSize } from "../util/ui";
import NewWorld from "./NewWorld";

export default function configureGame(game: Phaser.Game | null) {
    const setCanavsSize = () => adaptCanavsSize(game);
    window.onresize = setCanavsSize;

    const gameConfig: Phaser.Types.Core.GameConfig = {
        title: 'Web Colonization',
        type: Phaser.WEBGL,
        parent: 'game',
        backgroundColor: '#351f1b',
        scale: {
            mode: Phaser.Scale.NONE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            height: window.innerHeight,
            width: window.innerWidth,
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: false,
            },
        },
        render: {
            antialiasGL: false,
            pixelArt: true,
        },
        callbacks: {
            postBoot: setCanavsSize
        },
        canvasStyle: `display: block; width: 100%; height: 100%;`,
        autoFocus: true,
        audio: {
            disableWebAudio: false,
        },
        scene: [NewWorld],
    };

    return gameConfig;
}

