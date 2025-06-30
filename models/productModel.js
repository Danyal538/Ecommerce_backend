import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: [{ type: String }],
    bestSeller: { type: Boolean, required: true },
    date: { type: Number, default: () => Date.now() },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;