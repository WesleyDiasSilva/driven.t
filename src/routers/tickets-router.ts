import { getTicketsTypes } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/tickets/types", getTicketsTypes)
  .get("/tickets")
  .post("/tickets");

export default ticketsRouter;
