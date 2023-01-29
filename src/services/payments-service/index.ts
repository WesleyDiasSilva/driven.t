import { notFoundError } from "@/errors";
import { notAllowedError } from "@/errors/not-allowed";
import { paymentsRepository } from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";

export async function serviceGetPayment(userId: number, ticketId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);
  if(!ticket) throw notFoundError();
  if(ticket.Enrollment.User.id !== userId) throw notAllowedError();
  return await paymentsRepository.getPaymentByTicketId(ticketId);
}
