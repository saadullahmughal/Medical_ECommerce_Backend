import Joi from "joi"

export const AuthToken = Joi.compile(Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required()
}))

export const addUserReqBody = Joi.object({
    body: {
        role: Joi.string().required().lowercase().valid("admin", "user"),
        email: Joi.string().required().email(),
        userName: Joi.string().required(),
        password: Joi.string().required()
    }
})

export const signUpReqBody = Joi.object({
    body: {
        role: Joi.forbidden(),
        email: Joi.string().required().email(),
        userName: Joi.string().required(),
        password: Joi.string().required()
    }
})

export const logInReqBody = Joi.object({
    body: Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required()
    }).max(2)
})

export const logOutReqBody = Joi.object({
    body: Joi.object({
        token: Joi.string().required()
    }).max(1)
})

export const forgotPasswordReqBody = Joi.object({
    body: Joi.object({
        userName: Joi.string().required()
    }).max(1)
})

export const resetPasswordReqBody = Joi.object({
    body: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().required(),
    }).max(2)
})


export const refreshTokenReqBody = Joi.object({
    body: {
        token: Joi.string().required()
    }
})