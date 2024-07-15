import Joi from "joi";

export const submitFormReq = Joi.object({
    body: {
        email: Joi.string().email().required(),
        age: Joi.number().integer().positive(),
        referrer: Joi.string(),
        gender: Joi.string().valid("Male", "Female", "Other"),
        showGender: Joi.boolean(),
        location: Joi.string(),
        diagnosis: Joi.string(),
        indicators: Joi.string(),
        subType: Joi.string(),
        startTime: Joi.string(),
    }
})