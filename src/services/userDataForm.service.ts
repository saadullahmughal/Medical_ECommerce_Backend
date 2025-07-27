import mongoose from "mongoose";
import FormData from "../models/form.model";
import User from "../models/user.model";
import moment from "moment";
import { parseMongoError } from "../utils/errorParser";
import dotenv from "dotenv";
dotenv.config();

export const submitFormService = async (
  requestQuery: Record<string, unknown>,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const startTime: string =
      (requestQuery?.["startTime"] as string) || "0 seconds";
    const timeParts = startTime.split(" ", 2);
    const startTimeDate = moment()
      .subtract(
        moment.duration(timeParts[0], timeParts[1] as moment.DurationInputArg2),
      )
      .toDate();
    const inRecord = {
      ...requestQuery,
      startTime: startTimeDate,
    };
    const result = await FormData.create([inRecord], { session });
    let newResult;
    if (result)
      newResult = await User.findOneAndUpdate(
        { email: requestQuery?.email },
        {
          $set: {
            dateOfBirth: moment()
              .subtract(moment.duration(requestQuery?.age as string, "years"))
              .toDate(),
            gender: requestQuery?.gender,
          },
        },
        { session },
      ).exec();
    if (newResult) {
      await session.commitTransaction();
      await session.endSession();
      return {
        done: true,
        message: {
          userName: newResult?.userName,
        },
      };
    } else {
      throw new Error("Couldn't be added");
    }
  } catch (error) {
    //console.error(error)
    await session.abortTransaction();
    await session.endSession();
    return { done: false, message: parseMongoError(error) };
  }
};
