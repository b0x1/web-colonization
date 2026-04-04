import { describe, it, expect } from 'vitest';
import { NativeInteractionSystem } from '../NativeInteractionSystem';
import { NativeSettlement } from '../../entities/NativeSettlement';
import { Unit } from '../../entities/Unit';
import { Tribe, Attitude, GoodType, UnitType } from '../../entities/types';

describe('NativeInteractionSystem', () => {
  const mockSettlement = new NativeSettlement(
    's1',
    'Nahuatl Village',
    Tribe.NAHUATL,
    10,
    10,
    5,
    Attitude.FRIENDLY,
    new Map([[GoodType.FOOD, 100], [GoodType.PELTS, 50]])
  );

  const mockUnit = new Unit('u1', 'player-1', UnitType.SETTLER, 10, 10, 3);
  mockUnit.cargo.set(GoodType.TOOLS, 50);

  it('should process trade correctly and shift attitude', () => {
    const { updatedSettlement, updatedUnit, goodReceived } = NativeInteractionSystem.trade(
      mockSettlement,
      mockUnit,
      GoodType.TOOLS
    );

    expect(updatedUnit.cargo.has(GoodType.TOOLS)).toBe(false);
    expect(updatedUnit.cargo.get(goodReceived)).toBeGreaterThan(0);
    expect(updatedSettlement.goods.get(GoodType.TOOLS)).toBe(50);
    expect(updatedSettlement.attitude).toBe(Attitude.NEUTRAL);
  });

  it('should convert settler to frontiersman during learning', () => {
    const { updatedSettlement, updatedUnit } = NativeInteractionSystem.learn(
      mockSettlement,
      mockUnit
    );

    expect(updatedUnit.type).toBe(UnitType.FRONTIERSMAN);
    expect(updatedSettlement.attitude).toBe(Attitude.NEUTRAL);
  });

  it('should throw error when non-settler tries to learn', () => {
    const militia = new Unit('u2', 'player-1', UnitType.MILITIA, 10, 10, 3);
    expect(() => NativeInteractionSystem.learn(mockSettlement, militia)).toThrow();
  });

  it('should throw error when learning from non-friendly settlement', () => {
    const neutralSettlement = new NativeSettlement(
      's2',
      'Lakota Village',
      Tribe.LAKOTA,
      20,
      20,
      5,
      Attitude.NEUTRAL
    );
    expect(() => NativeInteractionSystem.learn(neutralSettlement, mockUnit)).toThrow();
  });

  it('should shift attitude correctly', () => {
    expect(NativeInteractionSystem.shiftAttitude(Attitude.FRIENDLY)).toBe(Attitude.NEUTRAL);
    expect(NativeInteractionSystem.shiftAttitude(Attitude.NEUTRAL)).toBe(Attitude.HOSTILE);
    expect(NativeInteractionSystem.shiftAttitude(Attitude.HOSTILE)).toBe(Attitude.HOSTILE);
  });
});
