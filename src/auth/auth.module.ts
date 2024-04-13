import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reseller } from 'src/entities/reseller.entity';

@Module({
  providers: [AuthService],
  imports: [AuditLogModule, TypeOrmModule.forFeature([Reseller])],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
