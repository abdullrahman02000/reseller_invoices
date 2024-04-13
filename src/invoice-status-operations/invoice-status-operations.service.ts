import { Injectable } from '@nestjs/common';
import { IInvoiceStatus } from 'src/interfaces/IInvoiceStatus';
import { InvoiceStatus } from 'src/enums/InvoiceStatus';

import { IdleInvoiceStatus } from './idle-status.servie';
import { PaidInvoiceStatus } from './paid-status.service';
import { ApprovedInvoiceStatus } from './approved-status.service';

@Injectable()
export class InvoiceStatusService {
  constructor(
    private idleInvoiceStatus: IdleInvoiceStatus,
    private paidInvoiceStatus: PaidInvoiceStatus,
    private approvedInvoiceStatus: ApprovedInvoiceStatus,
  ) {}

  getService(status: InvoiceStatus): IInvoiceStatus {
    switch (status) {
      case InvoiceStatus.Idle:
        return this.idleInvoiceStatus;
      case InvoiceStatus.Paid:
        return this.paidInvoiceStatus;
      case InvoiceStatus.Approved:
        return this.approvedInvoiceStatus;
    }
  }
}
