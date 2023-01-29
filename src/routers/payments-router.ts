import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getPayment } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter
  .use(authenticateToken)
  .get("/", getPayment)
  .post("/process");

export { paymentsRouter };
