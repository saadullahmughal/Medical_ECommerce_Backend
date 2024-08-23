import Order from "../models/order.model"
import mongoose from "mongoose"
import Product from "../models/product.model"
import Stripe from "stripe"
import { parseMongoError } from "../utils/errorParser"
import { ObjectId } from "mongodb"

const stripe = new Stripe(process.env?.STRIPE_SECRET_KEY as string)

export const addToCart = async (itemData: { item: string, count: number, cartID?: string }, userName: string) => {
    try {
        let overflow = false
        const findResult = await Product.findOne({ title: itemData.item }, { price: true, quantity: true })
        if (!findResult) throw new Error("Invalid item")
        const price = findResult?.price
        if (!itemData.cartID) {
            if (findResult.quantity < itemData.count) {
                overflow = true
                itemData.count = findResult.quantity
            }
            const intent = await stripe.paymentIntents.create({
                amount: itemData.count * price * 100,
                currency: "usd",
                capture_method: "manual",
            })
            const addedResults = await Order.create({
                transactionID: intent.id, orderItems: [{
                    productTitle: itemData.item,
                    productCount: itemData.count,
                    unitCost: price,
                }],
                grandTotal: itemData.count * price,
                netTotal: itemData.count * price,
                userName: userName,
            })
            return {
                done: true,
                message: { cartID: itemData.cartID, overflow: overflow }
            }
        } else {
            const fetchedData = await Order.findById(itemData.cartID)
            if (!fetchedData) throw new Error("Invalid Cart ID")
            if (fetchedData.status == "succeeded") throw new Error("Invalid Cart ID")
            const matchedItemsInCart = fetchedData.orderItems.filter((item) => {
                if (item.productTitle == itemData.item) return item
            })
            if (matchedItemsInCart.length == 0) {
                if (findResult.quantity < itemData.count) {
                    overflow = true
                    itemData.count = findResult.quantity
                }
                await Order.findByIdAndUpdate(itemData.cartID, {
                    $push: {
                        orderItems: {
                            productTitle: itemData.item,
                            productCount: itemData.count,
                            unitCost: price,
                        }
                    }
                })
            } else {
                if (findResult.quantity < itemData.count + matchedItemsInCart[0].productCount) {
                    overflow = true
                    itemData.count = findResult.quantity - matchedItemsInCart[0].productCount
                }
                await Order.updateOne({ _id: new ObjectId(itemData.cartID), "orderItems.productTitle": itemData.item }, { $inc: { "orderItems.$.productCount": itemData.count } })
            }
            const result = await Order.findByIdAndUpdate(itemData.cartID, { $inc: { grandTotal: price * itemData.count, netTotal: price * itemData.count, } })
            if (!result) throw new Error("Couldn't update")
            await stripe.paymentIntents.update(fetchedData.transactionID, { amount: result?.netTotal * 100 })
            return { done: true, message: { cartID: itemData.cartID, overflow: overflow } }
        }
    } catch (error) {
        console.error(error)
        return { done: false, message: parseMongoError(error) }
    }
}

export const getCart = async (cartID: string, userName: string) => {
    try {
        const cart = await Order.findOne({ _id: new ObjectId(cartID), userName: userName })
        if (!cart) throw new Error("Invalid cart ID")
        let results = []
        for (const index in cart.orderItems) {
            const itemData = cart.orderItems[index]
            const fetchedData = await Product.findOne({ title: itemData.productTitle })
            if (!fetchedData) throw new Error("Product Catalog changed. Reload the page")
            else {
                results.push({ item: itemData.productTitle, count: itemData.productCount, stock: fetchedData.quantity, defaultImage: fetchedData.images[fetchedData.defaultImage] || null, price: fetchedData.price })
            }
        }
        return { done: true, message: results }
    } catch (error) {
        console.error(error)
        return { done: false, message: parseMongoError(error) }
    }
}

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

export const getIntentClientSecret = async (cartID: string, userName: string) => {
    try {
        const cart = await Order.findOne({ _id: new ObjectId(cartID), userName: userName }, { transactionID: true })
        if (!cart) throw new Error("Invalid cart ID")
        const intent = await stripe.paymentIntents.retrieve(cart.transactionID)
        return { done: true, message: intent.client_secret }
    } catch (error) {
        console.error(error)
        return { done: false, message: parseMongoError(error) }
    }

}

export const capturePayment = async (intentID: string) => {
    try {
        const intent = await stripe.paymentIntents.retrieve(intentID)
        await stripe.paymentIntents.capture(intentID)
        const result = await Order.findOneAndUpdate({ transactionID: intentID }, { status: "succeeded" })
        if (!result) throw new Error("Invalid transaction")
        for (const item of result?.orderItems) {
            const result = await Product.updateOne({ title: item.productTitle, quantity: { $gte: item.productCount } }, { $inc: { quantity: -(item.productCount) } })
            if (result.modifiedCount == 0) {
                throw new Error("Possibly bad request. Insufficient inventory items")
            }
        }
        //if (result.matchedCount == 0) throw new Error("Invalid transaction")
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