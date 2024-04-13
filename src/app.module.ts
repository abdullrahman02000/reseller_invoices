import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResellerModule } from './reseller/reseller.module';
import { InvoiceModule } from './invoice/invoice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reseller } from 'src/entities/reseller.entity';
import { ReceiptModule } from './receipt/receipt.module';
import { Invoice } from 'src/entities/invoice.entity';
import { Receipt } from 'src/entities/receipt.entity';
import { InvoiceTrackModule } from './invoice-track/invoice-track.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { ConfigModule } from '@nestjs/config';
import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { ReportModule } from './report/report.module';
import { ConfigSourceProvider } from './config-source/ConfigSourceProvider';
import { AuthModule } from './auth/auth.module';
import { InvoiceReport } from './entities/report.entity';
import { Summary } from './entities/summary.entity';
import { InvoiceStatusOperationsModule } from './invoice-status-operations/invoice-status-operations.module';

const config = ConfigSourceProvider.instance;
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: Number(config.get('DB_PORT')),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
      host: config.get('DB_HOST'),
      synchronize: true,
      entities: [
        Reseller,
        Invoice,
        Receipt,
        InvoiceTrack,
        InvoiceReport,
        Summary,
      ],
    }),
    ResellerModule,
    InvoiceModule,
    ReceiptModule,
    InvoiceTrackModule,
    AuditLogModule,
    ReportModule,
    AuthModule,
    InvoiceStatusOperationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
