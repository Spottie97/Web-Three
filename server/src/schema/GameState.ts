import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "./Player";

export class GameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type("number")
  worldTime: number = 0;

  @type("string")
  gameMode: string = "adventure";

  @type("string")
  weatherType: string = "sunny";

  constructor() {
    super();

    // Initialize with default values
    this.worldTime = Date.now();
    this.gameMode = "adventure";
    this.weatherType = "sunny";
  }
}
