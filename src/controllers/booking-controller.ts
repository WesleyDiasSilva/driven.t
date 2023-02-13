import { AuthenticatedRequest } from "@/middlewares";
import { newBooking } from "@/protocols";
import serviceBooking from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  try{
    const userId = req.userId;
    const booking = await serviceBooking.getBookings(userId);
    res.status(httpStatus.OK).send(booking);
  }catch{
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try{
    const { roomId } = req.body as newBooking;
    const userId = req.userId;
    await serviceBooking.createBooking(userId, roomId);
    return res.sendStatus(httpStatus.OK);
  }catch (err) {
    if(err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  try{
    const userId = req.userId;
    const { roomId } = req.body as newBooking;
    const bookingId = parseInt(req.params.bookingId);
    await serviceBooking.updateBooking(userId, roomId, bookingId);
    res.sendStatus(httpStatus.OK);
  }catch (err) {
    if(err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.sendStatus(httpStatus.FORBIDDEN);
  }
}
