import { notFoundError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingRepository from "@/repositories/booking-repository";
import paymentRepository from "@/repositories/payment-repository";
import repositoryRoom from "@/repositories/rooms-repository";
import ticketRepository from "@/repositories/ticket-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getBookings(userId: number) {
  const bookings = await bookingRepository.getBookings(userId);
  if(!bookings || bookings.length === 0) throw notFoundError();
  return bookings;
}

async function createBooking(userId: number, roomId: number) {
  const ticket = await ticketsRepository.getTicketUser(userId);
  if(ticket.TicketType.isRemote) throw forbiddenError("Event is online!");
  if(!ticket.TicketType.includesHotel) throw forbiddenError("There is no hotel reservation on your ticket");
  if(ticket.status !== "PAID") throw forbiddenError("Payment is required!");
  const roomIdExists = await repositoryRoom.findRoomById(roomId);
  if(!roomIdExists) throw notFoundError();
  if(roomIdExists.capacity < 1) throw forbiddenError("There are no vacancies in this room!");
  await bookingRepository.includesUserInRoom(userId, roomId);
}

const serviceBooking = {
  getBookings,
  createBooking
};

export default serviceBooking;
