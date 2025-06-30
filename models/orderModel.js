import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: {
        firstName: { type: String, required: true },
        lastName: { type: String },
        street: { type: String },
        city: { type: String, required: true },
        state: { type: String},
        country: { type: String, required: true },
        zipCode: {type: Number}
    },
    date: { type: Date, default: () => Date.now() },
    status: { type: String, default: "Order Placed" },
    payment: { type: Boolean, default: false }
})

console.log("✅ Order schema loaded, address field type:", orderSchema.path('address.street').instance);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;