import { Injectable } from '@nestjs/common';
import { InvoiceReport } from 'src/entities/report.entity';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { InvoiceStatus } from 'src/enums/InvoiceStatus';
import {
  Between,
  FindOptionsWhere,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Summary } from 'src/entities/summary.entity';
import { IInvoiceStatus } from 'src/interfaces/IInvoiceStatus';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApprovedInvoiceStatus implements IInvoiceStatus {
  constructor(
    @InjectRepository(InvoiceReport)
    protected invoiceReportRepository: Repository<InvoiceReport>,
    @InjectRepository(InvoiceTrack)
    protected invoiceTrackRepository: Repository<InvoiceTrack>,
    @InjectRepository(Summary) protected summaryRepository: Repository<Summary>,
  ) {}
  async trackRecords(startDate: Date, endDate: Date): Promise<InvoiceTrack[]> {
    const invoiceTracks: InvoiceTrack[] =
      await this.invoiceTrackRepository.find({
        where: {
          status: InvoiceStatus.Approved,
          trackDate: Between(startDate, endDate),
        },
      });
    return invoiceTracks;
  }
  async getReport(
    startDate: Date,
    endDate: Date,
    where?: FindOptionsWhere<InvoiceReport>,
  ): Promise<InvoiceReport[]> {
    if (!startDate || startDate == null || !endDate || endDate == null) {
      const summary: Summary = await this.summaryRepository.findOne({
        where: {
          createdAtCount: MoreThanOrEqual(0),
        },
      });
      if (!startDate || startDate == null) {
        startDate = summary.minApprovedAt;
      }
      if (!endDate || endDate == null) {
        endDate = summary.maxApprovedAt;
      }
    }
    return await this.invoiceReportRepository.find({
      where: { ...where, approvedAt: Between(startDate, endDate) },
    });
  }
}
