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
            invoice = await stripe.invoices.create({ customer: customerID, description: "Medical E-Commerce" })
        }
        else {
            invoice = await stripe.invoices.retrieve(invoiceID)
        }
        let itemID
        for (const item of invoice.lines.data) {
            if (item.description == orderItem.title) {
                itemID = item.id
                break
            }
        }
        if (!itemID)
            await stripe.invoiceItems.create({
                invoice: invoice.id,
                customer: invoice.customer as string,
                unit_amount: unitPrice * 100,
                quantity: orderItem.count,
                description: orderItem.title
            })
        else await stripe.invoiceItems.update(itemID, { quantity: orderItem.count })
        invoice = await stripe.invoices.retrieve(invoice.id)
        return { done: true, message: invoice.id }
    } catch (error) {
        console.error(error)
        return { done: false, message: (error as Stripe.errors.StripeError).message }
    }
}

export const processPaymentv2 = async (orderData: Record<string, any>) => {
    try {
        const { invoiceID, paymentMethodID } = orderData
        const customerID = (await stripe.invoices.retrieve(invoiceID)).customer as string
        await stripe.paymentMethods.attach(paymentMethodID, { customer: customerID })
        //await stripe.invoices.update(invoiceID, { default_payment_method: paymentMethodID })
        const result = await stripe.invoices.pay(invoiceID, { payment_method: paymentMethodID })
        stripe.invoices.update(invoiceID, {})
        //const result = await stripe.invoices.sendInvoice(invoiceID)
        return { done: true, message: result.receipt_number }
    } catch (error) {
        console.error(error)
        return { done: false, message: (error as Stripe.errors.StripeError).message }
    }
}

export const processPayment = async (orderData: Record<string, any>) => {

    const transactionID = randomBytes(64).toString("base64")
    orderData["transactionID"] = transactionID

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

        // const cardToken = await stripe.paymentMethods.retrieve(orderData.paymentToken)
        // const paymentMethod = (await stripe.paymentMethods.retrieve(orderData.paymentToken)).card
        // const paymentIntent = await stripe.paymentIntents.create({ amount: orderData?.grandTotal * 100, currency: "pkr", payment_method: orderData.paymentToken, confirm: true, automatic_payment_methods: { enabled: true, allow_redirects: "never" } })
        // const transaction = await stripe.paymentIntents.confirm(paymentIntent.id)
        // const transaction = paymentIntent
        // orderData["paymentAccountInfo"] = { accountType: paymentMethod?.brand, ID: paymentMethod. }
        // const transactionID = transaction.id
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
