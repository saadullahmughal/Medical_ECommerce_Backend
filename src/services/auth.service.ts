import httpStatus from "http-status"
import mongoose from "mongoose"
import User from "../models/user.model"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { genToken, getTokenData, verifyToken } from "../utils/token"
import RefreshTokens from "../models/refreshToken.model"
import { sendResetLink } from "./email.service"
import FormData from "../models/form.model"
import { MongoError, MongoServerError } from "mongodb"
import { parseMongoError } from "../utils/errorParser"
require("dotenv").config()

const saltRounds = 12
const salt = process.env?.BCRYPT_SALT || ""

export const genHash = (text: string) => bcrypt.hashSync(text, salt)

export const signUpService = async (reqBody: Record<string, any>) => {
    try {
        let record = {
            ...reqBody,
            password: bcrypt.hashSync(reqBody?.password, salt),
        }
        const result = await User.create(record)
        return { done: true }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const logInService = async (reqBody: Record<string, any>) => {
    try {
        let record = {
            password: bcrypt.hashSync(reqBody?.password, salt),
            userName: reqBody?.userName,
        }
        const userFound = await User.findOne(record, { createdAt: false, updatedAt: false, password: false, _id: false, __v: false })
        if (!userFound) return { done: false, reason: "Invalid credentials" }
        const tokenPayload = {
            ...userFound.toObject(),
        } as Record<string, any>
        //delete tokenPayload["password"]
        let refreshToken = genToken(
            { uid: tokenPayload?.userName },
            "300d"
        )
        await RefreshTokens.create({ token: refreshToken })
        let token = genToken(tokenPayload, 3600)?.toString()
        return { done: true, userData: tokenPayload, access: token || "", refresh: refreshToken || "" }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}


export const logOutService = async (token: string) => {
    try {
        const deleteResults = await RefreshTokens.deleteOne({ token: token })
        if (deleteResults.deletedCount != 0)
            return { done: true }
        else return { done: false, message: "Invalid Request" }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const forgotPasswordService = async (reqBody: Record<string, any>) => {
    try {
        const user = await User.findOne({ userName: reqBody?.userName })
        console.log(1)
        if (!user) return { done: false, message: "No such user exists" }
        else {
            console.log("Found")
            const result = await sendResetLink(user?.email)
            return { done: true }
        }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const resetPasswordService = async (reqBody: Record<string, any>) => {
    try {
        const { token, password } = reqBody
        if (!verifyToken(token)) return { done: false, message: "Invalid token" }
        const payload = getTokenData(token)
        const passHash = genHash(password)
        const updateResults = await User.updateOne(
            { email: payload?.id },
            { $set: { password: passHash } }
        )
        if (updateResults.matchedCount != 0) return { done: true }
        else return { done: false, message: "Invalid token" }
    } catch (error) {
        return { done: false, reason: parseMongoError(error) }
    }
}

export const refreshTokenService = async (token: string) => {
    try {
        if (!verifyToken(token)) return { done: false, message: "Invalid token" }
        let tokenPayload = getTokenData(token)
        if (!tokenPayload?.uid) return { done: false, message: "Invalid token" }
        const tokenFound = await RefreshTokens.findOne({ token: token })
        if (!tokenFound) return { done: false, message: "Invalid token" }
        let userName = tokenPayload?.uid
        const userFound = await User.findOne({ userName: userName })
        if (userFound) {
            let newTokenPayload = { ...userFound?.toObject() }
            let newRefreshToken = genToken(
                { uid: newTokenPayload?.email },
                "300d"
            )
            await RefreshTokens.findOneAndUpdate({ token: token }, { token: newRefreshToken })
            let newAccessToken = genToken(newTokenPayload, 120)
            return { done: true, access: newAccessToken, refresh: newRefreshToken }
        } else {
            return { done: false, message: "Invalid token" }
        }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}


export const changePassword = async (userName: string, oldPassword: string, newPassword: string) => {
    try {
        const updated = await User.updateOne({ userName: userName, password: genHash(oldPassword) }, { password: genHash(newPassword) }).exec()
        if (updated.matchedCount == 0) return { done: false, message: "Something went wrong" }
        else return { done: true }
    } catch (error) {
        console.error(error)
        return { done: false, message: parseMongoError(error) }
    }
}

export const alterEmail = async (oldEmail: string, newEmail: string) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        let updated = await User.updateOne({ email: oldEmail }, { email: newEmail }, { session }).exec()
        if (updated.matchedCount == 0) throw new Error("Something went wrong")
        updated = await FormData.updateOne({ email: oldEmail }, { email: newEmail }, { session }).exec()
        if (updated.matchedCount == 0) throw new Error("Something went wrong")
        await session.commitTransaction()
        await session.endSession()
        return { done: true }
    } catch (error) {
        console.error(error)
        await session.abortTransaction()
        await session.endSession()
        return { done: false, message: parseMongoError(error) }
    }
}
