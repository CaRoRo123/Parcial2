import { Policy } from '@nestjs/authorization';
import { User } from '../../users/entities/user.entity.js';
import { Reservation } from '../../reservations/entities/reservation.entity.js';


function hasRole(user: User | null, ...roles: string[]): boolean {
  return Boolean(user?.roles?.some((r) => roles.includes(r.role_name)));
}

@Policy()
export class ReservationPolicy {

  create(user: User | null): boolean {
    return hasRole(user, 'conductor');
  }

  update(user: User | null): boolean {
    return hasRole(user, 'supervisor');
  }

  delete(user: User | null): boolean {
    return hasRole(user, 'conductor');
  }

}