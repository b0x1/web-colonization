import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { useGameStore, selectAvailableUnitsCount } from '@client/game/state/gameStore';
import { useUIStore } from '@client/game/state/uiStore';
import { eventBus } from '@client/game/state/EventBus';
import { LazyRenderController } from '@client/game/rendering/LazyRenderController';
import { MainMenuScene } from '@client/scenes/MainMenuScene';
import { WorldScene } from '@client/scenes/WorldScene';
import { CombatResultToast } from '@client/ui/CombatResultToast';
import { EndTurnConfirmationModal } from '@client/ui/EndTurnConfirmationModal';
import { EuropeScreen } from '@client/ui/EuropeScreen/EuropeScreen';
import { FieldPanel } from '@client/ui/FieldPanel';
import { ForeignInteractionModal } from '@client/ui/ForeignInteractionModal/ForeignInteractionModal';
import { ForeignSettlementModal } from '@client/ui/ForeignSettlementModal';
import { HUD } from '@client/ui/HUD';
import { GameSetupModal } from '@client/ui/MainMenu/GameSetupModal';
import { HowToPlayModal } from '@client/ui/MainMenu/HowToPlayModal';
import { MainMenu } from '@client/ui/MainMenu/MainMenu';
import { MiniMap } from '@client/ui/MiniMap';
import { NotificationToast } from '@client/ui/NotificationToast';
import { ReportsModal } from '@client/ui/ReportsModal';
import { SaveLoadModal } from '@client/ui/SaveLoadModal';
import { SettlementScreen } from '@client/ui/SettlementScreen/SettlementScreen';
import { UnitPanel } from '@client/ui/UnitPanel';
import type { Tile } from '@shared/game/entities/Tile';

function App(): React.ReactElement {
  const gameRef = useRef<Phaser.Game | null>(null);
  const lazyRenderControllerRef = useRef<LazyRenderController | null>(null);
  const { selectUnit, selectSettlement, endTurn } = useGameStore();
  const {
    showEndTurnConfirm,
    setShowEndTurnConfirm
  } = useUIStore();

  const availableUnitsCount = useGameStore(selectAvailableUnitsCount);

  useEffect(() => {
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      scene: [MainMenuScene, WorldScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    const lazyRenderController = new LazyRenderController(game);
    lazyRenderController.bind();
    lazyRenderControllerRef.current = lazyRenderController;
    const unsubscribeRender = useGameStore.subscribe(() => {
      lazyRenderController.requestRender();
    });

    return () => {
      unsubscribeRender();
      lazyRenderControllerRef.current?.destroy();
      lazyRenderControllerRef.current = null;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribeUnitSelected = eventBus.on('unitSelected', (unitId) => {
      selectUnit(unitId);
    });
    const unsubscribeSettlementSelected = eventBus.on('settlementSelected', (settlementId) => {
      selectSettlement(settlementId);
    });
    const unsubscribeTileSelected = eventBus.on('tileSelected', (position) => {
      const tile: Tile | null = position
        ? useGameStore.getState().map[position.y]?.[position.x] ?? null
        : null;
      useGameStore.getState().selectTile(tile);
    });
    const unsubscribeCombatRequested = eventBus.on('combatRequested', (target) => {
      const selectedUnitId = useGameStore.getState().selectedUnitId;
      if (!selectedUnitId) {
        return;
      }

      useGameStore.getState().resolveCombat(selectedUnitId, target);
    });
    const unsubscribeMoveRequested = eventBus.on('moveUnitRequested', ({ id, to }) => {
      useGameStore.getState().moveUnit(id, to);
    });
    const unsubscribeTradeRequested = eventBus.on('nativeTradeRequested', (settlementId) => {
      useUIStore.getState().setNativeTradeModalOpen(true, settlementId);
    });

    return () => {
      unsubscribeUnitSelected();
      unsubscribeSettlementSelected();
      unsubscribeTileSelected();
      unsubscribeCombatRequested();
      unsubscribeMoveRequested();
      unsubscribeTradeRequested();
    };
  }, [selectSettlement, selectUnit]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div id="game-container" className="w-full h-full"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <HUD />
        <FieldPanel />
        <UnitPanel />
        <MiniMap />
        <SettlementScreen />
        <ForeignSettlementModal />
        <EuropeScreen />
        <ForeignInteractionModal />
        <CombatResultToast />
        <SaveLoadModal />
        <ReportsModal />
        <NotificationToast />
        <MainMenu />
        <HowToPlayModal />
        <GameSetupModal />

        {showEndTurnConfirm && (
          <EndTurnConfirmationModal
            remainingUnits={availableUnitsCount}
            onConfirm={() => {
              setShowEndTurnConfirm(false);
              endTurn();
            }}
            onCancel={() => { setShowEndTurnConfirm(false); }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
