import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

// NOT DONE - LAUNCHING WITHOUTH THIS

export const getUserSettings = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let projection = {
        articles: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    return (siteData.length > 0) ? {"status": "ok", "data": siteData[0].articles} : {"status": "error", "errorCode": "404"};
};

export const updateUserSettings = async (req) => {
    if (req.body.id != undefined) {
        let currentDate = new Date().getTime();
        
        let filter = {"_id": ObjectId( req.body.siteId ), "articles._id": ObjectId(req.body.id)};

        let bodyScriptParser = new RegExp(/<\s*script.*?>(.*?)<\/\s*?script[^>\w]*?>/gis);
        let bodyElementParser = new RegExp(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g);

        let body = req.body.body != undefined ? req.body.body.replace(bodyScriptParser, "") : undefined;
        let parsedBody = req.body.body != undefined ? body.replace(bodyElementParser, "") : undefined;

        let changedFields = {};
    
        req.body.title != undefined ? changedFields["articles.$.title"] = req.body.title : null; 
        req.body.subtitle != undefined ? changedFields["articles.$.subtitle"] = req.body.subtitle : null; 
        req.body.section != undefined ? changedFields["articles.$.section"] = req.body.section : null; 
        req.body.author != undefined ? changedFields["articles.$.author"] = req.body.author : null; 
        req.body.image != undefined ? changedFields["articles.$.image"] = req.body.image : null; 
        body != undefined ? changedFields["articles.$.body"] = body : null;
        parsedBody != undefined ? changedFields["articles.$.parsedBody"] =  parsedBody : null;
        req.body.relatedArticles != undefined ? changedFields["articles.$.relatedArticles"] = req.body.relatedArticles.split(",") : null; 
        req.body.tags != undefined ? changedFields["articles.$.tags"] = req.body.tags.split(",") : null; 
        req.body.form != undefined ? changedFields["articles.$.form"] = req.body.form : null;
        changedFields["articles.$.lastModified"] = currentDate; 
        
        let validSatus = ['active', 'published', 'scheduled', 'deleted', 'unpublished', 'modified']

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
}