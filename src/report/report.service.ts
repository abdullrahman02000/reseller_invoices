import { IInvoiceStatus } from 'src/interfaces/IInvoiceStatus';
import { InvoiceStatus } from 'src/enums/InvoiceStatus';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { InvoiceReport } from 'src/entities/report.entity';
import { InvoiceStatusService } from 'src/invoice-status-operations/invoice-status-operations.service';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(InvoiceReport)
    private reportRepository: Repository<InvoiceReport>,
    @InjectRepository(InvoiceTrack)
    private invoiceTrackRepository: Repository<InvoiceTrack>,
    private invoiceStatusServie: InvoiceStatusService,
  ) {}

  async getReport(
    statusType: InvoiceStatus = InvoiceStatus.Idle,
    startDate: Date,
    endDate: Date,
    where?: InvoiceReport,
  ): Promise<InvoiceReport[]> {
    const invoiceStatus: IInvoiceStatus =
      this.invoiceStatusServie.getService(statusType);
    if (invoiceStatus) {
      const reports = await invoiceStatus.getReport(startDate, endDate, where);
      return reports;
    }
  }
  async getReportAsCSV(
    statusType: InvoiceStatus,
    startDate: Date,
    endDate: Date,
    where?: InvoiceReport,
  ) {
    const reports = await this.getReport(statusType, startDate, endDate, where);
    let stringBuilder =
      [
        `"Invoice ID"`,
        `"Total Price"`,
        `"Username"`,
        `"User Role"`,
        `"Created At"`,
        `"Paid At"`,
        `"Approved At"`,
      ].join(';') + '\r\n';
    for (const report of reports) {
      stringBuilder +=
        [
          `"${report.invoiceId}"`,
          `"${report.totalPrice}"`,
          `"${report.username}"`,
          `"${report.userType}"`,
          `"${report.createdAt?.toISOString() ?? ''}"`,
          `"${report.paidAt?.toISOString() ?? ''}"`,
          `"${report.approvedAt?.toISOString() ?? ''}"`,
        ].join(';') + '\r\n';
    }
    return stringBuilder;
  }
}
