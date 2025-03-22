import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import path from "path";
import { monitor } from "@colyseus/monitor";
import { GameRoom } from "./rooms/GameRoom";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT || 2567);
const app = express();

// Apply CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Serve static files from client build directory in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  // Handle SPA routing by returning the index.html for all non-API routes
  app.get("*", (req, res, next) => {
    if (req.url.startsWith("/api") || req.url.startsWith("/colyseus")) {
      next();
    } else {
      res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
    }
  });
}

// Create HTTP server
const httpServer = createServer(app);

// Create Colyseus server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
  }),
});

// Register game rooms
gameServer.define("game_room", GameRoom);

// Register Colyseus Monitor (admin interface)
if (process.env.NODE_ENV !== "production") {
  app.use("/colyseus", monitor());
}

// Start server
gameServer
  .listen(port)
  .then(() => {
    console.log(`
🎮 Realm of Eldoria server is running!
📡 Listening on ws://localhost:${port}
🌐 Monitor available at http://localhost:${port}/colyseus
  `);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
