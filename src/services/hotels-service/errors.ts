import { ApplicationError } from '@/protocols';

export function enrollmentNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'User does not have an enrollment yet',
  };
}

export function ticketNotFound(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'User does not have a ticket yet',
  };
}
