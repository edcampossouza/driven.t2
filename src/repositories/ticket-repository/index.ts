import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

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

async function createTicket({ ticketTypeId, enrollmentId }: CreateTicketParams): Promise<Ticket> {
  const ticket = prisma.ticket.create({
    data: {
      status: 'RESERVED',
      enrollmentId,
      ticketTypeId,
    },
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
  });
  return ticket;
}

export type CreateTicketParams = {
  ticketTypeId: number;
  enrollmentId: number;
};
const ticketRepository = {
  getTicketTypes,
  getUserTicket,
  createTicket,
};

export default ticketRepository;
