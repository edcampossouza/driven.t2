import { Payment } from '@prisma/client';
import { ticketNotFoundError, ticketOwnerError } from './errors';
import paymentRepository from '@/repositories/payments-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { PaymentProcessingInfo } from '@/protocols';

export async function getPayment({ userId, ticketId }: getPaymentParams): Promise<Payment> {
  const ticket = await ticketRepository.getTicketById(ticketId);
  if (!ticket) throw ticketNotFoundError();
  if (ticket.Enrollment.User.id !== userId) throw ticketOwnerError();

  const payment = await paymentRepository.getPayment(ticketId);
  return payment;
}

export async function processPayment(userId: number, paymentInfo: PaymentProcessingInfo) {
  const ticket = await ticketRepository.getTicketById(paymentInfo.ticketId);
  if (!ticket) {
    throw ticketNotFoundError();
  }
  if (ticket.Enrollment.User.id !== userId) throw ticketOwnerError();

  const price = ticket.TicketType.price;
  const payment = await paymentRepository.processPayment(paymentInfo, price);
  await ticketRepository.setTicketStatus(ticket.id, 'PAID');

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
