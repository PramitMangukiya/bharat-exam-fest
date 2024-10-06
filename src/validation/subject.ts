import Joi from "joi";

export const addSubjectSchema = Joi.object().keys({
    name: Joi.string().required()
});

export const editSubjectSchema = Joi.object().keys({
    subjectId: Joi.string().required(),
    name: Joi.string().optional()
});

export const deleteSubjectSchema = Joi.object().keys({
    id: Joi.string().required(),
});

export const getSubjectSchema = Joi.object().keys({
    id: Joi.string().required(),
});