import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceStatus } from 'src/enums/InvoiceStatus';
import { InvoiceTrackService } from 'src/invoice-track/invoice-track.service';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    private invoiceTrackService: InvoiceTrackService,
    private audit: AuditLogService,
  ) {}

  async createInvoices(invoices: Invoice[]) {
    this.audit.log({ message: 'Creating Invoices' });
    const result = await this.invoicesRepository.insert(invoices);
    for (const invoice of result.identifiers) {
      this.audit.log({ message: `Set new invoice track for ${invoice.id}` });
      await this.invoiceTrackService.setInvoiceTrack(
        { id: invoice.id } as Invoice,
        InvoiceStatus.Idle,
      );
    }
    const createdInvoices = await this.invoicesRepository.find({
      relations: {
        reseller: true,
        tracks: true,
      },
      select: {
        reseller: {
          id: true,
          username: true,
        },
        tracks: true,
      },
      where: result.identifiers,
    });
    return createdInvoices;
  }

  async payInvoice(invoice: Invoice) {
    const dbInvoice: Invoice = await this.invoicesRepository.findOne({
      relations: {
        tracks: true,
      },
      where: {
        id: invoice.id,
      },
    });
    if (dbInvoice) {
      const { idle, paid, approved } = this.extractTracks(dbInvoice);
      if (idle == undefined) {
        this.invoiceTrackService.setInvoiceTrack(
          dbInvoice,
          InvoiceStatus.Idle,
          this.closestCreationDate({ paid, approved }),
        );
      }
      if (paid == undefined) {
        await this.invoiceTrackService.setInvoiceTrack(
          dbInvoice,
          InvoiceStatus.Paid,
        );
      }
    }
    return await this.invoicesRepository.findOne({
      relations: {
        tracks: true,
        reseller: true,
      },
      where: {
        id: invoice.id,
      },
    });
  }

  async approveInvoice(invoice: Invoice) {
    const dbInvoice: Invoice = await this.invoicesRepository.findOne({
      relations: {
        tracks: true,
      },
      where: {
        id: invoice.id,
      },
    });
    if (dbInvoice) {
      const { idle, paid, approved } = this.extractTracks(dbInvoice);
      if (idle == undefined) {
        this.invoiceTrackService.setInvoiceTrack(
          dbInvoice,
          InvoiceStatus.Idle,
          this.closestCreationDate({ paid, approved }),
        );
      }
      if (paid != undefined && approved == undefined) {
        await this.invoiceTrackService.setInvoiceTrack(
          dbInvoice,
          InvoiceStatus.Approved,
        );
      }
    }
    return await this.invoicesRepository.findOne({
      relations: {
        tracks: true,
        reseller: true,
      },
      where: {
        id: invoice.id,
      },
    });
  }

  extractTracks(invoice: Invoice) {
    let idle = undefined;
    let paid = undefined;
    let approved = undefined;
    for (const track of invoice.tracks) {
      switch (track.status) {
        case InvoiceStatus.Approved:
          approved = track;
          break;
        case InvoiceStatus.Idle:
          idle = track;
          break;
        case InvoiceStatus.Paid:
          paid = track;
          break;
      }
    }
    return { idle, paid, approved };
  }

  closestCreationDate({
    paid,
    approved,
  }: {
    paid: InvoiceTrack;
    approved: InvoiceTrack;
  }) {
    let date = new Date();
    if (paid) {
      date = paid.trackDate;
      date.setSeconds(date.getSeconds() - 10);
    } else if (approved) {
      date = approved.trackDate;
      date.setSeconds(date.getSeconds() - 10);
    }
    return date;
  }
}
