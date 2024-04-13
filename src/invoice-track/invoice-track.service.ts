import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { Repository } from 'typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { InvoiceStatus } from 'src/enums/InvoiceStatus';
import { InvoiceStatusService } from 'src/invoice-status-operations/invoice-status-operations.service';

@Injectable()
export class InvoiceTrackService {
  constructor(
    @InjectRepository(InvoiceTrack)
    private invoiceTrackRepository: Repository<InvoiceTrack>,
    private invoiceStatusService: InvoiceStatusService,
  ) {}

  async setInvoiceTrack(invoice: Invoice, status: InvoiceStatus, date?: Date) {
    const track = new InvoiceTrack();
    if (date) {
      track.trackDate = date;
    } else {
      track.trackDate = new Date();
    }
    track.status = status;
    track.invoice = invoice;
    return this.invoiceTrackRepository.insert(track);
  }

  async trackInvoices(status: InvoiceStatus, startDate: Date, endDate: Date) {
    const invoiceStatus = this.invoiceStatusService.getService(status);
    return invoiceStatus.trackRecords(startDate, endDate);
  }
}
