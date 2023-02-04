import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getPayment, postPayment } from "@/controllers/payments-controller";
import { createPaymentSchema } from "@/schemas/payments-schemas";

const paymentsRouter = Router();

paymentsRouter
  .use(authenticateToken)
  .get("/", getPayment)
  .post("/process", validateBody(createPaymentSchema), postPayment);

export { paymentsRouter };
