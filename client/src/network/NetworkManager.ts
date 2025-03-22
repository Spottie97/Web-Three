import { Client, Room } from "colyseus.js";
import { GameState } from "../types/GameState";

export class NetworkManager {
  private client: Client;
  private gameRoom: Room<GameState> | null = null;
  private serverUrl: string;
  private roomName: string = "game_room";

  constructor() {
    // Use localhost for development, you'll need to update this for production
    this.serverUrl = import.meta.env.VITE_SERVER_URL || "ws://localhost:2567";
    this.client = new Client(this.serverUrl);
  }

  /**
   * Connect to the Colyseus server
   */
  public async connect(): Promise<void> {
    try {
      console.log(`Connecting to game server at ${this.serverUrl}`);
      this.gameRoom = await this.client.joinOrCreate<GameState>(this.roomName);

      console.log("Connected to game room:", this.gameRoom.id);

      // Set up event listeners
      this.setupEventListeners();

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to connect to game server:", error);
      return Promise.reject(error);
    }
  }

  /**
   * Get the game room instance
   */
  public getRoom(): Room<GameState> | null {
    return this.gameRoom;
  }

  /**
   * Send player movement to the server
   */
  public sendPlayerMovement(
    position: { x: number; y: number; z: number },
    rotation: { y: number }
  ): void {
    if (!this.gameRoom) {
      console.warn("Cannot send movement: not connected to a room");
      return;
    }

    this.gameRoom.send("move", { position, rotation });
  }

  /**
   * Send player action to the server
   */
  public sendPlayerAction(action: string, data?: any): void {
    if (!this.gameRoom) {
      console.warn(`Cannot send action ${action}: not connected to a room`);
      return;
    }

    this.gameRoom.send("action", { action, data });
  }

  /**
   * Setup room event listeners
   */
  private setupEventListeners(): void {
    if (!this.gameRoom) return;

    // State change event
    this.gameRoom.onStateChange.once((state) => {
      console.log("Initial state received:", state);
    });

    // Regular state updates
    this.gameRoom.onStateChange((state) => {
      // Handle state updates
    });

    // Player joined event
    this.gameRoom.state.players.onAdd((player, sessionId) => {
      console.log("Player joined:", sessionId);
      // Handle player join
    });

    // Player left event
    this.gameRoom.state.players.onRemove((player, sessionId) => {
      console.log("Player left:", sessionId);
      // Handle player leave
    });

    // Custom messages
    this.gameRoom.onMessage("*", (type, message) => {
      console.log(`Received message of type ${type}:`, message);
      // Handle different message types
    });

    // Room error event
    this.gameRoom.onError((code, message) => {
      console.error(`Room error (${code}):`, message);
    });

    // Room leave event
    this.gameRoom.onLeave((code) => {
      console.log(`Left room with code ${code}`);
      this.gameRoom = null;
    });
  }
}
