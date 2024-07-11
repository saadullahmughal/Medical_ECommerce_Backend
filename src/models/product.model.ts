import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String },
        price: { type: Number, min: 1, required: true },
        productType: { type: String },
        deliveryTime: { type: String },
        quantity: { type: Number, min: 0, required: true },
        images: { type: [String], required: true },
        defaultImage: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        ingredients: { type: [String] },
        servingsPerContainer: { type: Number },
        servingSize: { type: String },
        tags: { type: [String] },
        amountsPerServing: {
            type: [{
                item: { type: String, unique: true, required: true },
                value: { type: String, required: true },
                valuePercent: { type: Number },
                _id: false,
            }],
        },
        alertMsg: { type: String },
    },
    { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

const testSchema = async () => {
    await mongoose.connect(
        "mongodb+srv://saadullah:saad2003@devminified.hiye9xh.mongodb.net/medicalECommerce?retryWrites=true&w=majority&appName=Devminified"
    );
    console.log("Connected");
    await Product.create({
        title: "Organic Carrots",
        price: 50,
        quantity: 10,
        images: [null],
        defaultImage: 0,
        productType: "Vegetables",
        amountsPerServing: [
            { item: "Calories", value: "40" },
            { item: "Total Fat", value: "10g", valuePercent: 12 },
            { item: "Sodium", value: "5mg", valuePercent: 37 },
            { item: "Protein", value: "2g", valuePercent: 55 },
            { item: "Iron", value: "1.7mg", valuePercent: 23 },
        ],
        tags: ["Vegtables", "Low Fat", "Organic"],
        servingSize: "1/2 cup (120g)",
        servingsPerContainer: 3.5,
        alertMsg: "Excess amount can cause overloading of vitamin A",
    });
    console.log("Success");
};

//testSchema();

export default Product;