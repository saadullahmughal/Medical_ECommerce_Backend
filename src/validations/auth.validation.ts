import Joi from "joi";

export const signUpReqBody = Joi.object({
    body: {
        email: Joi.string().required().email(),
        userName: Joi.string().required(),
        password: Joi.string().required()
    }
})

export const logInReqBody = Joi.object({
    body: {
        userName: Joi.string().required(),
        password: Joi.string().required()
    }
})

export const logOutReqBody = Joi.object({
    body: {
        token: Joi.string().required()
    }
})

export const forgotPasswordReqBody = Joi.object({
    body: {
        email: Joi.string().required().email()
    }
})

export const resetPasswordReqBody = Joi.object({
    body: {
        token: Joi.string().required(),
        password: Joi.string().required(),
    }
})


export const refreshTokenReqBody = Joi.object({
    body: {
        token: Joi.string().required()
    }
})