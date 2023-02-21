import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';
import { getSectionName } from './manageSections.js'
import { getTagsNames } from './manageTags.js'

export const getArticles = async (req) => {
    let filter = {/*"_id": ObjectId( req.body.siteId )*/"domain.name": req.hostname};

    let projection = {
        articles: 1
    }
    
    let siteData = await mongo.find(filter, projection, 1, undefined, "sites");

    let articleArray = [];

    for (const element of siteData[0].articles) {
        element.tags = await getTagsNames(element.tags);
        element.section = await getSectionName(element.section);

        articleArray.push(element)
    }

    return (siteData.length > 0) ? {"status": "ok", "data": articleArray} : {"status": "error", "errorCode": "404"};
};

export const createArticle = async (req) => {
    let filter = {"_id": new ObjectId(req.body.siteId)};

    let id = new ObjectId();
    let currentDate = new Date().getTime();

    let values = {
        $push: {
            articles: {
                "_id": id,
                "title": "",
                "subtitle": "",
                "section": "",
                "image": "",
                "body": "",
                "author": req.body.userId,
                "parsedBody": "",
                "relatedArticles": [],
                "creationDate": currentDate,
                "lastModified": currentDate,
                "tags": [],
                "status": "active",
                "form": "",
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");

    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": "404"};
};

export const updateArticle = async (req) => {
    if (req.body.id != undefined || req.query.id != undefined) {
        let currentDate = new Date().getTime();
        
        let filter = {/*"_id": ObjectId( req.body.siteId )*/"$and": [{"domain.name": req.hostname}, {"articles._id": ObjectId(req.query.id)}]};

        let bodyScriptParser = new RegExp(/<\s*script.*?>(.*?)<\/\s*?script[^>\w]*?>/gis);
        let bodyElementParser = new RegExp(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g);

        let body = req.body.body != undefined ? req.body.body.replace(bodyScriptParser, "") : undefined;
        let parsedBody = req.body.body != undefined ? body.replace(bodyElementParser, "") : undefined;

        let changedFields = {};
    
        req.body.title != undefined ? changedFields["articles.$.title"] = req.body.title : null; 
        req.query.title != undefined ? changedFields["articles.$.title"] = req.query.title : null; 
        req.body.subtitle != undefined ? changedFields["articles.$.subtitle"] = req.body.subtitle : null; 
        req.body.section != undefined ? changedFields["articles.$.section"] = req.body.section : null; 
        req.body.author != undefined ? changedFields["articles.$.author"] = req.body.author : null; 
        req.body.image != undefined ? changedFields["articles.$.image"] = req.body.image : null; 
        body != undefined ? changedFields["articles.$.body"] = body : null;
        parsedBody != undefined ? changedFields["articles.$.parsedBody"] =  parsedBody : null;
        req.body.relatedArticles != undefined ? changedFields["articles.$.relatedArticles"] = req.body.relatedArticles : null; 
        req.body.tags != undefined ? changedFields["articles.$.tags"] = req.body.tags : null; 
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
    
        return (result) ? {"status": "ok", "data": req.query.id} : {"status": "error", "errorCode": "404"};
    }
    else {
        return {"status": "error", "errorCode": "400"};
    }
}

export const deleteArticle = async (req) => {
    let filter = {"_id": ObjectId( req.body.siteId ), "articles._id": ObjectId(req.body.id)};

    let values = {
        $pull: {
            "articles": {
                "_id": ObjectId(req.body.id)
            }
        }
    }

    let result = await mongo.update(filter, values, "sites");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": "404"};
};