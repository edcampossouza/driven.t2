import { TicketType } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';

export async function getTicketTypes(): Promise<TicketType[]> {
  const tickets: TicketType[] = await ticketRepository.getTicketTypes();
  return tickets;
}

const ticketService = {
  getTicketTypes,
};

export default ticketService;
