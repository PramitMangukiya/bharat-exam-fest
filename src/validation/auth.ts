import Joi from "joi";
import { GENDER_TYPES, ROLE_TYPES } from "../utils";

export const signUpSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    gender: Joi.string().valid(...Object.values(GENDER_TYPES)).required(),
    dob: Joi.date().required(),
    city: Joi.string().required(),
    language: Joi.string().optional(),
    referralCode: Joi.string().optional(),
    contact: Joi.object().keys({
        countryCode: Joi.string().optional(),
        mobile: Joi.string().optional()
    }).optional(),
    upscNumber: Joi.string().optional(),
    password: Joi.string().min(6).max(15).optional(),
    userType: Joi.string().valid(...Object.values(ROLE_TYPES)).optional(),
});

export const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
});

export const resetPasswordSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
});

export const otpVerifySchema = Joi.object().keys({
    otp: Joi.string().pattern(/^\d{6}$/).required(),
});

export const forgotPasswordSchema = Joi.object().keys({
    email: Joi.string().email().required(),
});