import morgan, { StreamOptions } from 'morgan';
import { logger } from '../config/logger';
import { env } from '../config/env';

const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

const skip = (): boolean => env.NODE_ENV === 'test';

const morganMiddleware = morgan(
  env.NODE_ENV === 'production'
    ? 'combined'
    : ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);

export default morganMiddleware;
