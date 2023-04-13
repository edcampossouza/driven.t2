import { ApplicationError } from '@/protocols';

export function ticketNotFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'Ticket not found',
  };
}

export function ticketOwnerError(): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: 'Ticket does not belong to the user',
  };
}
