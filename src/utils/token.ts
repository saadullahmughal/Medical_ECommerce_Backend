import { JwtPayload, sign, verify } from "jsonwebtoken"
require("dotenv").config()

const tokenSign = process.env?.JWT_TOKEN_SIGNATURE || ""


export const genToken = function (payload: object, expires: string | number | undefined): string | null {
    try {
        return sign(payload, tokenSign, { expiresIn: expires })
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getTokenData = (token: string) => {
    try {
        let payload = verify(token, tokenSign)
        //console.log(payload)
        return payload as JwtPayload
    } catch (error) {
        return {}
    }
}

export const verifyToken = function (token: string, ignoreExpiry?: boolean): boolean {
    try {
        //if (!ignoreExpiry) ignoreExpiry = false
        let payload = verify(token, tokenSign, { ignoreExpiration: ignoreExpiry })
        return true
    } catch (error) {
        return false
    }
}

