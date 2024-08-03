import Order from "../models/order.model"
import mongoose from "mongoose"
import Product from "../models/product.model"
import Stripe from "stripe"

const stripe = new Stripe(process.env?.STRIPE_SECRET_KEY as string)

export const placeOrder = async (orderData: Record<string, any>, userName: string) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        {
            const orderItems = orderData?.orderItems as [Record<string, any>]
            let sum = 0
            for (const item of orderItems) {
                sum += item?.productCount * item?.unitCost
                const result = await Product.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: -(item.productCount) } }, { session })
                if (result.modifiedCount == 0) {
                    throw new Error("Possibly bad request. Insufficient inventory items")
                }
            }
            const intent = await stripe.paymentIntents.create({
                amount: sum * 100,
                currency: "usd",
                capture_method: "manual",
            })
            const result2 = await Order.create([{
                transactionID: intent.id,
                userName: userName,
                orderItems: orderData?.orderItems,
                grandTotal: sum,
                netTotal: sum
            }], { session })
            await session.commitTransaction()
            await session.endSession()
            return { done: true, message: intent.client_secret }
        }
    } catch (error) {
        console.error(error)
        await session.abortTransaction()
        await session.endSession()
        return { done: false, message: (error as Stripe.errors.StripeError).message }
    }
}

export const capturePayment = async (intentID: string) => {
    try {
        const intent = await stripe.paymentIntents.retrieve(intentID)
        await stripe.paymentIntents.capture(intentID)
        const result = await Order.updateOne({ transactionID: intentID }, { status: "succeeded" })
        if (result.matchedCount == 0) throw new Error("Invalid transaction")
        return { done: true, message: `${intentID} captured` }
    } catch (error) {
        console.error(error)
        return { done: false, message: (error as Stripe.errors.StripeError).message }
    }
}

export const cancelPayment = async (intentID: string) => {
    try {
        const intent = await stripe.paymentIntents.retrieve(intentID)
        await stripe.paymentIntents.cancel(intentID)
        const order = await Order.findOneAndUpdate({ transactionID: intentID }, { status: "cancelled" })
        for (const item of order?.orderItems as mongoose.Types.DocumentArray<any>) {
            const result = await Product.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: item.productCount } })
            if (result.modifiedCount == 0) {
                throw new Error("Something went wrong")
            }
        }
        return { done: true, message: `${intentID} cancelled` }
    } catch (error) {
        console.error(error)
        return { done: false, message: (error as Stripe.errors.StripeError).message }
    }
}