import { Router } from "express"
import {
    getProductInfo,
    addProduct,
    updateProduct,
    addProductReview,
    getProductsS,
    addStock,
    delProduct
} from "../controllers/product.controller"
import { auth } from "../middlewares/auth"
import { validate } from "../middlewares/validate"
import { addProductReq, addReviewReq, addStockReq, delProductReq, getFilteredProductsReq, updateProductReq } from "../validations/product.validation"

const router = Router()

router.get("/:productName", auth(), getProductInfo)
router.post("/", auth("admin"), validate(addProductReq), addProduct)
router.put("/", auth("admin"), validate(updateProductReq), updateProduct)
router.post("/review", auth(), validate(addReviewReq), addProductReview)
router.post("/get", auth(), validate(getFilteredProductsReq), getProductsS)
router.patch("/addStock", auth("admin"), validate(addStockReq), addStock)
router.delete("/", auth("admin"), validate(delProductReq), delProduct)

export default router

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product retrieval
 */

/**
 * @swagger
 * /product/{productName}:
 *   get:
 *     summary: Retreive details for product page
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productName
 *         required: true
 *         schema:
 *           type: string
 *           example: Organic Carrots
 *         description: The name of desired product
 *
 *     responses:
 *       "200":
 *         description: Data fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: Organic Carrots
 *                 price:
 *                   type: number
 *                   example: 50
 *                 productType:
 *                   type: string
 *                   example: Vegetables
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Not implemented yet
 *                 defaultImage:
 *                   type: number
 *                   example: 0
 *                   description: Index of default image in images array
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Carrots
 *                 servingPerContainer:
 *                   type: number
 *                   example: 3.5
 *                 servingSize:
 *                   type: string
 *                   example: 1/2 cup (120g)
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Organic
 *                 amountsPerServing:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       item:
 *                         type: string
 *                         example: Total Fat
 *                       value:
 *                         type: string
 *                         example: 10g
 *                       valuePercent:
 *                         type: number
 *                         example: 12
 *                 alertMsg:
 *                   type: string
 *                   example: Excess amount can cause overloading of vitamin A
 *                   description: Something to show bold like allergy notices
 *                 orderCount:
 *                   type: number
 *                   example: 250
 *                   description: Number of orders with this product
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userName:
 *                         type: string
 *                         example: James Jones
 *                       rating:
 *                         type: number
 *                         example: 4
 *                       reviewText:
 *                         type: string
 *                         example: Very satisfactory food quality
 *                       reviewDate:
 *                         type: string
 *                         example: 03 July 2024
 *                         description: Review date
 *
 *                 reviewCount:
 *                   type: number
 *                   example: 25
 *                   description: Number of review on this product
 *                 avgRating:
 *                   type: number
 *                   example: 4.5
 *                   description: Average user rating about this product (Out of 5)
 *                 ratingStats:
 *                   type: array
 *                   items:
 *                     type: number
 *                     example: 5
 *                   minItems: 6
 *                   maxItems: 6
 *                   description: Number of reviews classified according to rating (Array index means number of stars)
 *
 *
 *       "417":
 *         description: Failed to fetch the details (Product may not exist)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: N/A
 *
 */
