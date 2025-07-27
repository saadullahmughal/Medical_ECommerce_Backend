import { JwtPayload, sign, verify } from "jsonwebtoken";
import { StringValue } from "ms";
import dotenv from "dotenv";
dotenv.config();

const tokenSign = process.env?.JWT_TOKEN_SIGNATURE || "";

export const genToken = function (
  payload: object,
  expires: StringValue | number | undefined,
): string | null {
  try {
    console.log("Expiry in ", expires);
    return sign(payload, tokenSign, { expiresIn: expires });
  } catch {
    console.error("Token generation failed");
    return null;
  }
};

export const getTokenData = (token: string) => {
  try {
    const payload = verify(token, tokenSign);
    //console.log(payload)
    return payload as JwtPayload;
  } catch {
    return {};
  }
};

export const verifyToken = function (
  token: string,
  ignoreExpiry?: boolean,
): boolean {
  try {
    //if (!ignoreExpiry) ignoreExpiry = false
    verify(token, tokenSign, { ignoreExpiration: ignoreExpiry });
    return true;
  } catch {
    return false;
  }
};
