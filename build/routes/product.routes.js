"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const product_validation_1 = require("../validations/product.validation");
const checkConnection_1 = require("../middlewares/checkConnection");
const router = (0, express_1.Router)();
router.get("/:productName", (0, auth_1.auth)(), checkConnection_1.verifyMongoConnection, product_controller_1.getProductInfo);
router.post("/", (0, auth_1.auth)("admin"), (0, validate_1.validate)(product_validation_1.addProductReq), checkConnection_1.verifyMongoConnection, product_controller_1.addProduct);
router.put("/", (0, auth_1.auth)("admin"), (0, validate_1.validate)(product_validation_1.updateProductReq), checkConnection_1.verifyMongoConnection, product_controller_1.updateProduct);
router.post("/review", (0, auth_1.auth)(), (0, validate_1.validate)(product_validation_1.addReviewReq), checkConnection_1.verifyMongoConnection, product_controller_1.addProductReview);
router.post("/get", (0, auth_1.auth)(), (0, validate_1.validate)(product_validation_1.getFilteredProductsReq), checkConnection_1.verifyMongoConnection, product_controller_1.getProductsS);
router.patch("/addStock", (0, auth_1.auth)("admin"), (0, validate_1.validate)(product_validation_1.addStockReq), checkConnection_1.verifyMongoConnection, product_controller_1.addStock);
router.delete("/", (0, auth_1.auth)("admin"), (0, validate_1.validate)(product_validation_1.delProductReq), checkConnection_1.verifyMongoConnection, product_controller_1.delProduct);
exports.default = router;
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
