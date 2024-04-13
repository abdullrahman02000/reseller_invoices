import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceReport } from 'src/entities/report.entity';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { InvoiceTrackService } from 'src/invoice-track/invoice-track.service';
import { Summary } from 'src/entities/summary.entity';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { AuthModule } from 'src/auth/auth.module';
import { InvoiceStatusOperationsModule } from 'src/invoice-status-operations/invoice-status-operations.module';

@Module({
  providers: [ReportService, InvoiceTrackService],
  controllers: [ReportController],
  imports: [
    TypeOrmModule.forFeature([InvoiceReport, InvoiceTrack, Summary]),
    AuditLogModule,
    AuthModule,
    InvoiceStatusOperationsModule,
  ],
})
export class ReportModule {}
