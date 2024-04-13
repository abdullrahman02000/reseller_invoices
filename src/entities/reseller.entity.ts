import { Invoice } from 'src/entities/invoice.entity';
import { UserType } from 'src/enums/UserType';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity('reseller')
@Unique(['username'])
export class Reseller {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 64, nullable: false })
  username: string;

  @Column({ length: 24, nullable: true })
  phoneNumber: string;

  @Column({ length: 128, nullable: true })
  email: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.Accountant })
  userType: UserType;

  @OneToMany(() => Invoice, (invoice) => invoice.reseller)
  invoices: Invoice[];
}
