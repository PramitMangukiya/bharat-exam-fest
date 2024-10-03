import { apiResponse, generateHash, ROLE_TYPES } from "../../utils";
import { userModel } from "../../database";
import { reqInfo, responseMessage } from "../../helper";
import { addUserSchema, deleteUserSchema, editUserSchema, getUserSchema } from "../../validation";


const ObjectId = require('mongoose').Types.ObjectId;

export const add_user = async (req, res) => {
    reqInfo(req);
    let { user } = req.headers;
    try {
        const { error, value } = addUserSchema.validate(req.body);
        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
        }

        value.createdBy = ObjectId(user?._id)
        value.updatedBy = ObjectId(user?._id)

        if(!value.roleId) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound("role"), {}, {}))
        
        let isExist = await userModel.findOne({email : value.email})
        if(isExist) return res.status(404).json(new apiResponse(404, responseMessage?.dataAlreadyExist("email"), {}, {}))

        
        value.password = await generateHash(value.password)

        const response = await new userModel(value).save();
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.addDataError, {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage?.addDataSuccess("user"), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};

export const edit_user_by_id = async (req, res) => {
    reqInfo(req);
    let { user } = req.headers;
    try {
        const { error, value } = editUserSchema.validate(req.body);
        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
        }

        value.updatedBy = ObjectId(user?._id)
        const response = await userModel.findOneAndUpdate({ _id: ObjectId(value._id), isDeleted: false }, value, { new: true });
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.updateDataError('user'), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage?.updateDataSuccess('user'), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};

export const delete_user_by_id = async (req, res) => {
    reqInfo(req);
    try {
        const { error, value } = deleteUserSchema.validate(req.params);
        if (error) {
            return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
        }
        const response = await userModel.findOneAndUpdate({ _id: ObjectId(value.id), isDeleted: false }, { isDeleted: true }, { new: true });
        if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound('user'), {}, {}));
        return res.status(200).json(new apiResponse(200, responseMessage?.deleteDataSuccess('user'), {}, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};

export const get_all_users = async (req, res) => {
    reqInfo(req);
    const { page, limit, search } = req.body;
    let response: any, match: any = {};
    
    try {
        match.isDeleted = false;
        if (search) {
            match.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }
        const options = {
            sort: { createdAt: -1 }, 
            skip: (page - 1) * limit, 
            limit: parseInt(limit), 
        };
        
        response = await userModel.find(match, null, options);
        const totalData = await userModel.countDocuments(match); // Get total count for pagination
        
        return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('users'), { totalData, users: response }, {}));
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
    }
};

// export const get_user_by_id = async (req, res) => {
//     reqInfo(req);
//     try {
//         const { error, value } = getUserSchema.validate(req.params);
//         if (error) {
//             return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
//         }
//         let role = await roleModel.findOne({name : ROLE_TYPES.USER})
//         const response = await userModel.findOne({ _id: ObjectId(value.id), isDeleted: false, roleId : ObjectId(role._id) });
//         if (!response) return res.status(404).json(new apiResponse(404, responseMessage?.getDataNotFound('user'), {}, {}));
//         return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('user'), response, {}));
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error));
//     }
// };

// export const get_all_user = async(req, res) => {
//     reqInfo(req)
//     try {
//         let role = await roleModel.findOne({name : ROLE_TYPES.USER})
//         let response = await userModel.find({roleId : ObjectId(role._id), isDeleted : false}).select("firstName lastName _id")
//         return res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('user'),response, {}));
//     } catch (error) {
//         console.log(error);
//     }
// }