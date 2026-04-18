import { test, expect } from '@playwright/test';

test('verify settlement exit works without available units', async ({ page }) => {
  await page.goto('http://localhost:4173/webcol/');

  // Start new game
  await page.click('button:has-text("NEW GAME")');
  await page.click('button:has-text("START GAME")');

  // Wait for game to load
  await page.waitForFunction(() => (window as any).useGameStore?.getState().gameStarted);

  // Manipulate state: find a settlement, move the only unit inside it (make it a worker)
  await page.evaluate(() => {
    const state = (window as any).useGameStore.getState();
    const player = state.players[0];
    const settlement = state.settlements.find((s: any) => s.ownerId === player.id);
    const unit = state.units.find((u: any) => u.ownerId === player.id);

    if (settlement && unit) {
      // 1. Move unit to settlement
      state.moveUnit(unit.id, settlement.position);

      // 2. Put unit to work (inside settlement)
      state.updateUnit(unit.id, {
        occupation: { kind: 'BUILDING', buildingId: 'town_hall' }
      });
      state.updateSettlement(settlement.id, {
        units: [unit],
        population: 1
      });

      // 3. Select the settlement tile - this should trigger auto-entry
      state.selectTile({ id: 'tile', position: settlement.position, terrainType: 'PLAINS', movementCost: 1, hasResource: null });
    }
  });

  // Verify settlement screen is open
  await expect(page.locator('text=Return to Map')).toBeVisible();

  // Click Return to Map
  await page.click('button:has-text("Return to Map")');

  // Verify settlement screen is closed
  await expect(page.locator('text=Return to Map')).not.toBeVisible();

  // Verify we are back on the map (HUD or something should be visible)
  await expect(page.locator('text=GOLD:')).toBeVisible();
});
