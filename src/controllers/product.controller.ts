import express from "express"
import httpStatus from "http-status"
import { getProductData, addProductData, updateProductData, addReview, getProducts, incrementStock, deleteProductData } from "../services/product.service"
import { getStoredUserData } from "../middlewares/auth"

export const addProduct = async (req: express.Request, res: express.Response) => {
    const productDetails = req.body
    const response = await addProductData(productDetails)
    if (response.done) {
        res.status(httpStatus.CREATED).send({ ...response, message: "Product added" })
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response)
    }
}

export const updateProduct = async (req: express.Request, res: express.Response) => {
    const productTitle = req.body?.title
    const newProductDetails = req.body
    const response = await updateProductData(
        productTitle,
        newProductDetails
    )
    if (response.done) {
        res.status(httpStatus.CREATED).send({ ...response, message: "Updated successfully" })
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response)
    }
}


export const getProductInfo = async (req: express.Request, res: express.Response) => {
    const reqParam = req.params?.["productName"]
    const response = await getProductData(reqParam)
    if (!response.done)
        res.status(httpStatus.EXPECTATION_FAILED).send(response)
    else res.status(httpStatus.OK).send(response)
}

export const addProductReview = async (req: express.Request, res: express.Response) => {
    const reviewDetails = req.body
    const userName = getStoredUserData(req)?.userName
    const response = await addReview({ ...reviewDetails, userName: userName })
    if (response.done) {
        res.status(httpStatus.CREATED).send({ ...response, message: "Review Posted" })
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response)
    }
}

export const getProductsS = async (req: express.Request, res: express.Response) => {
    const queryParam = req.query?.maxNumber as string
    const maxNumber = parseInt(queryParam || "4")
    const filters = req.body as Record<string, any>
    const response = await getProducts(maxNumber, filters)
    if (response.done) res.status(httpStatus.OK).send(response)
    else res.status(httpStatus.EXPECTATION_FAILED).send(response)
}

export const addStock = async (req: express.Request, res: express.Response) => {
    const { title, quantity } = req.body
    const response = await incrementStock(title, quantity)
    if (response?.done)
        res.status(httpStatus.OK).send(response)
    else res.status(httpStatus.EXPECTATION_FAILED).send(response)
}

export const delProduct = async (req: express.Request, res: express.Response) => {
    const productName = req.query?.productName as string
    const response = await deleteProductData(productName)
    if (response.done) {
        res.status(httpStatus.OK).send(response)
    } else {
        res.status(httpStatus.EXPECTATION_FAILED).send(response)
    }
}