import { MongoError, MongoServerError } from "mongodb"


export const parseMongoError = (error: any | unknown) => {
    //console.error(error)
    const originalError = error as MongoError
    //console.log(originalError.name)
    if (originalError.name == "MongoServerError") {
        return parseMongoServerError(originalError as MongoServerError)
    }
    return "Something went wrong"
}

const parseMongoServerError = (error: MongoServerError) => {
    if (error.code === 11000) return parseMongoDuplicateKeyError(error)
}

const parseMongoValidationError = (error: MongoError) => {

}

const parseMongoDuplicateKeyError = (error: MongoServerError) => {
    const duplicateError = error as MongoServerError
    const keyPattern = duplicateError?.["keyPattern"]
    return "This " + Object.keys(keyPattern)[0] + " already exists"
}