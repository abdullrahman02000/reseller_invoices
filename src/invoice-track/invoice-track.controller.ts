import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { Repository } from 'typeorm';

@Controller('invoice-track')
export class InvoiceTrackController {
  constructor(
    @InjectRepository(InvoiceTrack)
    private invoiceTrackRepository: Repository<InvoiceTrack>,
  ) {}

  @Get()
  async get(@Query('invoiceId') invoiceId: number) {
    return await this.invoiceTrackRepository.find({
      relations: {
        invoice: true,
      },
      where: {
        invoice: { id: invoiceId },
      },
    });
  }
}
