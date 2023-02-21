import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const getSections = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        sections: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0].sections} : {"status": "error", "errorCode": "404"};
};

export const createSection = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let id = new ObjectId();

    let values = {
        $push: {
            sections: {
                "name": "",
                "description": "",
                "slug": "",
                "_id": id
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");

    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": "404"};
};

export const updateSection = async (req) => {
    if (req.body.id != undefined) {
        let filter = {"_id": ObjectId(req.body.siteId), "sections._id": ObjectId(req.body.id)};
    
        let changedFields = {};
    
        req.body.slug != undefined ? changedFields["sections.$.slug"] = req.body.slug : null; 
        req.body.name != undefined ? changedFields["sections.$.name"] = req.body.name : null; 
        req.body.description != undefined ? changedFields["sections.$.description"] = req.body.description : null; 
        req.body.approved != undefined ? changedFields["sections.$.approved"] = req.body.approved == "true" : null;
    
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

export const deleteSection = async (req) => {
    let filter = {"_id": ObjectId(req.body.siteId), "sections._id": ObjectId(req.body.id)};

    let values = {
        $pull: {
            "sections": {
                "_id": ObjectId(req.body.id)
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
};

export const getSectionName = async (req, id = undefined) => {
    let stages = [
        {'$match': {'domain.name': req.hostname}},
        {'$unwind': '$sections'},
    ];

    (id != undefined) ? stages.push({'$match': { 'sections._id': new ObjectId(id) }}) : null;
        
    stages.push({'$project': {'sections': '$sections'}});

    let sectionData = await mongo.aggregate(stages, undefined, undefined, "sites");
    
    return (sectionData.length > 0) ? sectionData[0].sections : "";
};