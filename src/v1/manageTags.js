import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const getTags = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        tags: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0].tags} : {"status": "error", "errorCode": "404"};
};

export const createTag = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let id = new ObjectId();

    let values = {
        $push: {
            tags: {
                "name": "",
                "description": "",
                "slug": "",
                "approved": false,
                "_id": id
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");

    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": "404"};
};

export const updateTag = async (req) => {
    if (req.body.id != undefined) {
        let filter = {"_id": ObjectId(req.body.siteId), "tags._id": ObjectId(req.body.id)};

        let changedFields = {};
    
        req.body.slug != undefined ? changedFields["tags.$.slug"] = req.body.slug : null; 
        req.body.name != undefined ? changedFields["tags.$.name"] = req.body.name : null; 
        req.body.description != undefined ? changedFields["tags.$.description"] = req.body.description : null; 
        req.body.approved != undefined ? changedFields["tags.$.approved"] = req.body.approved == "true" : null;
    
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

export const deleteTag = async (req) => {
    let filter = {"_id": ObjectId(req.body.siteId), "tags._id": ObjectId(req.body.id)};

    let values = {
        $pull: {
            "tags": {
                "_id": ObjectId(req.body.id)
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
};

export const getTagsNames = async (req, ids = []) => {
    let stages = [
        {'$match': {'domain.name': req.hostname}},
        {'$unwind': '$tags'},
    ];

    (ids.length > 0) ? stages.push({'$match': { 'articles.tags._id': { '$in': ids}}}) : null;

    stages.push({'$project': {'tags': '$tags'}});

    let tagRaw = await mongo.aggregate(stages, undefined, undefined, "sites");
    let tagArray = [];

    for (const element of tagRaw) {
        tagArray.push(element.tags);
    }
    
    return (tagArray.length > 0) ? tagArray : [];
};