import Joi from 'joi';
import { PaymentProcessingInfo } from '@/protocols';

export const processPaymetSchema = Joi.object<PaymentProcessingInfo>({
  ticketId: Joi.number().integer().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().integer().required(),
    name: Joi.string().required(),
    expirationDate: Date,
    cvv: Joi.number().integer().required(),
  }).required(),
});
