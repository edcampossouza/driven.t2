import { Payment } from '@prisma/client';
import { ticketNotFoundError, ticketOwnerError } from './errors';
import paymentRepository from '@/repositories/payments-repository';

export async function getPayment({ userId, ticketId }: getPaymentParams): Promise<Payment> {
  const payment = await paymentRepository.getPayment(ticketId);
  // this isnt working
  // (payment returning null)
  if (!payment) {
    throw ticketNotFoundError();
  }
  if (payment.Ticket.Enrollment.userId !== userId) throw ticketOwnerError();
  delete payment.Ticket;
  return payment;
}

type getPaymentParams = {
  userId: number;
  ticketId: number;
};
const ticketService = {
  getPayment,
};
export default ticketService;
