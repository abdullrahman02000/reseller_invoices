import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Reseller } from 'src/entities/reseller.entity';
type ResellerWrapper = { reseller: Reseller };
@Injectable()
export class ResellerValidation
  implements
    PipeTransform<
      Reseller | Reseller[] | ResellerWrapper | undefined,
      Reseller | Reseller[] | ResellerWrapper | undefined
    >
{
  transform(
    value: Reseller | Reseller[] | { reseller: Reseller } | undefined,
    metadata: ArgumentMetadata,
  ): Reseller | Reseller[] | { reseller: Reseller } | undefined {
    console.log(
      `${new Date().toISOString()}: Validating Reseller: ${JSON.stringify(value)}`,
    );
    console.log(
      `${new Date().toISOString()}: Argument Metadata Type: ${metadata.type}`,
    );

    if (metadata.type == 'body') {
      if (value instanceof Array) {
        for (const item of value) {
          if (!this.validateSingle(item)) {
            throw new HttpException('Bad Reseller', HttpStatus.BAD_REQUEST);
          }
        }
      } else if (typeof value == 'object' && typeof value['id'] == 'number') {
        if (!this.validateSingle(value as Reseller)) {
          throw new HttpException('Bad Reseller', HttpStatus.BAD_REQUEST);
        }
      } else if (
        typeof value == 'object' &&
        typeof value['reseller'] == 'object' &&
        typeof value['reseller']['id'] == 'number'
      ) {
        if (!this.validateSingle(value['reseller'] as Reseller)) {
          throw new HttpException('Bad Reseller', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('Bad Reseller', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Bad Reseller', HttpStatus.BAD_REQUEST);
    }

    return value;
  }

  validateSingle(value: Reseller) {
    return value.phoneNumber?.length <= 24 && value.email?.length <= 128;
  }
}
