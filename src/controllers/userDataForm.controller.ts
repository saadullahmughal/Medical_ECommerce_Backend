import httpStatus from "http-status";
import express from "express";
import { submitFormService } from "../services/userDataForm.service";
import { MongoServerError } from "mongodb";
import { MongooseError } from "mongoose";

export const submitForm = async (req: express.Request, res: express.Response) => {
    const formData = req.body;
    try {
        if (!formData) res.status(httpStatus.EXPECTATION_FAILED).send();
        const response = await submitFormService(formData);
        if (!response) res.status(httpStatus.EXPECTATION_FAILED).send();
        else res.status(httpStatus.OK).send(response);
    } catch (error) {
        //console.error(error.toString().split(":")[1].trim());
        console.error(error);
        res.status(httpStatus.EXPECTATION_FAILED).send();
    }
};

