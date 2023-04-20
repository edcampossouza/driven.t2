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

export function noHotelsFound(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'There are no hotels',
  };
}
