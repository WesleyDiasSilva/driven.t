import { getTickets, getTicketsTypes, postTicket } from "@/controllers/tickets-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketSchema } from "@/schemas/tickets-schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .use(authenticateToken)
  .get("/types", getTicketsTypes)
  .get("/", getTickets)
  .post("/", validateBody(createTicketSchema), postTicket);

export { ticketsRouter };
