import * as mongo from '../mongoOperations.js';
import * as S3 from '../S3Operations.js';
import { ObjectId } from 'mongodb';

export const getImages = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        images: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0].images} : {"status": "error", "errorCode": "404"};
};

export const createImage = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let id = new ObjectId();

    let siteData = await mongo.find({"_id": ObjectId(req.body.siteId)}, undefined, undefined, undefined, "sites");
    let siteId = siteData.length > 0 ? siteData[0]['_id'] : null;

    if (siteId == null) {
        return {"status": "error", "errorCode": "500"};
    }

    
    req.pipe(req.busboy);
    let result = req.busboy.on('file', async (fieldname, file, fileData) => {
        let extention = fileData.filename.split('.')[ fileData.filename.split('.').length - 1 ]
        try {
            S3.uploadResource(file, id + "." + extention, siteId);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            let values = {
                $push: {
                    images: {
                        "_id": id,
                        "name": fileData.filename,
                        "extention": extention,
                        "uploadedBy": req.body.userId,
                        "status": "active"
                    }
                }
            };
        
            return await mongo.update(filter, values, "sites");
        }
    });

    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": "404"};
};

export const updateImage = async (req) => {
    if (req.body.id != undefined) {
        let filter = {"_id": ObjectId(req.body.siteId), "images._id": ObjectId(req.body.id)};

        let changedFields = {};
    
        req.body.slug != undefined ? changedFields["images.$.slug"] = req.body.slug : null; 
        req.body.name != undefined ? changedFields["images.$.name"] = req.body.name : null; 
        req.body.description != undefined ? changedFields["images.$.description"] = req.body.description : null; 
        req.body.approved != undefined ? changedFields["images.$.approved"] = req.body.approved == "true" : null;
    
        let values = {
            $set: changedFields
        }

        let result = await mongo.update(filter, values, "sites");
    
        return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
    }
    else {
        return {"status": "error", "errorCode": "400"};
    }
}

export const deleteImage = async (req) => {
    let filter = {"_id": ObjectId(req.body.siteId), "images._id": ObjectId(req.body.id)};

    let values = {
        $pull: {
            "images": {
                "_id": ObjectId(req.body.id)
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
};