import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { exclude } from '@/utils/prisma-utils';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = prisma.ticketType.findMany();

  return ticketTypes;
}

async function getUserTicket(userId: number): Promise<Ticket | undefined> {
  const ticket = prisma.ticket.findFirst({
    select: {
      createdAt: true,
      updatedAt: true,
      enrollmentId: true,
      id: true,
      status: true,
      ticketTypeId: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    where: {
      Enrollment: {
        userId: userId,
      },
    },
  });

  return ticket;
}

const ticketRepository = {
  getTicketTypes,
  getUserTicket,
};

export default ticketRepository;
