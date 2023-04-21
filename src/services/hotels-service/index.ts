import { Hotel, Room } from '@prisma/client';
import { enrollmentNotFoundError, hotelNotFound, noHotelsFound, ticketNotFound } from './errors';
import hotelRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { paymentError } from '@/errors';

export async function getHotels(userId: number): Promise<Hotel[]> {
  //user has an enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw enrollmentNotFoundError();
  //enrollment has a ticket?
  const ticket = await ticketRepository.getUserTicket(userId);
  if (!ticket) throw ticketNotFound();
  const status = ticket.status;
  if (ticket.TicketType.isRemote) throw paymentError('Ticket is for a remote event');
  if (!ticket.TicketType.includesHotel) throw paymentError('Ticket does not include accomodation');
  if (status !== 'PAID') throw paymentError('Ticket not paid');

  //are there any hotels?
  const hotels: Hotel[] = await hotelRepository.getHotels();
  if (hotels.length < 1) throw noHotelsFound();
  return hotels;
}

export async function getHotel(userId: number, hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  //user has an enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw enrollmentNotFoundError();
  //enrollment has a ticket?
  const ticket = await ticketRepository.getUserTicket(userId);
  if (!ticket) throw ticketNotFound();
  const status = ticket.status;
  if (ticket.TicketType.isRemote) throw paymentError('Ticket is for a remote event');
  if (!ticket.TicketType.includesHotel) throw paymentError('Ticket does not include accomodation');
  if (status !== 'PAID') throw paymentError('Ticket not paid');

  const hotel = await hotelRepository.getHotelById(hotelId);
  if (!hotel) throw hotelNotFound(hotelId);
  return hotel;
}

const hotelsService = {
  getHotels,
  getHotel,
};
export default hotelsService;
