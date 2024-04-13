import { Controller, Get, Header, Query, UseGuards } from '@nestjs/common';
import { InvoiceStatus } from 'src/enums/InvoiceStatus';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/guards/AuthGuard';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Controller('report')
export class ReportController {
  constructor(
    private reportService: ReportService,
    @InjectRepository(Summary) private summaryRepository: Repository<Summary>,
    private audit: AuditLogService,
  ) {}

  withWhere(where: string) {
    let whereClause = undefined;
    if (where) {
      try {
        whereClause = JSON.parse(where);
      } catch (e) {}
    }
    return whereClause;
  }
  @UseGuards(AuthGuard)
  @Get()
  get(
    @Query('status') status: InvoiceStatus,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('where') where?: string,
  ) {
    this.audit.log({ message: `GET Report, where=${where}` });
    return this.reportService.getReport(
      status,
      startDate,
      endDate,
      this.withWhere(where),
    );
  }

  @UseGuards(AuthGuard)
  @Get('getCSV')
  @Header('Content-Disposition', 'attachment; filename="report.csv"')
  @Header('Content-Type', 'text/csv')
  getCSV(
    @Query('status') status: InvoiceStatus,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('where') where?: string,
  ) {
    return this.reportService.getReportAsCSV(
      status,
      startDate,
      endDate,
      this.withWhere(where),
    );
  }

  @UseGuards(AuthGuard)
  @Get('summary')
  async summary() {
    const summary = await this.summaryRepository.findOne({
      where: {
        createdAtCount: MoreThanOrEqual(0),
      },
    });
    if (summary.minCreatedAt) {
      summary.minCreatedAt.setHours(summary.minCreatedAt.getHours() - 24);
    }
    if (summary.maxCreatedAt) {
      summary.maxCreatedAt.setHours(summary.maxCreatedAt.getHours() + 24);
    }
    if (summary.minPaidAt) {
      summary.minPaidAt.setHours(summary.minPaidAt.getHours() - 24);
    }
    if (summary.maxPaidAt) {
      summary.maxPaidAt.setHours(summary.maxPaidAt.getHours() + 24);
    }
    if (summary.minApprovedAt) {
      summary.minApprovedAt.setHours(summary.minApprovedAt.getHours() - 24);
    }
    if (summary.maxApprovedAt) {
      summary.maxApprovedAt.setHours(summary.maxApprovedAt.getMinutes() + 24);
    }
    return summary;
  }
}
