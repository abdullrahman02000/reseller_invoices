import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { AuthService } from 'src/auth/auth.service';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { Receipt } from 'src/entities/receipt.entity';
import { Reseller } from 'src/entities/reseller.entity';
import { AuthGuard } from 'src/guards/AuthGuard';
import { SupervisorGuard } from 'src/guards/SupervisorGuard';
import { Repository } from 'typeorm';
import { InvoiceService } from './invoice.service';
@Controller('invoice')
export class InvoiceController {
  constructor(
    private invoiceService: InvoiceService,
    private authService: AuthService,
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceTrack)
    private invoiceTrackRepository: Repository<InvoiceTrack>,
    @InjectRepository(Receipt) private receiptRepository: Repository<Receipt>,
    private audit: AuditLogService,
    @InjectRepository(Reseller)
    private resellerRepository: Repository<Reseller>,
  ) {}

  @Put()
  async createInvoices(@Body() invoices: Invoice[], @Req() request: Request) {
    const reseller = await this.authService.verifyReseller(request);
    if (reseller) {
      for (const invoice of invoices) {
        if (
          invoice.reseller == undefined ||
          invoice.reseller.id != reseller.id
        ) {
          throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
      }
      return await this.invoiceService.createInvoices(invoices);
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @UseGuards(SupervisorGuard)
  @Post('pay')
  async payInvoices(@Body() invoices: Invoice[]) {
    return await Promise.all(
      invoices.map((invoice) => {
        return this.invoiceService.payInvoice(invoice);
      }),
    );
  }

  @UseGuards(SupervisorGuard)
  @Post('approve')
  async approveInvoices(@Body() invoices: Invoice[]) {
    return await Promise.all(
      invoices.map((invoice) => {
        return this.invoiceService.approveInvoice(invoice);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Body() invoices: Invoice[]) {
    for (const invoice of invoices) {
      const receipts = await this.receiptRepository.findBy({
        invoice: { id: invoice.id },
      });
      if (receipts) {
        await this.receiptRepository.remove(receipts);
      }
      const tracks = await this.invoiceTrackRepository.findBy({
        invoice: { id: invoice.id },
      });
      if (tracks) {
        await this.invoiceTrackRepository.remove(tracks);
      }
    }
    return await this.invoiceRepository.remove(invoices);
  }

  @UseGuards(AuthGuard)
  @Get()
  async get(
    @Query('resellerId') resellerId?: string,
    @Query('where') where?: string,
  ): Promise<Invoice[]> {
    this.audit.log({
      message: `Getting invoice with reseller id ${JSON.stringify(resellerId)} & where=${where}`,
    });
    let whereClause = {};
    try {
      whereClause = JSON.parse(where);
    } catch (e) {}
    return await this.invoiceRepository.find({
      relations: {
        tracks: true,
        reseller: true,
      },
      select: {
        tracks: true,
        reseller: {
          id: true,
          username: true,
        },
      },
      where: {
        ...whereClause,
        reseller: { id: resellerId ? Number(resellerId) : undefined },
      },
    });
  }

  @UseGuards(AuthGuard)
  @Get('one')
  async getOne(@Query('id', ParseIntPipe) id: number) {
    return await this.invoiceRepository.findOne({
      relations: {
        tracks: true,
      },
      where: {
        id: Number(id),
      },
    });
  }
}
