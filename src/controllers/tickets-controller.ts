import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '@/services/tickets-service';

export async function getTicketTypes(_req: Request, res: Response) {
  try {
    const tickets = await ticketService.getTicketTypes();
    return res.status(httpStatus.OK).json(tickets);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
