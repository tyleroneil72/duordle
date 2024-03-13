import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app: express.Application = express();
app.use(cors());
const port: number = Number(process.env.PORT) || 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
