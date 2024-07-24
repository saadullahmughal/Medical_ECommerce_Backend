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
exports.submitFormService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const form_model_1 = __importDefault(require("../models/form.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const moment_1 = __importDefault(require("moment"));
const errorParser_1 = require("../utils/errorParser");
require("dotenv").config();
const submitFormService = (requestQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const startTime = (requestQuery === null || requestQuery === void 0 ? void 0 : requestQuery["startTime"]) || "0 seconds";
        const timeParts = startTime.split(" ", 2);
        let startTimeDate = (0, moment_1.default)().subtract(moment_1.default.duration(timeParts[0], timeParts[1])).toDate();
        let inRecord = Object.assign(Object.assign({}, requestQuery), { startTime: startTimeDate });
        let result = yield form_model_1.default.create([inRecord], { session });
        let newResult;
        if (result)
            newResult = yield user_model_1.default.findOneAndUpdate({ email: requestQuery === null || requestQuery === void 0 ? void 0 : requestQuery.email }, {
                $set: {
                    dateOfBirth: (0, moment_1.default)().subtract(moment_1.default.duration(requestQuery === null || requestQuery === void 0 ? void 0 : requestQuery.age, "years")).toDate(),
                    gender: requestQuery === null || requestQuery === void 0 ? void 0 : requestQuery.gender,
                },
            }, { session }).exec();
        if (newResult) {
            yield session.commitTransaction();
            yield session.endSession();
            return {
                done: true, message: {
                    userName: newResult === null || newResult === void 0 ? void 0 : newResult.userName,
                }
            };
        }
        else {
            throw new Error("Couldn't be added");
        }
    }
    catch (error) {
        //console.error(error)
        yield session.abortTransaction();
        yield session.endSession();
        return { done: false, message: (0, errorParser_1.parseMongoError)(error) };
    }
});
exports.submitFormService = submitFormService;
