import { invalidDataError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import { newPayment } from "@/protocols";
import { serviceCreatePayment, serviceGetPayment } from "@/services/payments-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const ticketId  = (req.query.ticketId) as string;
  const userId = res.locals.userId as number;
  if(!ticketId) throw invalidDataError([""]);
  const payment = await serviceGetPayment(userId, parseInt(ticketId));
  return res.status(httpStatus.OK).send(payment);
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const newPayment = req.body as newPayment;
  const userId = res.locals.userId as number;
  const payment = await serviceCreatePayment(newPayment, userId);
  return res.status(200).send(payment);
}
