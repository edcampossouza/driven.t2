import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { getPaymentController, processPaymentController } from '@/controllers';
import { processPaymetSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentController)
  .post('/process', validateBody(processPaymetSchema), processPaymentController);

export { paymentsRouter };
