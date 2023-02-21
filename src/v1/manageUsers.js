import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

// DEPRECATED - LAUNCHING WITHOUTH THIS

export const getUsers = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        users: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0].users} : {"status": "error", "errorCode": "404"};
};

export const createUser = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let id = new ObjectId();

    let values = {
        $push: {
            users: {
                "_id": id,
                "name": "",
                "internalUser": "",
                "email": "",
                "password": "",
                "description": "",
                "image": "",
                "socialLinks": {},
                "status": "active",
                "lastSignedIn": 0,
                "session": "",
                "permissions": "",
                "configuration": {
                    "color": "default",
                    "sidebarLeft": false,
                    "articleSidebarLeft": false,
                    "icons": true
                }
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");

    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": "404"};
};

export const updateUser = async (req) => {
    if (req.body.id != undefined) {        
        let filter = {"_id": ObjectId(req.body.siteId), "users._id": ObjectId(req.body.id)};

        let changedFields = {};
    
        req.body.name != undefined ? changedFields["users.$.name"] = req.body.name : null; 
        req.body.email != undefined ? changedFields["users.$.email"] = req.body.email : null; 
        req.body.password != undefined ? changedFields["users.$.password"] = req.body.password : null; 
        req.body.description != undefined ? changedFields["users.$.description"] = req.body.description : null; 
        req.body.image != undefined ? changedFields["users.$.image"] = req.body.image : null; 
        req.body.name != undefined ? changedFields["users.$.name"] = req.body.title : null; 
        req.body.permissions != undefined ? changedFields["users.$.permissions"] = req.body.permissions.split(",") : null; 

        let validSatus = ['active', 'deleted', 'suspended']

        if (req.body.status != undefined && validSatus.includes("req.body.status")) {
            changedFields["articles.$.status"] = req.body.status; 
        }
        
        let values = {
            $set: changedFields
        }
        
        let result = await mongo.update(filter, values, "sites");
    
        return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
    }
    else {
        return {"status": "error", "errorCode": "400"};
    }
};

export const deleteUser = async (req) => {
    let filter = {"_id": ObjectId(req.body.siteId), "users._id": ObjectId(req.body.id)};

    let values = {
        $pull: {
            "users": {
                "_id": ObjectId(req.body.id)
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
};