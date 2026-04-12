import React, { useEffect, useMemo } from 'react';
import { useGameStore, selectCurrentPlayer, selectSettlementById, selectSettlementOwner, selectSettlementProduction, selectUnitsAtSettlement } from '../../game/state/gameStore';
import { useUIStore } from '../../game/state/uiStore';
import { useShallow } from 'zustand/react/shallow';
import { SettlementScreenView } from './SettlementScreenView';

export const SettlementScreenContainer: React.FC = () => {
  const { selectedSettlementId, players, currentPlayerId, map, selectSettlement } = useGameStore();
  const { isSettlementScreenOpen, setSettlementScreenOpen } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSettlementScreenOpen && e.key === 'Escape') {
        e.preventDefault();
        setSettlementScreenOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [isSettlementScreenOpen, setSettlementScreenOpen]);

  const handleClose = () => {
    setSettlementScreenOpen(false);
    selectSettlement(null);
  };

  const data = useMemo(() => {
    if (!isSettlementScreenOpen || !selectedSettlementId) return null;

    const player = useGameStore(selectCurrentPlayer);
    const settlement = useGameStore(state => selectSettlementById(state, selectedSettlementId));
    const settlementOwner = useGameStore(state => selectSettlementOwner(state, selectedSettlementId));
    const production = useGameStore(useShallow(state => selectedSettlementId ? selectSettlementProduction(state, selectedSettlementId) : undefined));
    const unitsAtSettlement = useGameStore(useShallow(state => selectedSettlementId ? selectUnitsAtSettlement(state, selectedSettlementId) : []));
  
    if (!player || !settlement || !settlementOwner || !production || !unitsAtSettlement) return null;

    const isReadOnly = settlement.ownerId !== player.id;
    const { hammersProduced, netProduction } = production;
  
    return {
      settlement,
      player,
      settlementOwner,
      isReadOnly,
      hammersProduced,
      unitsAtSettlement,
      netProduction
    };
  }, [isSettlementScreenOpen, selectedSettlementId, players, currentPlayerId, map]);

  if (!data) return null;

  return (
    <SettlementScreenView
      {...data}
      onClose={handleClose}
    />
  );
};
