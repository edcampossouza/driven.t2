import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  const hotels = prisma.hotel.findMany();

  return hotels;
}

const hotelRepository = {
  getHotels,
};

export default hotelRepository;
