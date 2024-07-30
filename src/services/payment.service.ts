import { randomBytes } from "crypto"
import Order from "../models/order.model"
import mongoose from "mongoose"
import Product from "../models/product.model"
import { parseMongoError } from "../utils/errorParser"
import Stripe from "stripe"

const stripe = new Stripe(process.env?.STRIPE_SECRET_KEY as string)


export const addToCart = async (orderItem: { title: string, count: number }, invoiceID?: string) => {
    try {
        let customerID = "cus_QZKFdvOiQxi2Zw"
        const unitPrice = (await Product.findOne({ title: orderItem.title }, { price: 1 }))?.price
        if (!unitPrice) throw new Error("No such item exists")
        const cost = unitPrice * orderItem.count
        let invoice: Stripe.Response<Stripe.Invoice>
        if (!invoiceID) {
            invoice = await stripe.invoices.create({ customer: customerID })
        }
        else {
            invoice = await stripe.invoices.retrieve(invoiceID)
        }
        await stripe.invoiceItems.create({
            invoice: invoice.id,
            customer: invoice.customer as string,
            unit_amount: unitPrice,
            quantity: orderItem.count,
            description: orderItem.title
        })
        return { done: true, message: invoice.id }
    } catch (error) {
        console.error(error)
        return { done: false, message: parseMongoError(error) }
    }
}

export const processPayment = async (orderData: Record<string, any>) => {

    //   const transactionID = randomBytes(64).toString("base64")
    //   orderData["transactionID"] = transactionID

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const orderItems = orderData?.orderItems as [Record<string, any>]
        let sum = 0
        for (const item of orderItems) {
            sum += item?.productCount * item?.unitCost
            const result = await Product.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: -(item.productCount) } }, { session })
            if (result.modifiedCount == 0) {
                await session.abortTransaction()
                await session.endSession()
                return { done: false, message: "Possibly bad request" }
            }
        }

        //const cardToken = await stripe.paymentMethods.retrieve(orderData.paymentToken)
        const paymentMethod = (await stripe.paymentMethods.retrieve(orderData.paymentToken)).card
        const paymentIntent = await stripe.paymentIntents.create({ amount: orderData?.grandTotal * 100, currency: "pkr", payment_method: orderData.paymentToken, confirm: true, automatic_payment_methods: { enabled: true, allow_redirects: "never" } })
        //const transaction = await stripe.paymentIntents.confirm(paymentIntent.id)
        const transaction = paymentIntent
        //orderData["paymentAccountInfo"] = { accountType: paymentMethod?.brand, ID: paymentMethod. }
        const transactionID = transaction.id
        orderData["transactionID"] = transactionID
        const response = await Order.create([orderData], { session })
        if (!response) {
            throw new Error("Order not created")
        }
        await session.commitTransaction()
        await session.endSession()
        return { done: true, message: transactionID }
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        console.log(error)
        return { done: false, message: parseMongoError(error) }
    }


}
