import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

export async function serviceGetHotels(id: number) {
  const enrollment = await enrollmentRepository.findByUserId(id);
  if(!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.getTicketUser(id);
  if(!ticket) throw notFoundError();
}
