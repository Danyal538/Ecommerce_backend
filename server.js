import express from "express";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cors from "cors"
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = 4000

connectDb();
app.get("/", (req, res) => {
    res.send("API working")
})

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["https://ecommerce-app-gqch.vercel.app", "https://ecommerce-app-admin-panel.vercel.app"],
    credentials: true,
    allowedHeaders: ["Content-type", "Authorization"]

}));

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use('/images', express.static("uploads"));
app.use("/api/order", orderRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})