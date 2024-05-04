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

dotenvConfig();

const app: Express = express();
const httpServer = createServer(app);
const PORT: number = parseInt(process.env.PORT || "3000", 10);
const MONGO_URI: string = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors());
app.use("/room", limiter);
app.use("/word", limiter);
app.use("/room", roomRouter);
app.use("/word", wordRouter);
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
