import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const getPages = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        pages: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0].pages} : {"status": "error", "errorCode": "404"};
};

export const createPage = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let id = new ObjectId();

    let values = {
        $push: {
            pages: {
                "name": "",
                "description": "",
                "html": "",
                "slug": "",
                "approved": false,
                "_id": id
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");

    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": "404"};
};

export const updatePage = async (req) => {
    if (req.body.id != undefined) {
        let filter = {"_id": ObjectId(req.body.siteId), "pages._id": ObjectId(req.body.id)};

        let changedFields = {};
    
        req.body.text != undefined ? changedFields["pages.$.text"] = req.body.text : null; 
        req.body.path != undefined ? changedFields["pages.$.path"] = req.body.path : null; 
        req.body.name != undefined ? changedFields["pages.$.name"] = req.body.name : null; 
        req.body.description != undefined ? changedFields["pages.$.description"] = req.body.description : null; 
    
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

export const deletePage = async (req) => {
    let filter = {"_id": ObjectId(req.body.siteId), "pages._id": ObjectId(req.body.id)};

    let values = {
        $pull: {
            "pages": {
                "_id": ObjectId(req.body.id)
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
};