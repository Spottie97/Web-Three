import { Schema, type, ArraySchema } from "@colyseus/schema";

export class Position extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  z: number = 0;
}

export class Rotation extends Schema {
  @type("number")
  y: number = 0;
}

export class Player extends Schema {
  // Player identity
  @type("string")
  id: string = "";

  @type("string")
  username: string = "";

  // Position and rotation
  @type(Position)
  position = new Position();

  @type(Rotation)
  rotation = new Rotation();

  // Player stats
  @type("number")
  health: number = 100;

  @type("number")
  maxHealth: number = 100;

  @type("number")
  mana: number = 100;

  @type("number")
  maxMana: number = 100;

  @type("number")
  level: number = 1;

  @type("number")
  experience: number = 0;

  // Character appearance
  @type("string")
  characterType: string = "warrior";

  @type(["string"])
  equipmentIds = new ArraySchema<string>();

  // Player state
  @type("boolean")
  isMoving: boolean = false;

  @type("string")
  currentAction: string = "";

  // Timestamp of last update (for interpolation)
  @type("number")
  timestamp: number = 0;

  constructor(id: string = "", username: string = "") {
    super();

    this.id = id;
    this.username = username || `Player${Math.floor(Math.random() * 1000)}`;

    // Set initial position
    this.position.x = 0;
    this.position.y = 0;
    this.position.z = 0;

    // Set initial rotation
    this.rotation.y = 0;

    // Set timestamp
    this.timestamp = Date.now();
  }
}
