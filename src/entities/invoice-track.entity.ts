import { InvoiceStatus } from 'src/enums/InvoiceStatus';
import { Invoice } from 'src/entities/invoice.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('invoice_track')
@Index(['invoice', 'status'])
export class InvoiceTrack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  trackDate: Date;

  @Column({ type: 'enum', enum: InvoiceStatus })
  status: InvoiceStatus;

  @ManyToOne(() => Invoice, (invoice) => invoice.tracks, { nullable: false })
  invoice: Invoice;
}
