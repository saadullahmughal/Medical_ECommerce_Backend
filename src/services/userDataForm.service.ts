import httpStatus from "http-status";
import mongoose from "mongoose";
import FormData from "../models/form.model";
import ms from "ms";
import User from "../models/user.model";
require("dotenv").config();


export const submitFormService = async (requestQuery: { email?: string; ref?: string; age: number; gender?: string; showGender?: boolean; location?: string; diagnosis?: boolean; indicators?: string; subtype?: string; startTime?: string; }) => {
    const queryParams = Object.keys(requestQuery);
    if (!queryParams.some((element) => element == "startTime")) {
        return null;
    }
    if (!requestQuery.startTime) requestQuery.startTime = "0 seconds";
    let inRecord = {
        ...requestQuery,
        startTime: new Date(Date.now() - ms(requestQuery?.startTime)),
    };
    if (!FormData.validate(inRecord)) {
        return null;
    }
    let result = await FormData.create(inRecord);
    let newResult;
    if (result)
        newResult = await User.findOneAndUpdate(
            { email: requestQuery?.email },
            {
                $set: {
                    dateOfBirth: new Date(
                        Date.now() - ms(requestQuery?.age.toString() + " years")
                    ),
                    gender: requestQuery?.gender,
                },
            }
        ).exec();
    if (newResult)
        return {
            startedOn: {
                yearsPassed: requestQuery?.startTime,
                startAge: requestQuery?.age,
                userName: newResult?.userName,
            },
        };
};

