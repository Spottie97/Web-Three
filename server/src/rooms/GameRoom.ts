import { Room, Client } from "colyseus";
import { GameState } from "../schema/GameState";
import { Player } from "../schema/Player";

export class GameRoom extends Room<GameState> {
  // Maximum number of clients allowed in the room
  maxClients = 50;

  // World update interval (milliseconds)
  private tickRate = 100; // 10 updates per second
  private tickInterval: NodeJS.Timeout | null = null;

  // Create room
  onCreate(options: any) {
    this.setState(new GameState());

    console.log("Game room created!", options);

    // Set up the server-side game loop
    this.tickInterval = setInterval(() => this.tick(), this.tickRate);

    // Set up message handlers
    this.registerMessageHandlers();
  }

  // When a client joins the room
  onJoin(client: Client, options: any) {
    console.log(`Client ${client.sessionId} joined the room`);

    // Create a new player
    const player = new Player(client.sessionId, options.username);

    // Set random spawn position
    this.setRandomSpawnPosition(player);

    // Add the player to the game state
    this.state.players.set(client.sessionId, player);

    // Broadcast player joined message
    this.broadcast(
      "player-joined",
      {
        id: client.sessionId,
        username: player.username,
      },
      { except: client }
    );
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    console.log(`Client ${client.sessionId} left the room`);

    // Remove the player from the game state
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);

      // Broadcast player left message
      this.broadcast("player-left", {
        id: client.sessionId,
      });
    }
  }

  // When the room is disposed (no more clients)
  onDispose() {
    console.log("Game room disposed");

    // Clear the game loop interval
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  // Server-side game loop
  private tick() {
    // Update world time
    this.state.worldTime = Date.now();
  }

  // Register message handlers
  private registerMessageHandlers() {
    // Handle player movement
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);

      if (!player) return;

      // Update player position and rotation
      if (data.position) {
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        player.position.z = data.position.z;
      }

      if (data.rotation) {
        player.rotation.y = data.rotation.y;
      }

      // Update timestamp for interpolation
      player.timestamp = Date.now();
      player.isMoving = true;
    });
  }

  // Set a random spawn position for a player
  private setRandomSpawnPosition(player: Player) {
    // Generate a random position within a spawn area
    const radius = 5;
    const angle = Math.random() * Math.PI * 2;

    player.position.x = Math.cos(angle) * radius;
    player.position.z = Math.sin(angle) * radius;
    player.position.y = 0;
  }
}
