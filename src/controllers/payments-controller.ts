import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { Payment } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import { invalidDataError } from '@/errors';
import { getPayment, processPayment } from '@/services/payments-service';
import { PaymentProcessingInfo } from '@/protocols';

export async function getPaymentController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { ticketId: ticketIdStr } = req.query;
    const ticketId = Number(ticketIdStr);
    if (isNaN(ticketId)) throw invalidDataError([`Invalid ticket id`]);
    const payment: Payment = await getPayment({ userId, ticketId });
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}

export async function processPaymentController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const paymentInfo: PaymentProcessingInfo = req.body;
    const payment = await processPayment(userId, paymentInfo);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}
