// This interface represents a player in the game
export interface Player {
  // Player identity
  id: string;
  username: string;

  // Position and rotation
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    y: number;
  };

  // Player stats
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  level: number;
  experience: number;

  // Character appearance
  characterType: string;
  equipmentIds: string[];

  // Player state
  isMoving: boolean;
  currentAction: string | null;

  // Timestamp of last update (for interpolation)
  timestamp: number;
}
