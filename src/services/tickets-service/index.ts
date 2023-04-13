import { Ticket, TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';

export async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes: TicketType[] = await ticketRepository.getTicketTypes();
  return ticketTypes;
}

export async function getTicket(userId: number): Promise<Ticket> {
  const ticket: Ticket = await ticketRepository.getUserTicket(userId);
  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTicket,
};
export default ticketService;
