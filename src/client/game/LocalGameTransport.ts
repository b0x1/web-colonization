import type { AuthoritativeGameState } from '@shared/game/AuthoritativeGameState';
import type { GameCommand, GameStateMessage } from '@shared/game/protocol';
import type { LocalGameServer } from '@server/game/LocalGameServer';

type Listener = (message: GameStateMessage) => void;

export interface GameTransport {
  send(command: GameCommand): GameStateMessage;
  subscribe(listener: Listener): () => void;
  getSnapshot(): GameStateMessage['state'];
  replaceState(state: AuthoritativeGameState): void;
}

export class LocalGameTransport implements GameTransport {
  constructor(private readonly server: LocalGameServer) {}

  send(command: GameCommand): GameStateMessage {
    return this.server.dispatch(command);
  }

  subscribe(listener: Listener): () => void {
    return this.server.subscribe(listener);
  }

  getSnapshot(): GameStateMessage['state'] {
    return this.server.getState();
  }

  replaceState(state: AuthoritativeGameState): void {
    this.server.replaceState(state);
  }
}
