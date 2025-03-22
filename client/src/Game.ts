import { Engine, Scene, SceneLoader } from "@babylonjs/core";
import { Client } from "colyseus.js";
import { LoadingManager } from "./utils/LoadingManager";
import { MainScene } from "./scenes/MainScene";
import { NetworkManager } from "./network/NetworkManager";

export class Game {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private currentScene: Scene | null = null;
  private loadingManager: LoadingManager;
  private networkManager: NetworkManager;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Initialize the Babylon.js engine
    this.engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
      powerPreference: "high-performance",
    });

    // Initialize loading manager
    this.loadingManager = new LoadingManager();

    // Initialize network manager (connecting to Colyseus server)
    this.networkManager = new NetworkManager();
  }

  /**
   * Start the game
   */
  public async start(): Promise<void> {
    // Connect to the Colyseus server
    await this.networkManager.connect();

    // Create the main scene
    await this.createMainScene();

    // Start the render loop
    this.engine.runRenderLoop(() => {
      if (this.currentScene) {
        this.currentScene.render();
      }
    });
  }

  /**
   * Resize the game canvas
   */
  public resize(): void {
    this.engine.resize();
  }

  /**
   * Create and load the main game scene
   */
  private async createMainScene(): Promise<void> {
    // Show loading screen
    this.loadingManager.showLoadingScreen();

    try {
      // Create a new main scene
      const mainScene = new MainScene(
        this.engine,
        this.canvas,
        this.networkManager
      );

      // Initialize the scene
      await mainScene.initialize(this.loadingManager);

      // Set as current scene
      this.currentScene = mainScene.getScene();

      // Hide loading screen when complete
      this.loadingManager.hideLoadingScreen();
    } catch (error) {
      console.error("Error creating main scene:", error);
      this.loadingManager.showLoadingError(
        "Failed to load game scene. Please refresh the page."
      );
    }
  }
}
