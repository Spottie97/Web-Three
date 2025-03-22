# Realm of Eldoria

A web-based 3D multiplayer MMORPG set in a medieval fantasy world, built with Babylon.js and Colyseus.

## Features

- 3D world with medieval fantasy environments
- Character creation and customization
- Combat system (melee and magic)
- Quest system with NPCs
- Item and inventory management
- Multiplayer interactions (chat, trading, combat)
- Player progression system

## Technology Stack

- **Frontend**: Babylon.js for 3D rendering and game mechanics
- **Multiplayer**: Colyseus for real-time multiplayer functionality
- **Backend**: Node.js for server-side logic
- **Database**: MongoDB for data persistence

## Project Structure

```
realm-of-eldoria/
├── client/                 # Frontend application
│   ├── src/                # Source code
│   │   ├── assets/         # Game assets (3D models, textures, etc.)
│   │   ├── characters/     # Character-related code
│   │   ├── scenes/         # Game scenes and levels
│   │   ├── ui/             # User interface components
│   │   └── ...
│   └── ...
├── server/                 # Backend application
│   ├── src/                # Source code
│   │   ├── rooms/          # Colyseus room definitions
│   │   ├── entities/       # Game entities
│   │   ├── services/       # Game services
│   │   └── ...
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (optional, for persistent data)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/realm-of-eldoria.git
cd realm-of-eldoria
```

2. Install dependencies:

```bash
npm run install:all
```

### Development

1. Start the development server:

```bash
npm run dev
```

This will start both the client and server in development mode with hot reloading.

- Client runs on: http://localhost:3000
- Server runs on: ws://localhost:2567
- Colyseus monitor: http://localhost:2567/colyseus

### Building for Production

```bash
npm run build
```

### Running in Production

```bash
npm start
```

## Game Features Implementation

### Stage 1: Project Setup and Basic Environment ✅

- Set up the Babylon.js and Colyseus boilerplate
- Create a basic 3D environment with terrain
- Implement basic camera controls and character movement

### Stage 2: Core Game Mechanics (In Progress)

- Character creation system
- Basic combat mechanics
- NPC interaction framework
- Item and inventory system

### Stage 3: Multiplayer Functionality (Planned)

- Player synchronization across clients
- Real-time player movement and actions
- Chat system
- Server-side game state management

### Stage 4: Game Content (Planned)

- Quest implementation
- World expansion with multiple areas
- Enemy AI and combat balancing
- Economy system

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
