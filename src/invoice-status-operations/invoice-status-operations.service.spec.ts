import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceStatusOperationsService } from './invoice-status-operations.service';

describe('InvoiceStatusOperationsService', () => {
  let service: InvoiceStatusOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceStatusOperationsService],
    }).compile();

    service = module.get<InvoiceStatusOperationsService>(InvoiceStatusOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
