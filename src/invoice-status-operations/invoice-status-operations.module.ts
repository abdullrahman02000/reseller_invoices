import { Module } from '@nestjs/common';
import { InvoiceStatusService } from './invoice-status-operations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { InvoiceReport } from 'src/entities/report.entity';
import { Summary } from 'src/entities/summary.entity';
import { ApprovedInvoiceStatus } from './approved-status.service';
import { PaidInvoiceStatus } from './paid-status.service';
import { IdleInvoiceStatus } from './idle-status.servie';

@Module({
  providers: [
    InvoiceStatusService,
    ApprovedInvoiceStatus,
    PaidInvoiceStatus,
    IdleInvoiceStatus,
  ],
  imports: [TypeOrmModule.forFeature([InvoiceTrack, InvoiceReport, Summary])],
  exports: [
    InvoiceStatusService,
    ApprovedInvoiceStatus,
    PaidInvoiceStatus,
    IdleInvoiceStatus,
  ],
})
export class InvoiceStatusOperationsModule {}
