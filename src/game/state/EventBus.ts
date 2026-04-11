import type { Position } from '../entities/Position';

export interface UnitMovementEvent {
  readonly id: string;
  readonly fromX: number;
  readonly fromY: number;
  readonly toX: number;
  readonly toY: number;
}

export interface ViewportUpdatedEvent {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface EventMap {
  gameStarted: undefined;
  returnToMainMenu: undefined;
  gameLoaded: undefined;
  cameraJump: Position;
  unitMoved: UnitMovementEvent;
  viewportUpdated: ViewportUpdatedEvent;
  notification: string;
  unitSelected: string | null;
  settlementSelected: string | null;
  tileSelected: Position | null;
  combatRequested: Position;
  nativeTradeRequested: string;
}

type EventKey = keyof EventMap;
type EventCallback<K extends EventKey> = (
  payload: EventMap[K]
) => void;

class EventBus {
  private readonly listeners = new Map<EventKey, Set<EventCallback<EventKey>>>();

  on<K extends EventKey>(event: K, callback: EventCallback<K>): () => void {
    const listeners = this.listeners.get(event) ?? new Set<EventCallback<EventKey>>();
    listeners.add(callback as EventCallback<EventKey>);
    this.listeners.set(event, listeners);
    return () => { this.off(event, callback); };
  }

  off<K extends EventKey>(event: K, callback: EventCallback<K>): void {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }

    listeners.delete(callback as EventCallback<EventKey>);

    if (listeners.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit<K extends EventKey>(
    event: K,
    ...args: EventMap[K] extends undefined ? [] : [EventMap[K]]
  ): void {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }

    if (args.length === 0) {
      listeners.forEach((callback) => {
        (callback as EventCallback<K>)(undefined as EventMap[K]);
      });
      return;
    }

    const payload = args[0];
    listeners.forEach((callback) => {
      (callback as EventCallback<K>)(payload);
    });
  }
}

export const eventBus = new EventBus();
