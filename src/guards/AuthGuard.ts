import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private audit: AuditLogService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.audit.log({ message: 'Verifying user from request' });
    const request = context.switchToHttp().getRequest<Request>();
    return (await this.authService.verifyRequest(request)) != undefined;
  }
}
