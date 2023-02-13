import { prisma } from "@/config";

async function getBookings(userId: number) {
  return await prisma.booking.findMany({ where: {
    userId
  }, 
  select: {
    Room: true,
    id: true
  } });
}

async function includesUserInRoom(userId: number, roomId: number) {
  await prisma.booking.updateMany({
    where: {
      userId
    }, 
    data: {
      roomId
    }
  });
}

async function findBookingById(id: number) {
  return prisma.booking.findFirst({ where: { id } });
}

async function updateBooking(bookingId: number, roomId: number) {
  await prisma.booking.update({ data: { roomId }, where: { id: bookingId } });
}

const bookingRepository = {
  getBookings,
  includesUserInRoom,
  findBookingById,
  updateBooking
};

export default bookingRepository;
