import { config } from "../../config";
import { userModel } from "../database";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { response } from "express";
import { apiResponse } from "./constant";
import { responseMessage } from "../helper";


const jwt_token_secret = config.JWT_TOKEN_SECRET

const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

export const getUniqueOtp = async () => {
    let otp;
    let isUnique = false;

    while (!isUnique) {
        otp = generateOtp(); // Generate a 6-digit OTP
        const isAlreadyAssign = await userModel.findOne({ otp });
        if (!isAlreadyAssign) {
            isUnique = true; // Exit the loop if the OTP is unique
        }
    }

    return otp;
};

export const generateHash = async (password = '') => {
    const salt = await bcryptjs.genSaltSync(10)
    const hashPassword = await bcryptjs.hash(password, salt)
    return hashPassword
}

export const compareHash = async (password = '', hashPassword = '') => {
    const passwordMatch = await bcryptjs.compare(password, hashPassword)

    return passwordMatch
}

export const generateToken = (data = {}) => {
    const token = jwt.sign(data, jwt_token_secret)
    return token
}

export const generateUserId = (prefix)=> {
    const randomInt = Math.floor(Math.random() * 100000); // Generate a random integer between 0 and 99999
    const userId = `${prefix}${randomInt.toString().padStart(5, '0')}`; // Combine the random integer with the prefix ex."u-" and pad with leading zeros
    return userId;
}