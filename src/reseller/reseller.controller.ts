import { AuthService } from './../auth/auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { Receipt } from 'src/entities/receipt.entity';
import { Reseller } from 'src/entities/reseller.entity';
import { AuthGuard } from 'src/guards/AuthGuard';
import { SupervisorGuard } from 'src/guards/SupervisorGuard';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { ResellerValidation } from 'src/pipes/ResellerValidation';

@Controller('reseller')
export class ResellerController {
  constructor(
    @InjectRepository(Reseller) private repository: Repository<Reseller>,
    @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
    @InjectRepository(InvoiceTrack)
    private invoiceTrackRepository: Repository<InvoiceTrack>,
    @InjectRepository(Receipt) private receiptRepository: Repository<Receipt>,
    private authService: AuthService,
    private audit: AuditLogService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(@Query('id') id?: number) {
    this.audit.log({ message: 'Get Reseller(s)' });
    if (id) {
      this.audit.log({ message: 'With ID' });
      const result = await this.repository.findOneBy({ id });
      this.audit.log({ message: result });
      return result;
    } else {
      this.audit.log({ message: 'Without ID' });
      const result = await this.repository.find();
      this.audit.log({ message: result });
      return result;
    }
  }

  @Post('current')
  async updateCurrent(
    @Req() request: Request,
    @Res() response: Response,
    @Body(ResellerValidation) reseller: Reseller,
  ) {
    const verification = await this.authService.verifyRequest(request);
    if (verification) {
      const dbReseller = await this.repository.findOneBy({
        username: verification.username,
      });
      if (
        dbReseller != undefined &&
        dbReseller.id == reseller.id &&
        dbReseller.userType == reseller.userType &&
        dbReseller.username == reseller.username
      ) {
        const result = await this.repository.save(reseller);
        response.send(result);
        return result;
      }
    }
    response.status(403);
    response.send({
      message: 'User not matched',
      error: 'Forbidden',
      statusCode: 403,
    });
  }

  @UseGuards(SupervisorGuard)
  @Post()
  async post(@Body(ResellerValidation) body: Reseller[]) {
    console.log(`${new Date().toISOString()}: Updating resellers`);
    console.log(body);
    body = body.map((item) => ({
      ...item,
      userType: undefined,
      username: undefined,
    }));
    await this.repository.save(body);
  }

  @UseGuards(SupervisorGuard)
  @Delete()
  async delete(@Body() body: Reseller[]) {
    for (const reseller of body) {
      await this.authService.adminDeleteUser(reseller);
      const invoices = await this.invoicesRepository.findBy({
        reseller,
      });
      for (const invoice of invoices) {
        const receipts = await this.receiptRepository.findBy({
          invoice,
        });
        await this.receiptRepository.remove(receipts);
        const invoiceTracks = await this.invoiceTrackRepository.findBy({
          invoice,
        });
        await this.invoiceTrackRepository.remove(invoiceTracks);
      }
      await this.invoicesRepository.remove(invoices);
    }

    return await this.repository.remove(body);
  }

  @UseGuards(SupervisorGuard)
  @Put()
  async put(
    @Body(ResellerValidation) body: { reseller: Reseller; password: string },
  ) {
    const createdReseller = await this.repository.save(body.reseller);
    try {
      await this.authService.adminCreateUser(body.reseller, body.password);
    } catch (e) {
      await this.repository.remove(createdReseller);
      throw e;
    }
    return createdReseller;
  }
}
