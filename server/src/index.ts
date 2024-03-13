import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
