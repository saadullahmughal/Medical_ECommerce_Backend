import { randomBytes } from "crypto"
import Order from "../models/order.model"
import mongoose from "mongoose"
import Product from "../models/product.model"
import { parseMongoError } from "../utils/errorParser"

export const processPayment = async (orderData: Record<string, any>) => {

    const transactionID = randomBytes(64).toString("base64")
    orderData["transactionID"] = transactionID

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const orderItems = orderData?.orderItems as [Record<string, any>]
        for (const item of orderItems) {
            const result = await Product.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: -(item.productCount) } }, { session })
            if (result.modifiedCount == 0) {
                await session.abortTransaction()
                await session.endSession()
                return { done: false, message: "Possibly bad request" }
            }
        }
        const response = await Order.create([orderData], { session })
        if (!response) {
            await session.abortTransaction()
            await session.endSession()
            throw new Error("Order not created")
        }
        await session.commitTransaction()
        await session.endSession()
        return { done: true, message: transactionID }
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        return { done: false, message: parseMongoError(error) }
    }


}