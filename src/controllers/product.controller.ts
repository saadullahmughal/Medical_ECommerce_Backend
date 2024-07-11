import express from "express";
import httpStatus from "http-status";
import { getProductData, addProductData, updateProductData, addReview, getProducts, incrementStock } from "../services/product.service";
import { getStoredUserData } from "../middlewares/auth";

export const addProduct = async (req: express.Request, res: express.Response) => {
    const productDetails = req.body;
    try {
        const response = await addProductData(productDetails);
        if (response) {
            res.status(httpStatus.CREATED).send(response);
        } else {
            res.status(httpStatus.EXPECTATION_FAILED).send("Request failed");
        }
    } catch (error) {
        console.error(error)
        res.status(httpStatus.EXPECTATION_FAILED).send("Request failed");
    }
};

export const updateProduct = async (req: express.Request, res: express.Response) => {
    const productTitle = req.body?.title;
    const newProductDetails = req.body;
    try {
        const response = await updateProductData(
            productTitle,
            newProductDetails
        );
        if (response) {
            res.status(httpStatus.CREATED).send("Updated");
        } else {
            res.status(httpStatus.EXPECTATION_FAILED).send("Request failed");
        }
    } catch (error) {
        console.error(error)
        res.status(httpStatus.EXPECTATION_FAILED).send("Request failed");
    }
};


export const getProductInfo = async (req: express.Request, res: express.Response) => {
    const reqParam = req.params?.["productName"];
    try {
        const response = await getProductData(reqParam);
        if (!response)
            res.status(httpStatus.EXPECTATION_FAILED).send("N/A");
        else res.status(httpStatus.OK).send(response);
    } catch (error) {
        console.error(error);
        res.status(httpStatus.EXPECTATION_FAILED).send("N/A");
    }
};

export const addProductReview = async (req: express.Request, res: express.Response) => {
    const reviewDetails = req.body;
    try {
        const userName = getStoredUserData(req)?.userName
        const response = await addReview({ ...reviewDetails, userName: userName });
        if (response) {
            res.status(httpStatus.CREATED).send("Review Posted");
        } else {
            res.status(httpStatus.EXPECTATION_FAILED).send("Request failed");
        }
    } catch (error) {
        console.error(error)
        res.status(httpStatus.EXPECTATION_FAILED).send("Request failed");
    }
}

export const getProductsS = async (req: express.Request, res: express.Response) => {
    try {
        const queryParam = req.query?.maxNumber as string;
        const maxNumber = parseInt(queryParam || "4");
        const filters = req.body as Record<string, any>;
        const response = await getProducts(maxNumber, filters);
        res.status(httpStatus.OK).send(response);
    } catch (error) {
        console.error(error);
        res.sendStatus(httpStatus.EXPECTATION_FAILED);
    }
}

export const addStock = async (req: express.Request, res: express.Response) => {
    try {
        const { title, quantity } = req.body
        const response = await incrementStock(title, quantity);
        res.status(httpStatus.OK).send(response);
    } catch (error) {
        console.error(error);
        res.sendStatus(httpStatus.EXPECTATION_FAILED);
    }
}