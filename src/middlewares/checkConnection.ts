import httpStatus from "http-status";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { verifyConnection } from "../services/email.service";

const uri = process.env?.MONGO_URI as string;

let mongoConnection: mongoose.Connection;

export const verifyMongoConnection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      !mongoConnection ||
      mongoConnection.readyState == mongoose.STATES.uninitialized
    )
      mongoConnection = (await mongoose.connect(uri)).connection;
    return next();
  } catch {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    return;
  }
};

export const verifyMailerConnection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await verifyConnection();
    if (result) return next();
    else throw new Error();
  } catch {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    return;
  }
};
