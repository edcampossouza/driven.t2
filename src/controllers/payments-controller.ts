import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Payment, Ticket, TicketType } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import { invalidDataError } from '@/errors';
import { getPayment } from '@/services/payments-service';

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
