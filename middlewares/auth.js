import jwt from "jsonwebtoken"


const authMiddleware = async (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.json({ success: false, message: "Not Authorized User Login again" })
    }
    try {
        console.log("SECRET USED FOR VERIFY:", process.env.SECRET);
        const decoded = jwt.verify(token, process.env.SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error", error })
    }

}

export default authMiddleware;