import { AuthenticatedRequest } from "@/middlewares";
import serviceHotels from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try{
    const id = req.userId;
    const hotels = await serviceHotels.getHotels(id);
    return res.status(httpStatus.OK).send(hotels);
  }catch (err) {
    if(err.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if(err.name === "notAllowed") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  try{
    const userId = req.userId;
    const hotelId = parseInt(req.params.id) as number;
    const hotel = await serviceHotels.getHotelById(userId, hotelId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (err) {
    if(err.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if(err.name === "notAllowed") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
