import httpStatus from "http-status"
import express from "express"
import { submitFormService } from "../services/userDataForm.service"

export const submitForm = async (req: express.Request, res: express.Response) => {
    const formData = req.body
    if (!formData) res.status(httpStatus.EXPECTATION_FAILED).send()
    const response = await submitFormService(formData)
    if (!response.done) res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.OK).send(response)
}

