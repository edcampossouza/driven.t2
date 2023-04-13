import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { getPaymentController } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPaymentController);

export { paymentsRouter };
