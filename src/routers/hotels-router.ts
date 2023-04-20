import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { getHotels, getHotelById } from '@/controllers/hotels-controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getHotelById);

export { hotelsRouter };
