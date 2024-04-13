import { Module } from '@nestjs/common';
import { ResellerService } from './reseller.service';
import { ResellerController } from './reseller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reseller } from 'src/entities/reseller.entity';
import { AuthService } from 'src/auth/auth.service';
import { Invoice } from 'src/entities/invoice.entity';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { Receipt } from 'src/entities/receipt.entity';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Module({
  providers: [ResellerService, AuthService, AuditLogService],
  controllers: [ResellerController],
  imports: [
    TypeOrmModule.forFeature([Reseller, Invoice, InvoiceTrack, Receipt]),
  ],
})
export class ResellerModule {}
