import { subjectModel } from "../../database";
import { responseMessage } from "../../helper";
import { apiResponse } from "../../utils";
import { addSubjectSchema, deleteSubjectSchema, editSubjectSchema, getSubjectSchema } from "../../validation";

const ObjectId = require('mongoose').Types.ObjectId;

export const add_subject = async (req, res) => {
    let { user } = req.headers
    try {
        const { error, value } = addSubjectSchema.validate(req.body)
        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        }

        value.createdBy = new ObjectId(user._id)
        value.updatedBy = new ObjectId(user._id)

        let isExist = await subjectModel.findOne({ name: value.name, isDeleted: false })
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("Subject Name"), {}, {}))

        const response = await new subjectModel(value).save();
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("subject"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const edit_subject_by_id = async (req, res) => {
    let { user } = req.headers
    try {
        const { error, value } = editSubjectSchema.validate(req.body)
        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        }
        value.updatedBy = new ObjectId(user._id)

        let isExist = await subjectModel.findOne({ name: value.name, isDeleted: false, _id: { $ne: value.subjectId } })
        if (isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("Subject Name"), {}, {}))

        const response = await subjectModel.findOneAndUpdate({ _id: new ObjectId(value.subjectId) }, value, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError("subject"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess("subject"), response, {}))
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const delete_subject_by_id = async (req, res) => {
    try {
        const { error, value } = deleteSubjectSchema.validate(req.params)
        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        }

        const response = await subjectModel.findOneAndUpdate({ _id: new ObjectId(value.id) }, { isDeleted: true }, { new: true })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("subject"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess("subject"), response, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_subject = async (req, res) => {
    let match: any = {}, { page, limit, search } = req.query
    try {
        page = Number(page)
        limit = Number(limit)

        match.isDeleted = false

        if (search) {
            match.$or = [
                { name: { $regex: search, $options: 'i' } }
            ]
        }

        const response = await subjectModel.aggregate([
            { $match: match },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: limit }
                    ],
                    data_count: [{ $count: "count" }]
                }
            }
        ])

        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("subject"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("subject"), {
            subject_data: response[0]?.data || [],
            totalData: response[0]?.data_count[0]?.count || 0,
            state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(response[0]?.data_count[0]?.count / limit) || 1,
            },
        }, {}))
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_subject_by_id = async (req, res) => {
    try {
        const { error, value } = getSubjectSchema.validate(req.params)
        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}))
        }

        const response = await subjectModel.findOne({ _id: new ObjectId(value.id) })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("subject"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("subject"), response, {}))
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}

export const get_all_subjects = async (req, res) => {
    try {
        const response = await subjectModel.find({ isDeleted: false })
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("subject"), {}, {}))
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess("subject"), response, {}))
    } catch (error) {
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
    }
}