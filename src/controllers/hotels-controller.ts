import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const id = req.userId;
  const hotels = await serviceGetHotels(id);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const id = req.userId;
}
