import React from "react";
import { CarProgressMap } from "./CarProgressMap";
import { Mission } from "../types";

interface AICompanionProps {
  mission: Mission;
  currentHintLevel: number;
  onAdvanceHint: () => void;
  playerCode?: string;
  errorMessage?: string;
}

export const AICompanion: React.FC<AICompanionProps> = ({
  mission,
  currentHintLevel,
  onAdvanceHint,
  playerCode,
  errorMessage,
}) => {
  return (
    <CarProgressMap
      currentMission={mission}
      currentHintLevel={currentHintLevel}
      onAdvanceHint={onAdvanceHint}
      playerCode={playerCode}
      errorMessage={errorMessage}
    />
  );
};

