import { prisma } from "@/config";

async function getHotels() {
  return await prisma.hotel.findMany();
}

async function getHotelById(id: number) {
  return await prisma.hotel.findFirst({
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      Rooms: {
        select: {
          id: true,
          name: true,
          capacity: true,
          hotelId: true,
          createdAt: true,
          updatedAt: true
        }
      }
    },
    where: {
      id
    }
  });
}

const hotelRepository = {
  getHotels,
  getHotelById
};

export default hotelRepository;
