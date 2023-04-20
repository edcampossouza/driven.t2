import { Enrollment, Hotel, Ticket, TicketType } from '@prisma/client';
import { enrollmentNotFoundError, noHotelsFound, ticketNotFound } from './errors';
import hotelRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';

export async function getHotels(userId: number): Promise<Hotel[]> {
  const hotels: Hotel[] = await hotelRepository.getHotels();
  //user has an enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw enrollmentNotFoundError();
  //enrollment has a ticket?
  const ticket = await ticketRepository.getUserTicket(userId);
  if (!ticket) throw ticketNotFound();
  //are there any hotels?
  if (hotels.length < 1) throw noHotelsFound();
  return hotels;
}

const hotelsService = {
  getHotels,
};
export default hotelsService;
