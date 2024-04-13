import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';
import { Repository } from 'typeorm';
import { Reseller } from 'src/entities/reseller.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(Reseller)
    private resellerRepository: Repository<Reseller>,
  ) {}

  @Get('logout')
  async logout(@Res() response: Response) {
    const expire = new Date();
    expire.setSeconds(-10 + expire.getSeconds());
    response.appendHeader(
      'Set-Cookie',
      `AccessToken=;Expires=${expire.toUTCString()};HttpOnly;Path=/;SameSite=Strict`,
    );
    response.sendStatus(200);
  }

  @Get('verify')
  async verifyRequest(@Req() request: Request, @Res() response: Response) {
    const verification = await this.authService.verifyRequest(request);
    if (verification) {
      const reseller = await this.resellerRepository.findOneBy({
        username: verification.username,
      });
      response.send(reseller);
      return reseller;
    } else {
      response.sendStatus(401);
    }
  }

  @Post()
  async auth(
    @Body() body: { username: string; password: string },
    @Res() response: Response,
  ) {
    try {
      const authResult = await this.authService.login(
        body.username,
        body.password,
      );
      if (authResult && authResult.AuthenticationResult) {
        const accessToken = authResult.AuthenticationResult.AccessToken;
        const expire = new Date();
        expire.setSeconds(
          authResult.AuthenticationResult.ExpiresIn - 10 + expire.getSeconds(),
        );
        response.appendHeader(
          'Set-Cookie',
          `AccessToken=${accessToken};Expires=${expire.toUTCString()};HttpOnly;Path=/;SameSite=Lax`,
        );
        response.sendStatus(200);
      }
    } catch (e: any) {
      if (e instanceof NotAuthorizedException) {
        response.sendStatus(401);
      }
    }
  }
}
