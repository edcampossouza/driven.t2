import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Hotel } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const hotels: Hotel[] = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).json(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const hotelId = req.params.hotelId;
    const hotel = await hotelsService.getHotel(userId, Number(hotelId));
    return res.status(httpStatus.OK).json(hotel);
  } catch (error) {
    next(error);
  }
}
