import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  const hotels = prisma.hotel.findMany();

  return hotels;
}

async function getHotelById(hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  getHotels,
  getHotelById,
};

export default hotelRepository;
