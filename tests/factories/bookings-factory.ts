import { prisma } from "@/config";
import { createHotels, createRooms, findRooms } from "../helpers";

export async function createBookings(usersIds?: number[]) {
  await createHotels();
  await createRooms();
  const rooms = await findRooms();
  const bookings = usersIds.map((id) => {
    return {
      roomId: rooms[0].id,
      userId: id
    };
  });
  
  await prisma.booking.createMany({ data: bookings });
  return bookings;
}

export async function findBookings() {
  return await prisma.booking.findMany();
}
