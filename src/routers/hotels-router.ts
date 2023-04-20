import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { getHotels } from '@/controllers/hotels-controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels);

export { hotelsRouter };
