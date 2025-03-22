import { Schema, ArraySchema, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";

// This interface represents the state structure managed by Colyseus
export interface GameState {
  // Map of players by sessionId
  players: MapSchema<Player>;

  // Game world time
  worldTime: number;

  // Other global game state properties
  gameMode: string;
  weatherType: string;

  // NPC positions, enemy states, etc. can be added here
}
