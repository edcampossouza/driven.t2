import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Hotel } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const hotels: Hotel[] = [];
    return res.status(httpStatus.OK).json(hotels);
  } catch (error) {
    next(error);
  }
}
