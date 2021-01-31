import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { existsSync } from 'fs';

const logger = new Logger('AppConfig');
const loadDotEnv = (path: string): boolean => {
  if (!existsSync(path)) {
    logger.debug(`Skip parsing ${path}, File not found.`);
    return false;
  }
  // else
  logger.debug(`Using ${path} to supply config environment variables`);
  const dotenvResult = config({ path });
  logger.debug(`${path} parsed: ${JSON.stringify(dotenvResult.parsed)}`);
  if (dotenvResult.error) {
    logger.debug(`${path} error: ${JSON.stringify(dotenvResult.error)}`);
    return false;
  }
  // else
  return true;
};

// tslint:disable-next-line: no-unused-expression
loadDotEnv('.env') || loadDotEnv('.env.example');
