import { Injectable } from '@nestjs/common';
import { ConfigSourceProvider } from 'src/config-source/ConfigSourceProvider';

@Injectable()
export class AuditLogService {
  constructor() {
    const configSource = ConfigSourceProvider.instance;
    console.log(`[${new Date().toISOString()}] Starting Audit Logging Service`);
    const constantsNames = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_NAME'];
    for (const constantName of constantsNames) {
      console.log(
        `[${new Date().toISOString()}] ${constantName} = ${configSource.get(constantName)}`,
      );
    }
  }

  log({ message }: { message: any }) {
    console.log(`${new Date().toISOString()}: ${JSON.stringify(message)}`);
  }
}
