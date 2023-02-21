import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const getConfiguration = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        _id: 1,
        color: 1,
        name: 1,
        description: 1,
        analytics: 1,
        ads: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0]} : {"status": "error", "errorCode": "404"};
};

export const updateColors = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let changedFields = {};

    req.body.primary != undefined ? changedFields["color.primary"] = req.body.primary : null; 
    req.body.background != undefined ? changedFields["color.background"] = req.body.background : null; 
    req.body.secondary != undefined ? changedFields["color.secondary"] = req.body.secondary : null; 
    req.body.highlight != undefined ? changedFields["color.highlight"] = req.body.highlight : null; 
    req.body.dark != undefined ? changedFields["color.dark"] = req.body.dark : null; 

    let values = {
        $set: changedFields
    }
    
    let result = await mongo.update(filter, values, "sites");

    return (result) ? {"status": "ok"} : {"status": "error", "errorCode": "404"};
}

export const updateTexts = async (req) => {
    if (req.body.id != undefined) {
        let filter = {"_id": new ObjectId(req.body.siteId)};

        let changedFields = {};
    
        req.body.slug != undefined ? changedFields["name"] = req.body.slug : null; 
        req.body.name != undefined ? changedFields["description"] = req.body.name : null; 

        let values = {
            $set: changedFields
        }
        
        let result = await mongo.update(filter, values, "sites");
    
        return (result) ? {"status": "ok"} : {"status": "error", "errorCode": "404"};
    }
    else {
        return {"status": "error", "errorCode": "400"};
    }
}

export const updateAnalytics = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let changedFields = {};
    
    req.body.searchConsole != undefined ? changedFields["analytics.searchConsole"] = req.body.searchConsole : null; 
    req.body.ga4 != undefined ? changedFields["analytics.ga4"] = req.body.ga4 : null; 
    req.body.ua != undefined ? changedFields["analytics.ua"] = req.body.ua : null; 

    let values = {
        $set: changedFields
    }
    
    let result = await mongo.update(filter, values, "sites");

    return (result) ? {"status": "ok"} : {"status": "error", "errorCode": "404"};
}