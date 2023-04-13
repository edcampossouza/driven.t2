import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketTypes, getUserTickets, createTicket } from '@/controllers/tickets-controller';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getUserTickets)
  .post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
