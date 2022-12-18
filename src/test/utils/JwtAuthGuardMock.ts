import { ExecutionContext } from '@nestjs/common/interfaces';
import * as uuid from 'uuid';

export const JOHN_USER_UUID = 'db90d8e2-6ee9-4474-863f-c5102527ffb8'
export const DEFAULT_USER_UUID = '5a9b5c9f-b7a3-442c-8482-5e067e116d5d'

export class JwtAuthGuardMock {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const id = req.params.id
    const userId = id === JOHN_USER_UUID ? JOHN_USER_UUID : DEFAULT_USER_UUID;

    req.user = {
      userId,
      userName: 'kirby'
    };

    return true;
  }
}