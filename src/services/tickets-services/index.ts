import { notFoundError } from "@/errors";
import { newTicket } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository/index";
import userRepository from "@/repositories/user-repository";

export async function serviceGetTicketsTypes() {
  const types = await ticketsRepository.getTicketsTypes();
  return types;
}

export async function serviceGetTickets(id: number) {
  const user = await userRepository.findUserById(id);
  if(!user) throw notFoundError();

  const ticket = await ticketsRepository.getTicketUser(id);
  if(!ticket) throw notFoundError();

  return ticket;
}

export async function serviceCreateTicket(id: number, ticketTypeId: number) {
  const registerEnrollment = await enrollmentRepository.findByUserId(id);
  if(!registerEnrollment) throw notFoundError();
  const newTicket: newTicket = {
    ticketTypeId,
    enrollmentId: registerEnrollment.id,
    status: "RESERVED"
  };
  await ticketsRepository.createTicket(newTicket);
  const ticket = await ticketsRepository.getTicketUser(id);
  return ticket;
}
