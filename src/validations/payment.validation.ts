import Joi from "joi";

export const handlePaymentReq = Joi.object({
    body: {
        orderItems: Joi.array().required().min(1).items(Joi.object({ productTitle: Joi.string().required(), productCount: Joi.number().integer().min(1).required(), unitCost: Joi.number().integer().required().min(1) })),
        grandTotal: Joi.number().integer().min(1).required(),
        shippingFee: Joi.number().integer().min(1),
        discounted: Joi.number().integer().min(1),
        convienceFee: Joi.number().integer().min(1),
        paymentAccountInfo: Joi.object({
            accountType: Joi.string().required().valid("Master", "Visa", "Amex", "PayPal"),
            ID: Joi.string().required(),
            legalName: Joi.string(),
            expiry: Joi.string(),
            cvv: Joi.number().integer().positive()
        })
    }
})