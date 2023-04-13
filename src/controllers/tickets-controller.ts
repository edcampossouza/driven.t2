import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Ticket, TicketType } from '@prisma/client';
import ticketService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketTypes(_req: Request, res: Response) {
  try {
    const ticketTypes: TicketType[] = await ticketService.getTicketTypes();
    return res.status(httpStatus.OK).json(ticketTypes);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const userId: number = req.userId;
    const ticket: Ticket = await ticketService.getTicket(userId);
    if (ticket) return res.status(httpStatus.OK).json(ticket);
    else throw new Error();
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}
