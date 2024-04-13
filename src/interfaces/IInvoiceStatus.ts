import { FindOptionsWhere, Repository } from 'typeorm';

import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { InvoiceReport } from 'src/entities/report.entity';

export interface IInvoiceStatus {
  trackRecords(startDate: Date, endDate: Date): Promise<InvoiceTrack[]>;
  getReport(
    startDate: Date,
    endDate: Date,
    where?: InvoiceReport,
  ): Promise<InvoiceReport[]>;
}
