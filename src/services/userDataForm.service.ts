import httpStatus from "http-status";
import mongoose from "mongoose";
import FormData from "../models/form.model";
import User from "../models/user.model";
import moment from "moment";
import { parseMongoError } from "../utils/errorParser";
require("dotenv").config();


export const submitFormService = async (requestQuery: Record<string, any>) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const startTime: string = requestQuery?.["startTime"] || "0 seconds" as string
        const timeParts = startTime.split(" ", 2)
        let startTimeDate = moment().subtract(moment.duration(timeParts[0], timeParts[1] as moment.DurationInputArg2)).toDate()
        let inRecord = {
            ...requestQuery,
            startTime: startTimeDate,
        };
        let result = await FormData.create([inRecord], { session });
        let newResult;
        if (result)
            newResult = await User.findOneAndUpdate(
                { email: requestQuery?.email },
                {
                    $set: {
                        dateOfBirth: moment().subtract(moment.duration(requestQuery?.age, "years")).toDate(),
                        gender: requestQuery?.gender,
                    },
                }
                , { session }).exec();
        if (newResult) {
            await session.commitTransaction()
            await session.endSession()
            return {
                done: true, message: {
                    userName: newResult?.userName,
                }
            }
        } else {
            throw new Error("Couldn't be added")
        }
    } catch (error) {
        //console.error(error)
        await session.abortTransaction()
        await session.endSession()
        return { done: false, message: parseMongoError(error) }
    }
};

