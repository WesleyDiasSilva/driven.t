import { notFoundError } from "@/errors";
import { notAllowedError } from "@/errors/not-allowed";
import { newPayment } from "@/protocols";
import { paymentsRepository } from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";

export async function serviceGetPayment(userId: number, ticketId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);
  if(!ticket) throw notFoundError();
  if(ticket.Enrollment.User.id !== userId) throw notAllowedError();
  return await paymentsRepository.getPaymentByTicketId(ticketId);
}

export async function serviceCreatePayment(newPayment: newPayment, userId: number) {
  const ticket = await ticketsRepository.getTicketById(newPayment.ticketId);
  if(!ticket) throw notFoundError();
  if(ticket.Enrollment.User.id !== userId) throw notAllowedError();
  const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);
  const digits = newPayment.cardData.number.split("").reverse();
  const lastDigits = `${digits[0]} + ${digits[1]} + ${digits[2]} + ${digits[3]}`;
  const createPaymentObject = {
    ticketId: newPayment.ticketId,
    value: ticketType.price,
    cardIssuer: newPayment.cardData.isseuer,
    cardLastDigits: lastDigits
  };
  await paymentsRepository.createPayment(createPaymentObject);
  return await paymentsRepository.getPaymentByTicketId(newPayment.ticketId);
}
