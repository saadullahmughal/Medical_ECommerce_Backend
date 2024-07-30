import express from "express"
import Product from "../models/product.model"
import Review from "../models/review.model"
import { format } from "date-fns"
import Order from "../models/order.model"
import { parseMongoError } from "../utils/errorParser"
import { truncate } from "fs/promises"

export const addProductData = async (productInfo: Record<string, any>) => {
    try {
        const result = await Product.create(productInfo)
        return { done: true }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const updateProductData = async (productTitle: string, newProductInfo: object) => {
    try {
        const result = await Product.updateOne(
            { title: productTitle },
            { $set: newProductInfo }
        )
        if (result.matchedCount == 0) return { done: false, message: "No such product exists" }
        else return { done: true }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const incrementStock = async (productTitle: string, quantity: number) => {
    try {
        const result = await Product.updateOne(
            { title: productTitle },
            { $inc: { quantity: quantity } }
        )
        if (result?.matchedCount == 0) return { done: false, message: "No such product exists" }
        else { done: true }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const getProductData = async (productTitle: string) => {
    try {
        const product = await Product.findOne({ title: productTitle })
            .select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
            .exec()
        if (!product) return { done: false, message: "No such product exists" }
        const queryResults = await Review.find({ productTitle: productTitle })
            .limit(2)
            .select({ _id: 0, productTitle: 0 })
            .exec()
        const orderCount = await Order.countDocuments({
            "orderItems.productTitle": productTitle,
        })
        const ratingStats = [
            await Review.countDocuments({ productTitle: productTitle, rating: 0 }),
            await Review.countDocuments({ productTitle: productTitle, rating: 1 }),
            await Review.countDocuments({ productTitle: productTitle, rating: 2 }),
            await Review.countDocuments({ productTitle: productTitle, rating: 3 }),
            await Review.countDocuments({ productTitle: productTitle, rating: 4 }),
            await Review.countDocuments({ productTitle: productTitle, rating: 5 }),
        ]
        const reviewCount = ratingStats.reduce(
            (total, element, index) => total + element,
            0
        )
        const totalStars = ratingStats.reduce(
            (total, element, index) => total + element * index,
            0
        )
        const avgRating = reviewCount != 0 ? totalStars / reviewCount : 0
        const reviews = queryResults.map((element) => {
            let result: Record<string, any> = {}
            for (const [key, value] of Object.entries(element.toObject())) {
                if (key != "reviewTime") result[key] = value
                else result["reviewDate"] = format(element.reviewTime, "dd MMMM yyyy")
            }
            return result
        })
        let finalResult = {
            ...product.toObject(),
            orderCount: orderCount,
            reviews: reviews,
            reviewCount: reviewCount,
            ratingStats: ratingStats,
            avgRating: avgRating,
        }
        return { done: true, message: finalResult }

    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const getProducts = async (maxNumber: number, filters: Record<string, any>) => {
    const { searchText, type, newArrivals, minPrice, maxPrice, dietNeeds, allergenFilters } = filters
    let onSales = filters?.onSales
    if (onSales != false && !onSales) onSales = true

    let filterQuery: Record<string, any> = { "price": { $gte: 0 } }
    if (type) filterQuery['productType'] = type
    if (onSales) filterQuery['quantity'] = { $gt: 0 }
    if (minPrice) filterQuery['price']['$gte'] = minPrice
    if (maxPrice) filterQuery['price']['$lte'] = maxPrice
    if (dietNeeds) filterQuery['amountsPerServing.item'] = { $all: dietNeeds }
    if (allergenFilters) filterQuery['tags'] = { $all: allergenFilters }
    //console.log(filterQuery)
    if (searchText) filterQuery['title'] = { $regex: "\\b(?:" + searchText + ")", $options: "i" }

    try {
        const results = await Product.find(filterQuery).limit(maxNumber).select({ _id: false, title: true, price: true, images: 1, defaultImage: 1, quantity: 1, description: true, shortTitle: true, unit: true }).exec()
        if (!results) return { done: true, message: [] }
        const responses = results.map((doc) => {
            const element = doc.toObject()
            const validImgData = element.images.length > element.defaultImage
            return {
                ...element,
                defaultImage: validImgData ? element.images[element.defaultImage] : null
            }
        })
        return { done: true, message: responses }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const addReview = async (reviewData: Record<string, any>) => {
    try {
        const results = await Review.create(reviewData)
        if (!results) throw new Error("Unable to create review")
        else return { done: true }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}

export const deleteProductData = async (productName: string) => {
    try {
        const queryResults = await Product.deleteOne({ title: productName })
        if (queryResults.deletedCount == 1) {
            return { done: true }
        } else {
            return { done: false, message: "No such product exists" }
        }
    } catch (error) {
        return { done: false, message: parseMongoError(error) }
    }
}