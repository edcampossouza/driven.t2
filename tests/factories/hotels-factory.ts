import faker from '@faker-js/faker';
import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

export async function createHotel(params: Partial<Hotel> = {}): Promise<Hotel> {
  const name: string = params.name || faker.company.companyName();
  const image: string = params.image || faker.image.dataUri();

  return prisma.hotel.create({
    data: {
      name,
      image,
    },
  });
}
