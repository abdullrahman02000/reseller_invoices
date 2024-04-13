import { ViewColumn, ViewEntity } from 'typeorm';
import { UserType } from 'src/enums/UserType';

@ViewEntity({
  name: 'invoice_report',
  expression: `
  SELECT invoice.id AS "invoiceId",
     sum(receipt."unitPrice" * receipt.quantity * receipt.multiplier) AS "totalPrice",
     reseller."userType",
     reseller.username,
     invoice_track1."trackDate" "createdAt",
     invoice_track2."trackDate" "paidAt",
     invoice_track3."trackDate" "approvedAt"
    FROM invoice
      FULL JOIN invoice_track invoice_track1 ON invoice_track1."invoiceId" = invoice.id and invoice_track1."status" = 'Idle'
      FULL JOIN invoice_track invoice_track2 ON invoice_track2."invoiceId" = invoice.id and invoice_track2."status" = 'Paid'
      FULL JOIN invoice_track invoice_track3 ON invoice_track3."invoiceId" = invoice.id and invoice_track3."status" = 'Approved'
      JOIN reseller ON invoice."resellerId" = reseller.id
      FULL JOIN receipt ON receipt."invoiceId" = invoice.id
   GROUP BY invoice.id, reseller."userType", reseller.username, invoice_track1."trackDate", invoice_track2."trackDate", invoice_track3."trackDate";
  `,
})
export class InvoiceReport {
  @ViewColumn()
  invoiceId: number;

  @ViewColumn()
  totalPrice: number;

  @ViewColumn()
  userType: UserType;

  @ViewColumn()
  username: string;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  paidAt: Date;

  @ViewColumn()
  approvedAt: Date;
}
