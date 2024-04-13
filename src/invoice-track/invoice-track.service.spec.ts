import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceTrackService } from './invoice-track.service';

describe('InvoiceTrackService', () => {
  let service: InvoiceTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceTrackService],
    }).compile();

    service = module.get<InvoiceTrackService>(InvoiceTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
