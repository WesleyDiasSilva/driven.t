import { notFoundError } from "@/errors";
import { notAllowedError } from "@/errors/not-allowed";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getHotels(id: number) {
  const enrollment = await enrollmentRepository.findByUserId(id);
  if(!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.getTicketUser(id);
  if(!ticket) throw notFoundError();
  
  if(ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw notAllowedError();
  const hotels = await hotelsRepository.getHotels();
  if(hotels.length === 0 || !hotels) throw notFoundError();
  return hotels;
}

async function getHotelById(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if(!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.getTicketUser(userId);
  if(!ticket) throw notFoundError();
  if(ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw notAllowedError();
  const hotel = await hotelsRepository.getHotelById(hotelId);
  if(!hotel) throw notFoundError();
  return hotel;
}

const serviceHotel = {
  getHotels,
  getHotelById
};

export default serviceHotel;
