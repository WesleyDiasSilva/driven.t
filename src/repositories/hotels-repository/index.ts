import { prisma } from "@/config";

async function getHotels() {
  return await prisma.hotel.findMany({
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
    }
  });
}

const hotelRepository = {
  getHotels
};

export default hotelRepository;
