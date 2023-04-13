import { ApplicationError } from '@/protocols';

export function enrollmentNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'User does not have an enrollment yet',
  };
}
