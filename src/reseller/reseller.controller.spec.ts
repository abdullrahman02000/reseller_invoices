import { Test, TestingModule } from '@nestjs/testing';
import { ResellerController } from './reseller.controller';

describe('ResellerController', () => {
  let controller: ResellerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResellerController],
    }).compile();

    controller = module.get<ResellerController>(ResellerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
