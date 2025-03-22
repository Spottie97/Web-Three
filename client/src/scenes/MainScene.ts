import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  DirectionalLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Color4,
  ArcRotateCamera,
  ShadowGenerator,
  Mesh,
  PointLight,
  Texture,
} from "@babylonjs/core";
import { LoadingManager } from "../utils/LoadingManager";
import { NetworkManager } from "../network/NetworkManager";
import { Player } from "../types/Player";

export class MainScene {
  private engine: Engine;
  private scene: Scene;
  private canvas: HTMLCanvasElement;
  private camera: ArcRotateCamera | null = null;
  private networkManager: NetworkManager;
  private playerMesh: Mesh | null = null;
  private shadowGenerator: ShadowGenerator | null = null;

  constructor(
    engine: Engine,
    canvas: HTMLCanvasElement,
    networkManager: NetworkManager
  ) {
    this.engine = engine;
    this.canvas = canvas;
    this.networkManager = networkManager;
    this.scene = new Scene(this.engine);

    // Set clear color (sky color)
    this.scene.clearColor = new Color4(0.5, 0.8, 1.0, 1.0);
  }

  /**
   * Initialize the scene
   */
  public async initialize(loadingManager: LoadingManager): Promise<void> {
    loadingManager.updateProgress(0.1, "Creating game world...");

    // Set up basic scene elements
    this.setupLights();
    this.setupCamera();

    loadingManager.updateProgress(0.3, "Building terrain...");

    // Create the ground and environment
    this.createGround();

    loadingManager.updateProgress(0.6, "Adding game elements...");

    // Create player character
    this.createPlayer();

    loadingManager.updateProgress(0.9, "Finalizing setup...");

    // Set up input for camera and player controls
    this.setupInputs();

    loadingManager.updateProgress(1.0, "Ready to play!");

    return Promise.resolve();
  }

  /**
   * Get the Babylon.js scene
   */
  public getScene(): Scene {
    return this.scene;
  }

  /**
   * Setup lights for the scene
   */
  private setupLights(): void {
    // Ambient light for general illumination
    const ambientLight = new HemisphericLight(
      "ambientLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.4;
    ambientLight.diffuse = new Color3(1, 1, 1);
    ambientLight.specular = new Color3(0.1, 0.1, 0.1);
    ambientLight.groundColor = new Color3(0.2, 0.2, 0.2);

    // Directional light for sun effect and shadows
    const sunLight = new DirectionalLight(
      "sunLight",
      new Vector3(-1, -2, -1).normalize(),
      this.scene
    );
    sunLight.intensity = 0.8;
    sunLight.diffuse = new Color3(1, 0.95, 0.8);
    sunLight.specular = new Color3(0.3, 0.3, 0.3);

    // Create shadow generator
    this.shadowGenerator = new ShadowGenerator(1024, sunLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.blurScale = 2;
    this.shadowGenerator.setDarkness(0.3);
  }

  /**
   * Setup camera for the scene
   */
  private setupCamera(): void {
    // Create a third-person camera
    this.camera = new ArcRotateCamera(
      "playerCamera",
      -Math.PI / 2, // alpha
      Math.PI / 3, // beta
      10, // radius
      new Vector3(0, 1, 0), // target
      this.scene
    );

    // Attach the camera to the canvas
    this.camera.attachControl(this.canvas, true);

    // Set camera limits
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 20;
    this.camera.lowerBetaLimit = 0.1;
    this.camera.upperBetaLimit = Math.PI / 2;

    // Adjust camera settings
    this.camera.wheelPrecision = 50;
    this.camera.pinchPrecision = 100;
  }

  /**
   * Create ground and terrain
   */
  private createGround(): void {
    // Create a flat ground for the world
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 100, height: 100, subdivisions: 50 },
      this.scene
    );

    // Create a green material for the ground
    const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
    groundMaterial.diffuseColor = new Color3(0.2, 0.8, 0.2);
    groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);

    // Apply the material to the ground
    ground.material = groundMaterial;

    // Make the ground receive shadows
    ground.receiveShadows = true;

    // Add some decorative elements
    this.addEnvironmentElements();
  }

  /**
   * Add decorative elements to the environment
   */
  private addEnvironmentElements(): void {
    // Create several trees
    for (let i = 0; i < 20; i++) {
      const randomX = Math.random() * 80 - 40;
      const randomZ = Math.random() * 80 - 40;

      // Don't place trees at the spawn point
      if (Math.abs(randomX) < 5 && Math.abs(randomZ) < 5) continue;

      // Create a simple tree (trunk + foliage)
      const trunk = MeshBuilder.CreateCylinder(
        `tree_trunk_${i}`,
        { height: 2, diameter: 0.5 },
        this.scene
      );
      trunk.position = new Vector3(randomX, 1, randomZ);

      const foliage = MeshBuilder.CreateSphere(
        `tree_foliage_${i}`,
        { diameter: 3 },
        this.scene
      );
      foliage.position = new Vector3(randomX, 3, randomZ);

      // Create materials
      const trunkMaterial = new StandardMaterial(
        `tree_trunk_material_${i}`,
        this.scene
      );
      trunkMaterial.diffuseColor = new Color3(0.4, 0.3, 0.2);
      trunk.material = trunkMaterial;

      const foliageMaterial = new StandardMaterial(
        `tree_foliage_material_${i}`,
        this.scene
      );
      foliageMaterial.diffuseColor = new Color3(0.1, 0.5, 0.1);
      foliage.material = foliageMaterial;

      // Add to shadow generator
      if (this.shadowGenerator) {
        this.shadowGenerator.addShadowCaster(trunk);
        this.shadowGenerator.addShadowCaster(foliage);
      }
    }

    // Create some rocks
    for (let i = 0; i < 15; i++) {
      const randomX = Math.random() * 90 - 45;
      const randomZ = Math.random() * 90 - 45;
      const randomScale = Math.random() * 0.5 + 0.5;

      const rock = MeshBuilder.CreatePolyhedron(
        `rock_${i}`,
        { type: 1, size: randomScale },
        this.scene
      );
      rock.position = new Vector3(randomX, randomScale / 2, randomZ);

      const rockMaterial = new StandardMaterial(
        `rock_material_${i}`,
        this.scene
      );
      rockMaterial.diffuseColor = new Color3(0.4, 0.4, 0.4);
      rock.material = rockMaterial;

      // Add to shadow generator
      if (this.shadowGenerator) {
        this.shadowGenerator.addShadowCaster(rock);
      }
    }
  }

  /**
   * Create the player character
   */
  private createPlayer(): void {
    // Create a simple player mesh (will be replaced with character models later)
    this.playerMesh = MeshBuilder.CreateBox(
      "player",
      { width: 0.8, height: 1.8, depth: 0.8 },
      this.scene
    );
    this.playerMesh.position = new Vector3(0, 0.9, 0);

    // Create a material for the player
    const playerMaterial = new StandardMaterial("playerMaterial", this.scene);
    playerMaterial.diffuseColor = new Color3(0.2, 0.4, 0.8);
    this.playerMesh.material = playerMaterial;

    // Cast shadows from the player
    if (this.shadowGenerator) {
      this.shadowGenerator.addShadowCaster(this.playerMesh);
    }

    // Follow player with camera
    if (this.camera) {
      this.camera.lockedTarget = this.playerMesh;
    }
  }

  /**
   * Setup input handlers for player control
   */
  private setupInputs(): void {
    // We will implement more advanced controls later
    this.scene.onKeyboardObservable.add((kbInfo) => {
      if (!this.playerMesh) return;

      // Basic WASD movement
      const moveSpeed = 0.1;
      let positionUpdated = false;
      let newPosition = this.playerMesh.position.clone();

      switch (kbInfo.event.key.toLowerCase()) {
        case "w":
          newPosition.z += moveSpeed;
          positionUpdated = true;
          break;
        case "s":
          newPosition.z -= moveSpeed;
          positionUpdated = true;
          break;
        case "a":
          newPosition.x -= moveSpeed;
          positionUpdated = true;
          break;
        case "d":
          newPosition.x += moveSpeed;
          positionUpdated = true;
          break;
      }

      if (positionUpdated) {
        // Update local player position
        this.playerMesh.position = newPosition;

        // Send position update to server
        this.networkManager.sendPlayerMovement(
          {
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
          },
          {
            y: this.playerMesh.rotation.y,
          }
        );
      }
    });
  }
}
