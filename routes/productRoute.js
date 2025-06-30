import express from "express";
import multer from "multer";
import { addProduct, allProductList, getProductById, removeProduct, updateProduct } from "../controllers/productController.js";
import authMiddleware from "../middlewares/auth.js";

const productRouter = express.Router();
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({ storage: storage });

productRouter.post('/add', authMiddleware, upload.array('image', 4), addProduct);
productRouter.get('/list', allProductList);
productRouter.post('/remove', authMiddleware, removeProduct);
productRouter.post('/update', authMiddleware, updateProduct);
productRouter.get("/getProduct/:id", getProductById);

export default productRouter;