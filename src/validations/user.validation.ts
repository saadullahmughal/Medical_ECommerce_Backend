import Joi from "joi"

export const updateUserReqBody = Joi.object({
    body: Joi.object({
        password: Joi.string(),
        email: Joi.forbidden(),
        userName: Joi.forbidden(),
        nic: Joi.string(),
        mobile: Joi.string(),
        gender: Joi.string().valid("Male", "Female", "Other"),
        image: Joi.forbidden()
    }).min(1)
})

export const changePasswordOrEmailReqBody = Joi.object({
    body: Joi.alternatives().try(Joi.object({
        newEmail: Joi.string().required().email()
    }), Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    }))
})

export const addProfilePicReq = Joi.object({
    files: {
        image: Joi.required()
    }
})