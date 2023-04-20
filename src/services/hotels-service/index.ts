import { Enrollment, Hotel, Ticket, TicketType } from '@prisma/client';
import { enrollmentNotFoundError } from './errors';
import hotelRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getHotels(userId: number): Promise<Hotel[]> {
  const hotels: Hotel[] = await hotelRepository.getHotels();
  //user has an enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw enrollmentNotFoundError();
  return hotels;
}

const hotelsService = {
  getHotels,
};
export default hotelsService;
