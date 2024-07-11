import httpStatus from "http-status";
import mongoose from "mongoose";
import User from "../models/user.model";
import FormData from "../models/form.model";
import { genHash } from "./auth.service";

export const getUserData = async (userName: string) => {
    try {
        const userFound = await User.findOne({ userName: userName }).select({ password: 0 }).exec();
        if (!userFound) return null;
        else {
            const otherDetails = await FormData.findOne({ email: userFound.email }).exec();
            if (!otherDetails) return null;
            else return { ...userFound.toObject(), ...otherDetails.toObject() };
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const changePassword = async (userName: string, oldPassword: string, newPassword: string) => {
    try {
        const updated = await User.updateOne({ userName: userName, password: genHash(oldPassword) }, { password: genHash(newPassword) }).exec();
        if (updated.matchedCount == 0) throw new Error("Wrong password")
        else return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export const updateUserData = async (userName: string, userData: Record<string, any>) => {
    try {
        const updated = await User.updateOne({ userName: userName }, userData)
        if (updated.matchedCount == 0) throw new Error("No such user exists")
        else return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export const alterEmail = async (oldEmail: string, newEmail: string) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        let updated = await User.updateOne({ email: oldEmail }, { email: newEmail }, {session}).exec();
        if (updated.matchedCount == 0) throw new Error("Something went wrong")
        updated = await FormData.updateOne({email: oldEmail}, {email: newEmail}, {session}).exec()
        if (updated.matchedCount == 0) throw new Error("Something went wrong")
        await session.commitTransaction()
        await session.endSession()
        return true
    } catch (error) {
        console.error(error)
        await session.abortTransaction()
        await session.endSession()
        return false
    }
}