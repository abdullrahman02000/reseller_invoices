import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from 'src/entities/receipt.entity';
import { GuardRequirementsModule } from 'src/guards/requirements.module';

@Module({
  providers: [ReceiptService],
  controllers: [ReceiptController],
  imports: [TypeOrmModule.forFeature([Receipt]), GuardRequirementsModule],
})
export class ReceiptModule {}
