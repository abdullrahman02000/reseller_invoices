import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from 'src/entities/receipt.entity';
import { AuthGuard } from 'src/guards/AuthGuard';
import { Repository } from 'typeorm';

@Controller('receipt')
export class ReceiptController {
  constructor(
    @InjectRepository(Receipt) private receiptRepository: Repository<Receipt>,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(
    @Query('invoiceId') invoiceId?: number,
    @Query('where') where?: string,
  ) {
    let whereClause = {};
    if (where) {
      try {
        whereClause = JSON.parse(where);
      } catch (e) {}
    }
    return await this.receiptRepository.find({
      relations: {
        invoice: true,
      },
      where: { ...whereClause, invoice: { id: invoiceId } },
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  async post(@Body() receipts: Receipt[]) {
    return await this.receiptRepository.save(receipts);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Body() receipts: Receipt[]) {
    return await this.receiptRepository.remove(receipts);
  }
}
