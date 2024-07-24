"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMongoError = void 0;
const parseMongoError = (error) => {
    //console.error(error)
    const originalError = error;
    //console.log(originalError.name)
    if (originalError.name == "MongoServerError") {
        return parseMongoServerError(originalError);
    }
    return "Something went wrong";
};
exports.parseMongoError = parseMongoError;
const parseMongoServerError = (error) => {
    if (error.code === 11000)
        return parseMongoDuplicateKeyError(error);
};
const parseMongoValidationError = (error) => {
};
const parseMongoDuplicateKeyError = (error) => {
    const duplicateError = error;
    const keyPattern = duplicateError === null || duplicateError === void 0 ? void 0 : duplicateError["keyPattern"];
    return "This " + Object.keys(keyPattern)[0] + " already exists";
};
