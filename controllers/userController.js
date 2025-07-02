import userModel from "../models/userModel.js";
import express from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import validator from "validator"
import dotenv from "dotenv"
dotenv.config();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET);
}

//login
export const loginUser = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }
        const token = createToken(user._id);
        res.json({ success: true, token, user });
    } catch (error) {
        res.json({ success: false, message: "Error in login", error })
    }
};

//sign-up
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User already exists" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password should be of atleast 8 characters" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        })
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token, user: newUser });

    } catch (error) {
        res.json({ success: false, message: "Error in registering user", error });
    }
};

//logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.json({ success: false, message: "Error during logout", error });
    }
};

//getProfile
export const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        res.json({ success: true, user })
    } catch (error) {
        res.json({ success: false })
    }
};
