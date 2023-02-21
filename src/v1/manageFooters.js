import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const getFooters = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        footer: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0].footer} : {"status": "error", "errorCode": "404"};
};

export const createFooter = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let id = new ObjectId();

    let values = {
        $push: {
            footer: {
                "_id": id,
                "name": "",
                "url": "",
                "mobile": true,
                "desktop": true,
                "subItems": []
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");

    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": "404"};
};

export const updateFooter = async (req) => {
    if (req.body.id != undefined) {
        let filter = {"_id": ObjectId(req.body.siteId), "footer._id": ObjectId(req.body.id)};

        let changedFields = {};
    
        req.body.url != undefined ? changedFields["footer.$.url"] = req.body.url : null; 
        req.body.name != undefined ? changedFields["footer.$.name"] = req.body.name : null; 
        req.body.approved != undefined ? changedFields["footer.$.mobile"] = req.body.approved == "true" : null;
        req.body.approved != undefined ? changedFields["footer.$.desktop"] = req.body.approved == "true" : null;
        req.body.subItems != undefined ? changedFields["footer.$.subItems"] = JSON.parse(req.body.subItems) : null; 
    
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

export const deleteFooter = async (req) => {
    let filter = {"_id": ObjectId(req.body.siteId), "footer._id": ObjectId(req.body.id)};

    let values = {
        $pull: {
            "footer": {
                "_id": ObjectId(req.body.id)
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
};