import { Payment, User } from '@prisma/client';
import { prisma } from '@/config';

async function getPayment(ticketId: number) {
  const payment = prisma.payment.findFirst({
    select: {
      Ticket: {
        select: {
          Enrollment: {
            select: {
              userId: true,
            },
          },
        },
      },
      cardIssuer: true,
      cardLastDigits: true,
      createdAt: true,
      id: true,
      ticketId: true,
      value: true,
      updatedAt: true,
    },
    where: { ticketId },
  });
  return payment;
}

export default {
  getPayment,
};
