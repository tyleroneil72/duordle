import rateLimit from 'express-rate-limit';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 requests per windowMs
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: JSON.stringify({
    message: ReasonPhrases.TOO_MANY_REQUESTS
  }),
  headers: true, // Include rate limit headers in the response
  handler: (req, res) => {
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      message: ReasonPhrases.TOO_MANY_REQUESTS
    });
  },
  keyGenerator: (req) => {
    return req.ip || 'unknown-ip';
  }
});

export default limiter;
