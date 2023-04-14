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

async function getTicketById(ticketId: number) {
  return prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      Enrollment: {
        include: {
          User: true,
        },
      },
      TicketType: true,
    },
  });
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

async function setTicketStatus(ticketId: number, status: 'PAID' | 'RESERVED') {
  await prisma.ticket.update({ where: { id: ticketId }, data: { status } });
}

export type CreateTicketParams = {
  ticketTypeId: number;
  enrollmentId: number;
};
const ticketRepository = {
  getTicketTypes,
  getUserTicket,
  createTicket,
  getTicketById,
  setTicketStatus,
};

export default ticketRepository;
