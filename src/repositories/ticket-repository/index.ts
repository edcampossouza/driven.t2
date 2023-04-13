import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = prisma.ticketType.findMany();

  return ticketTypes;
}

const ticketRepository = {
  getTicketTypes,
};

export default ticketRepository;
