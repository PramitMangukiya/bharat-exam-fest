import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Request, Response } from 'express'
import { userModel } from '../database'
import { apiResponse } from '../utils'

const ObjectId: any = mongoose.Types.ObjectId
const jwt_token_secret = process.env.JWT_TOKEN_SECRET;

export const adminJWT = async (req: Request, res: Response, next) => {
    let { authorization, userType } = req.headers,
        result: any
    if (authorization) {
        try {
            let isVerifyToken = jwt.verify(authorization, jwt_token_secret)
            
            if (!result) result = await userModel.findOne({ _id: ObjectId(isVerifyToken._id), isDeleted: false });

            if (result?.isBlocked == true) return res.status(403).json(new apiResponse(403, 'Your account han been blocked.', {}, {}));
            if (result?.isDeleted == false && isVerifyToken.authToken == result.authToken && isVerifyToken.type == result.role) {
                req.headers.user = result
                return next()
            } else {
                return res.status(401).json(new apiResponse(401, "Invalid-Token", {}, {}))
            }
        } catch (err) {
            if (err.message == "invalid signature") return res.status(403).json(new apiResponse(403, `Don't try different one token`, {}, {}))
            console.log(err)
            return res.status(401).json(new apiResponse(401, "Invalid Token", {}, {}))
        }
    } else {
        return res.status(401).json(new apiResponse(401, "Token not found in header", {}, {}))
    }
}

