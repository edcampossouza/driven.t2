import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentProcessingInfo } from '@/protocols';

async function getPayment(ticketId: number) {
  const payment = prisma.payment.findFirst({
    where: { ticketId },
  });
  return payment;
}

async function processPayment(paymentInfo: PaymentProcessingInfo, price: number): Promise<Payment> {
  const payment = await prisma.payment.create({
    data: {
      ticketId: paymentInfo.ticketId,
      cardIssuer: paymentInfo.cardData.issuer,
      cardLastDigits: paymentInfo.cardData.number.toString().substring(11, 16),
      value: price,
    },
  });
  return payment;
}

export default {
  getPayment,
  processPayment,
};
