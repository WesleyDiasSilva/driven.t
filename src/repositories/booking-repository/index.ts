import { prisma } from "@/config";

export async function getBookings(userId: number) {
  return await prisma.booking.findMany({ where: {
    userId
  }, 
  select: {
    Room: true,
    id: true
  } });
}

export async function includesUserInRoom(userId: number, roomId: number) {
  await prisma.booking.updateMany({
    where: {
      userId
    }, 
    data: {
      roomId
    }
  });
}

const bookingRepository = {
  getBookings,
  includesUserInRoom
};

export default bookingRepository;
