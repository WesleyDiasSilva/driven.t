import { serviceGetTicketsTypes } from "@/services/tickets-services";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: Request, res: Response) {
  try {
    const types = await serviceGetTicketsTypes();
    return res.status(httpStatus.ACCEPTED).send(types);
  } catch {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}
