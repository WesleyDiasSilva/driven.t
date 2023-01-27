import { getTicketsTypes } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .use(authenticateToken)
  .get("/types", getTicketsTypes)
  .get("/")
  .post("/");

export { ticketsRouter };
