import { AuthenticatedRequest } from "@/middlewares";
import { serviceCreateTicket, serviceGetTickets, serviceGetTicketsTypes } from "@/services/tickets-services";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const types = await serviceGetTicketsTypes();
    return res.status(200).send(types);
  } catch {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const user_id = req.userId;
    const ticket = await serviceGetTickets(user_id);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
type bodyTicketTypeId = {
  ticketTypeId: number
}
export async function postTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const user_id = req.userId;
    const { ticketTypeId } = req.body as bodyTicketTypeId;
    const ticket = await serviceCreateTicket(user_id, ticketTypeId);
    console.log("AQUI ", ticket);
    return res.status(httpStatus.CREATED).send(ticket);
  }catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
