import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT COUNT(INVOICE_REPORT."createdAt") "createdAtCount",
	COUNT(INVOICE_REPORT."paidAt") "paidAtCount",
	COUNT(INVOICE_REPORT."approvedAt") "approvedAtCount",
	MIN("createdAt") "minCreatedAt",
	MAX("createdAt") "maxCreatedAt",
	MIN("paidAt") "minPaidAt",
	MAX("paidAt") "maxPaidAt",
	MIN("approvedAt") "minApprovedAt",
	MAX("approvedAt") "maxApprovedAt"
  FROM INVOICE_REPORT
  `,
})
export class Summary {
  @ViewColumn()
  createdAtCount: number;

  @ViewColumn()
  paidAtCount: number;

  @ViewColumn()
  approvedAtCount: number;

  @ViewColumn()
  minCreatedAt: Date;

  @ViewColumn()
  maxCreatedAt: Date;

  @ViewColumn()
  minPaidAt: Date;

  @ViewColumn()
  maxPaidAt: Date;

  @ViewColumn()
  minApprovedAt: Date;

  @ViewColumn()
  maxApprovedAt: Date;
}
