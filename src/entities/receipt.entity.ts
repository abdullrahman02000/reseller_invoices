import { Invoice } from 'src/entities/invoice.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('receipt')
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({
    nullable: true,
    default: 1.0,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  multiplier: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.receipts, { nullable: false })
  invoice: Invoice;
}
