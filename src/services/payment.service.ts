import { randomBytes } from "crypto";
import Order from "../models/order.model"
import mongoose from "mongoose";
import Product from "../models/product.model";

export const processPayment = async (orderData: Record<string, any>) => {

    const transactionID = randomBytes(64).toString("base64");
    orderData["transactionID"] = transactionID;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const orderItems = orderData?.orderItems as [Record<string, any>];
        for (const item of orderItems) {
            const result = await Product.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: -(item.productCount) } }, {session})
            if (result.modifiedCount == 0) {
                await session.abortTransaction();
                await session.endSession();
                return false;
                
            }
        }
        const response = await Order.create(orderData, {session});
        console.log("There");
        if (!response) {
            await session.abortTransaction();
            await session.endSession();
            return false;
        }
        await session.commitTransaction();
        await session.endSession();
        return transactionID;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
        return false;
    }


}