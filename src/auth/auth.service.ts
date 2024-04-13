import { Reseller } from './../entities/reseller.entity';

import { Injectable, Req } from '@nestjs/common';
import * as Cognito from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { ConfigSourceProvider } from 'src/config-source/ConfigSourceProvider';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private audit: AuditLogService,
    @InjectRepository(Reseller)
    private resellerRepository: Repository<Reseller>,
  ) {}
  private config = ConfigSourceProvider.instance;
  private userPoolId = this.config.get('COGNITO_USERPOOL_ID');
  private clientId = this.config.get('COGNITO_CLIENT_ID');
  private verifier = CognitoJwtVerifier.create({
    userPoolId: this.userPoolId,
    tokenUse: 'access',
    clientId: this.clientId,
    graceSeconds: 10,
  });
  private client = new Cognito.CognitoIdentityProviderClient({
    region: this.config.get('COGNITO_REGION'),
    credentials: {
      accessKeyId: this.config.get('COGNITO_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('COGNITO_SECRET_ACCESS_KEY'),
    },
  });

  async login(Username, Password) {
    const cmd = new Cognito.AdminInitiateAuthCommand({
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      AuthFlow: Cognito.AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: Username,
        PASSWORD: Password,
      },
    });
    const authResult = await this.client.send(cmd);
    return authResult;
  }

  async getUser({ AccessToken }) {
    const cmd = new Cognito.GetUserCommand({ AccessToken });
    return await this.client.send(cmd);
  }

  async updateUserAttribute({ AccessToken, UserAttributes }) {
    const cmd = new Cognito.UpdateUserAttributesCommand({
      AccessToken,
      UserAttributes,
    });
    return await this.client.send(cmd);
  }

  async verify(AccessToken: string) {
    try {
      const result = await this.verifier.verify(AccessToken);
      return result;
    } catch (error) {
      if (error.code == 'Error') {
        this.audit.log({
          message: {
            level: 'Error',
            message: error.toString(),
            code: error.code,
            source: ['userPool/verify'],
            errorParameters: error,
          },
        });
        return undefined;
      }
    }
  }

  async verifyReseller(@Req() request: Request) {
    const verification = await this.verifyRequest(request);
    if (verification) {
      const reseller = await this.resellerRepository.findOneBy({
        username: verification.username,
      });
      return reseller;
    } else {
      return undefined;
    }
  }

  async forgetPassword({ Username }) {
    const cmd = new Cognito.ForgotPasswordCommand({
      ClientId: this.clientId,
      Username,
    });
    return await this.client.send(cmd);
  }

  async confirmForgotPassword({ Username, ConfirmationCode, Password }) {
    const cmd = new Cognito.ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      Username,
      ConfirmationCode,
      Password,
    });
    return await this.client.send(cmd);
  }

  async changePassword({ AccessToken, PreviousPassword, ProposedPassword }) {
    const cmd = new Cognito.ChangePasswordCommand({
      AccessToken,
      PreviousPassword,
      ProposedPassword,
    });
    return await this.client.send(cmd);
  }

  async responseToNewPasswordChallenge({ Username, Password, Session }) {
    const command = new Cognito.RespondToAuthChallengeCommand({
      ChallengeName: Cognito.ChallengeNameType.NEW_PASSWORD_REQUIRED,
      ClientId: this.clientId,
      Session,
      ChallengeResponses: {
        USERNAME: Username,
        NEW_PASSWORD: Password,
      },
    });

    return await this.client.send(command);
  }

  async adminCreateUser(reseller: Reseller, password: string) {
    this.audit.log({ message: 'Creating User' });
    const command = new Cognito.AdminCreateUserCommand({
      Username: reseller.username,
      UserPoolId: this.userPoolId,
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email', Value: reseller.email },
        { Name: 'phone_number', Value: reseller.phoneNumber },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'phone_number_verified', Value: 'true' },
      ],
    });
    const result1 = await this.client.send(command);
    this.audit.log({ message: 'User Created' });
    this.audit.log({ message: 'Confirming Password' });
    const command2 = new Cognito.AdminSetUserPasswordCommand({
      Username: reseller.username,
      Password: password,
      Permanent: true,
      UserPoolId: this.userPoolId,
    });
    await this.client.send(command2);
    this.audit.log({ message: 'Password Confirmed' });
    return result1;
  }

  async adminDeleteUser(reseller: Reseller) {
    const command = new Cognito.AdminDeleteUserCommand({
      Username: reseller.username,
      UserPoolId: this.userPoolId,
    });
    return await this.client.send(command);
  }

  async verifyRequest(request: any) {
    let cookies = {};
    if (request.headers && request.headers['cookie']) {
      cookies = Object.fromEntries(
        request.headers['cookie']?.split(';').map((item) => {
          return item
            .split('=')
            .map((value2) => value2.trim())
            .slice(0, 2);
        }),
      );
    } else {
      return undefined;
    }

    const accessToken = cookies['AccessToken'];
    const verification = await this.verify(accessToken);
    this.audit.log({ message: 'Authentication Verification Result' });
    this.audit.log({ message: verification });
    if (verification && verification.username) {
      return verification;
    } else {
      return undefined;
    }
  }
}
