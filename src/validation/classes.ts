import Joi from "joi";

export const addClassesSchema = Joi.object().keys({
    name: Joi.string().required(),
    title: Joi.string().optional(),
    contact: Joi.object().keys({
        countryCode: Joi.string().optional(),
        mobile: Joi.string().optional()
    }).optional(),
    email: Joi.string().email().optional(),
    country: Joi.string().optional(),
    account: Joi.object().keys({
        accountNumber: Joi.string().optional(),
        ifscCode: Joi.string().optional(),
        bankName: Joi.string().optional(),
        upiId: Joi.string().optional(),
        swifCode: Joi.string().optional()
    }).optional()
});

export const editClassesSchema = Joi.object().keys({
    classesId: Joi.string().required(),
    name: Joi.string().optional(),
    title: Joi.string().optional(),
    contact: Joi.object().keys({
        countryCode: Joi.string().optional(),
        mobile: Joi.string().optional()
    }).optional(),
    email: Joi.string().email().optional(),
    country: Joi.string().optional(),
    account: Joi.object().keys({
        accountNumber: Joi.string().optional(),
        ifscCode: Joi.string().optional(),
        bankName: Joi.string().optional(),
        upiId: Joi.string().optional(),
        swifCode: Joi.string().optional()
    }).optional()
});

export const deleteClassesSchema = Joi.object().keys({
    id: Joi.string().required(),
});

export const getClassesSchema = Joi.object().keys({
    id: Joi.string().required(),
});