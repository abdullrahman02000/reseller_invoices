import { Module } from '@nestjs/common';
import { InvoiceTrackService } from './invoice-track.service';
import { InvoiceTrackController } from './invoice-track.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { InvoiceReport } from 'src/entities/report.entity';
import { InvoiceStatusOperationsModule } from 'src/invoice-status-operations/invoice-status-operations.module';

@Module({
  providers: [InvoiceTrackService],
  controllers: [InvoiceTrackController],
  imports: [
    TypeOrmModule.forFeature([InvoiceTrack, InvoiceReport]),
    InvoiceStatusOperationsModule,
  ],
  exports: [InvoiceTrackService],
})
export class InvoiceTrackModule {}
