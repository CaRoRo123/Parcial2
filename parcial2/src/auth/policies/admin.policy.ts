import { Policy } from '@nestjs/authorization';
import { User } from '../../users/entities/user.entity.js';

@Policy()
export class AdminPolicy {
  before(user: User | null): boolean | undefined {
    if (user?.roles?.some((role) => role.role_name === 'admin')) return true;
    return undefined;
  }

  manage(user: User | null): boolean {
    return Boolean(user?.roles?.some((role) => role.role_name === 'admin'));
  }
}
