import { Enrollment, Ticket, TicketType } from '@prisma/client';
import { enrollmentNotFoundError } from './errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes: TicketType[] = await ticketRepository.getTicketTypes();
  return ticketTypes;
}

export async function getTicket(userId: number): Promise<Ticket> {
  const ticket: Ticket = await ticketRepository.getUserTicket(userId);
  return ticket;
}

export async function createTicket({ userId, ticketTypeId }: CreateTicketParams): Promise<Ticket> {
  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw enrollmentNotFoundError();
  const ticket = await ticketRepository.createTicket({ ticketTypeId, enrollmentId: enrollment.id });
  return ticket;
}

export type CreateTicketParams = {
  userId: number;
  ticketTypeId: number;
};

const ticketService = {
  getTicketTypes,
  getTicket,
  createTicket,
};
export default ticketService;
