import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const getMenus = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        menu: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0].menu} : {"status": "error", "errorCode": "404"};
};

export const createMenu = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let id = new ObjectId();

    let values = {
        $push: {
            menu: {
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

export const updateMenu = async (req) => {
    if (req.body.id != undefined) {
        let filter = {"_id": ObjectId(req.body.siteId), "menu._id": ObjectId(req.body.id)};

        let changedFields = {};
    
        req.body.url != undefined ? changedFields["menu.$.url"] = req.body.url : null; 
        req.body.name != undefined ? changedFields["menu.$.name"] = req.body.name : null; 
        req.body.approved != undefined ? changedFields["menu.$.mobile"] = req.body.approved == "true" : null;
        req.body.approved != undefined ? changedFields["menu.$.desktop"] = req.body.approved == "true" : null;
        req.body.subItems != undefined ? changedFields["menu.$.subItems"] = JSON.parse(req.body.subItems) : null; 
    
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

export const deleteMenu = async (req) => {
    let filter = {"_id": ObjectId(req.body.siteId), "menu._id": ObjectId(req.body.id)};

    let values = {
        $pull: {
            "menu": {
                "_id": ObjectId(req.body.id)
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
};