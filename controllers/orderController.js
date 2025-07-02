import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv"

dotenv.config();

const stripe = new Stripe(process.env.SECRET_KEY);
const placeOrder = async (req, res) => {
    try {
        const frontend_Url = "https://ecommerce-app-gqch.vercel.app"
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentMethod: "Stripe",
            payment
        })


        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 10 * 100
            },
            quantity: 1
        })
        console.log("LineItems", line_items)
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_Url}/my-orders?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_Url}/my-orders?success=false&orderId=${newOrder._id}`
        })
        res.json({ success: true, session: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in placing order", error })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            return res.json({ success: true, message: "Paid" });
        }
        else {
            await orderModel.findByIdAndUpdate(orderId, { payment: false });
            return res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error in placing order" });
    }
}

const userOrders = async (req, res) => {
    try {
        const order = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: order })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error", error })

    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error in listing orders", error });
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "ID and status are required" });
        }

        const exists = await orderModel.findById(orderId);
        if (!exists) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const updated = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        console.log("Updated Order:", updated);

        res.json({ success: true, message: "Status updated", updated });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in updating status", error });
    }
};


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };