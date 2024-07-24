"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delProduct = exports.addStock = exports.getProductsS = exports.addProductReview = exports.getProductInfo = exports.updateProduct = exports.addProduct = void 0;
const http_status_1 = __importDefault(require("http-status"));
const product_service_1 = require("../services/product.service");
const auth_1 = require("../middlewares/auth");
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDetails = req.body;
    const response = yield (0, product_service_1.addProductData)(productDetails);
    if (response.done) {
        res.status(http_status_1.default.CREATED).send(Object.assign(Object.assign({}, response), { message: "Product added" }));
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productTitle = (_a = req.body) === null || _a === void 0 ? void 0 : _a.title;
    const newProductDetails = req.body;
    const response = yield (0, product_service_1.updateProductData)(productTitle, newProductDetails);
    if (response.done) {
        res.status(http_status_1.default.CREATED).send(Object.assign(Object.assign({}, response), { message: "Updated successfully" }));
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.updateProduct = updateProduct;
const getProductInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const reqParam = (_a = req.params) === null || _a === void 0 ? void 0 : _a["productName"];
    const response = yield (0, product_service_1.getProductData)(reqParam);
    if (!response.done)
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    else
        res.status(http_status_1.default.OK).send(response);
});
exports.getProductInfo = getProductInfo;
const addProductReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const reviewDetails = req.body;
    const userName = (_a = (0, auth_1.getStoredUserData)(req)) === null || _a === void 0 ? void 0 : _a.userName;
    const response = yield (0, product_service_1.addReview)(Object.assign(Object.assign({}, reviewDetails), { userName: userName }));
    if (response.done) {
        res.status(http_status_1.default.CREATED).send(Object.assign(Object.assign({}, response), { message: "Review Posted" }));
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.addProductReview = addProductReview;
const getProductsS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const queryParam = (_a = req.query) === null || _a === void 0 ? void 0 : _a.maxNumber;
    const maxNumber = parseInt(queryParam || "4");
    const filters = req.body;
    const response = yield (0, product_service_1.getProducts)(maxNumber, filters);
    if (response.done)
        res.status(http_status_1.default.OK).send(response);
    else
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
});
exports.getProductsS = getProductsS;
const addStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, quantity } = req.body;
    const response = yield (0, product_service_1.incrementStock)(title, quantity);
    if (response === null || response === void 0 ? void 0 : response.done)
        res.status(http_status_1.default.OK).send(response);
    else
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
});
exports.addStock = addStock;
const delProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productName = (_a = req.query) === null || _a === void 0 ? void 0 : _a.productName;
    const response = yield (0, product_service_1.deleteProductData)(productName);
    if (response.done) {
        res.status(http_status_1.default.OK).send(response);
    }
    else {
        res.status(http_status_1.default.EXPECTATION_FAILED).send(response);
    }
});
exports.delProduct = delProduct;
