import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { UserType } from 'src/enums/UserType';
import { Request } from 'express';
@Injectable()
export class SupervisorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private audit: AuditLogService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.audit.log({ message: 'Verifying whether the user is supervisor' });
    const request: Request = context.switchToHttp().getRequest<Request>();
    const reseller = await this.authService.verifyReseller(request);
    if (reseller) {
      if (reseller.userType == UserType.Supervisor) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
