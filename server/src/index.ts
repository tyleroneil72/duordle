import express, { Express } from "express";
import { createServer } from "http";
import { config as dotenvConfig } from "dotenv";
import mongoose from "mongoose";
import { initSocketServer } from "./services/socket";
import roomRouter from "./routes/roomRouter";
import wordRouter from "./routes/wordRouter";
import { errorHandler } from "./middleware/errorHandler";
import limiter from "./middleware/rateLimitMiddleware";
import cors from "cors";
import path from "path";

dotenvConfig();

const app: Express = express();
const httpServer = createServer(app);
const PORT: number = parseInt(process.env.PORT || "3000", 10);
const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";
const MONGO_URI: string = process.env.MONGO_URI || "";

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use("/api/room", limiter);
app.use("/api/word", limiter);
app.use("/api/room", roomRouter);
app.use("/api/word", wordRouter);

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

initSocketServer(httpServer);
app.use(errorHandler);

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
})();
