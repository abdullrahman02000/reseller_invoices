import { InvoiceTrack } from 'src/entities/invoice-track.entity';
import { Receipt } from 'src/entities/receipt.entity';
import { Reseller } from 'src/entities/reseller.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('invoice')
export class Invoice {
  constructor(reseller: Reseller) {
    this.reseller = reseller;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Receipt, (receipt) => receipt.invoice)
  receipts: Receipt[];

  @ManyToOne(() => Reseller, (reseller) => reseller.invoices, {
    nullable: false,
  })
  reseller: Reseller;

  @OneToMany(() => InvoiceTrack, (invoiceTrack) => invoiceTrack.invoice)
  tracks: InvoiceTrack[];
}
