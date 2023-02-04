import Joi from "joi";

export const createPaymentSchema = Joi.object({
  ticketId: Joi.number().positive().required(),
  cardData: Joi.object({
    isseur: Joi.string().required(),
    number: Joi.string().required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().positive().required()
  })
});
