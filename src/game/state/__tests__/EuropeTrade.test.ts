import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';
import { Player } from '../../entities/Player';
import { Unit } from '../../entities/Unit';
import { GoodType, UnitType } from '../../entities/types';

describe('Europe Trade', () => {
  beforeEach(() => {
    // Reset store state before each test
    const p1 = new Player('p1', 'Player 1', true, 1000);
    const ship = new Unit('ship1', 'p1', UnitType.SHIP, 0, 0, 1);
    ship.cargo.set(GoodType.LUMBER, 50);
    p1.units.push(ship);

    useGameStore.setState({
      players: [p1],
      currentPlayerId: 'p1',
      selectedUnitId: 'ship1',
      isEuropeScreenOpen: false,
      oldWorldPrices: {
        [GoodType.FOOD]: 1,
        [GoodType.LUMBER]: 2,
        [GoodType.ORE]: 3,
        [GoodType.LEAF_CROP]: 4,
        [GoodType.FIBER_CROP]: 3,
        [GoodType.PELTS]: 5,
        [GoodType.TOOLS]: 6,
        [GoodType.FIREARMS]: 8,
      },
    });
  });

  it('should sell goods and increase player gold', () => {
    const { sellGood } = useGameStore.getState();
    sellGood('ship1', GoodType.LUMBER, 10);

    const { players, oldWorldPrices } = useGameStore.getState();
    const player = players[0];
    const ship = player.units[0];

    // Initial gold 1000, sold 10 LUMBER at 2g each = +20g
    expect(player.gold).toBe(1020);
    expect(ship.cargo.get(GoodType.LUMBER)).toBe(40);
    // Sold <= 20, price should remain the same
    expect(oldWorldPrices[GoodType.LUMBER]).toBe(2);
  });

  it('should reduce price when selling more than 20 units', () => {
    const { sellGood } = useGameStore.getState();
    sellGood('ship1', GoodType.LUMBER, 21);

    const { players, oldWorldPrices } = useGameStore.getState();
    const player = players[0];

    // Initial gold 1000, sold 21 LUMBER at 2g each = +42g
    expect(player.gold).toBe(1042);
    // Sold > 20, price should drop by 1
    expect(oldWorldPrices[GoodType.LUMBER]).toBe(1);
  });

  it('should buy goods and decrease player gold', () => {
    const { buyGood } = useGameStore.getState();
    buyGood('ship1', GoodType.FIREARMS, 10);

    const { players } = useGameStore.getState();
    const player = players[0];
    const ship = player.units[0];

    // Initial gold 1000, bought 10 FIREARMS at 8g each = -80g
    expect(player.gold).toBe(920);
    expect(ship.cargo.get(GoodType.FIREARMS)).toBe(10);
  });

  it('should recruit a MILITIA if ship has 50 FIREARMS', () => {
    const { recruitUnit } = useGameStore.getState();

    // Give ship 50 firearms
    useGameStore.setState((state) => {
        const p1 = state.players[0];
        p1.units[0].cargo.set(GoodType.FIREARMS, 50);
        return { players: [p1] };
    });

    recruitUnit(UnitType.MILITIA);

    const { players } = useGameStore.getState();
    const player = players[0];
    const ship = player.units.find(u => u.type === UnitType.SHIP)!;

    // Initial gold 1000, MILITIA costs 800g = 200g left
    expect(player.gold).toBe(200);
    // 50 FIREARMS consumed
    expect(ship.cargo.get(GoodType.FIREARMS)).toBe(0);
    // New MILITIA unit added
    expect(player.units.length).toBe(2);
    expect(player.units.some(u => u.type === UnitType.MILITIA)).toBe(true);
  });

  it('should NOT recruit a MILITIA if ship lacks FIREARMS', () => {
    const { recruitUnit } = useGameStore.getState();

    recruitUnit(UnitType.MILITIA);

    const { players } = useGameStore.getState();
    const player = players[0];

    // Gold should not change
    expect(player.gold).toBe(1000);
    // No new unit
    expect(player.units.length).toBe(1);
  });
});
