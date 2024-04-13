import { Module } from '@nestjs/common';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuditLogModule, AuthModule],
  exports: [AuthModule, AuditLogModule],
})
export class GuardRequirementsModule {}
