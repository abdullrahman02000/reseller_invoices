import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { ConfigSourceProvider } from 'src/config-source/ConfigSourceProvider';

@Module({
  providers: [AuditLogService, ConfigSourceProvider],
  exports: [AuditLogService],
})
export class AuditLogModule {}
