import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceTrackController } from './invoice-track.controller';

describe('InvoiceTrackController', () => {
  let controller: InvoiceTrackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceTrackController],
    }).compile();

    controller = module.get<InvoiceTrackController>(InvoiceTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
