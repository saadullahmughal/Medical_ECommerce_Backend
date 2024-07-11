import Joi from "joi";
import express from "express"
import httpStatus from "http-status";

export const validate = (schema: Joi.Schema) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const schemaObject = Joi.compile(schema)
        //console.log("Validating")
        const validationResults = schemaObject.validate(req, {allowUnknown: true})
        if(validationResults.error) throw validationResults.error
        next()
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error?.toString())
        return
    }
};
