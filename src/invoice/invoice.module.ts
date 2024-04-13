import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { InvoiceReport } from 'src/entities/report.entity';
import { InvoiceStatusOperationsModule } from 'src/invoice-status-operations/invoice-status-operations.module';
import { InvoiceTrackModule } from 'src/invoice-track/invoice-track.module';
import { GuardRequirementsModule } from 'src/guards/requirements.module';
import { Receipt } from 'src/entities/receipt.entity';
import { Reseller } from 'src/entities/reseller.entity';
@Module({
  providers: [InvoiceService],
  controllers: [InvoiceController],
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceTrack,
      Receipt,
      Reseller,
      InvoiceReport,
    ]),
    InvoiceTrackModule,
    InvoiceStatusOperationsModule,
    GuardRequirementsModule,
    InvoiceTrackModule,
  ],
  exports: [InvoiceService],
})
export class InvoiceModule {}
