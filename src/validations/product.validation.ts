import { query } from "express"
import Joi from "joi"

export const getFilteredProductsReq = Joi.object({
    query: {
        maxNumber: Joi.number().integer().min(1)
    },
    body: Joi.object({
        searchText: Joi.string(),
        onSales: Joi.boolean(),
        type: Joi.string(),
        newArrivals: Joi.boolean(),
        minPrice: Joi.number().integer().min(0),
        maxPrice: Joi.number().integer().min(0),
        dietNeeds: Joi.array().items(Joi.string()).min(1),
        allergenFilters: Joi.array().items(Joi.string()).min(1),
    }).min(1)
})

export const addReviewReq = Joi.object({
    body: {
        productTitle: Joi.string().required(),
        rating: Joi.number().integer().min(0).max(5).required(),
        reviewText: Joi.string()
    }
})

export const addProductReq = Joi.object({
    body: {
        title: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().integer().min(0).required(),
        productType: Joi.string(),
        deliveryTime: Joi.string(),
        quantity: Joi.number().integer().min(0).required(),
        images: Joi.array().items(Joi.string()).required(),
        defaultImage: Joi.number().integer().min(0),
        ingredients: Joi.array().items(Joi.string()),
        amountsPerServing: Joi.array().items(Joi.object({
            item: Joi.string().required(),
            value: Joi.string().required(),
            valuePercent: Joi.number().min(0).max(100)
        })),
        alertMsg: Joi.string(),
    }
})

export const updateProductReq = Joi.object({
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().integer().min(0),
        productType: Joi.string(),
        deliveryTime: Joi.string(),
        quantity: Joi.number().integer().min(0),
        images: Joi.array().items(Joi.string()),
        defaultImage: Joi.number().integer().min(0),
        ingredients: Joi.array().items(Joi.string()),
        amountsPerServing: Joi.array().items(Joi.object({
            item: Joi.string().required(),
            value: Joi.string().required(),
            valuePercent: Joi.number().min(0).max(100)
        })),
        alertMsg: Joi.string(),
    }).min(2)
})

export const addStockReq = Joi.object({
    body: {
        title: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
    }
})

export const delProductReq = Joi.object({
    query: {
        productName: Joi.string().required()
    }
})