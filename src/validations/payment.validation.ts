import Joi from "joi"

export const createIntentReq = Joi.object({
    body: {
        orderItems: Joi.array().required().min(1).items(Joi.object({
            productTitle: Joi.string().required(),
            productCount: Joi.number().integer().min(1).required(),
            unitCost: Joi.number().integer().required().min(1)
        }))
    }
})

export const getCartReq = Joi.object({
    query: Joi.object({
        cartID: Joi.string().required()
    }).max(1)
})

export const addCartReq = Joi.object({
    body: {
        item: Joi.string().required(),
        count: Joi.number().integer().required(),
        cartID: Joi.string()
    }
})

export const finalizePaymentReq = Joi.object({
    body: {
        capture: Joi.boolean().required(),
        clientSecret: Joi.string().required()
        // .regex(new RegExp("^(?:pi_)[^_]+$"))
    }
})