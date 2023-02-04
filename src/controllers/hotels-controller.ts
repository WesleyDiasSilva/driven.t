import { AuthenticatedRequest } from "@/middlewares";
import { serviceGetHotels } from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try{
    const id = req.userId;
    const hotels = await serviceGetHotels(id);
    return res.status(httpStatus.OK).send(hotels);
  }catch (err) {
    if(err.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if(err.name === "notAllowed") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const id = req.userId;
}
