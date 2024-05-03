import { StatusCodes } from "http-status-codes";

const apiKeyMiddleware = (req: any, res: any, next: any) => {
  const userApiKey = req.headers["x-api-key"];
  if (userApiKey && userApiKey === process.env.API_KEY) {
    next();
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
};
export { apiKeyMiddleware };
