import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const createAccount = async (req) => {
    let id = new ObjectId();

    let values = {
        "_id": id,
        "owner": req.query.owner,
        "usd": 0,
        "ars": 0,
        "active": true,
    }

    let result = await mongo.insert(values, "Banking");

    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": 404};
};

export const deleteAccount = async (req) => {
    let filter = {"_id": ObjectId(req.query.id), "active": true};

    let values = {
        "$set": {
            "active": false
        }
    }

    let result = await mongo.update(filter, values, "Banking");
    
    return (result) ? {"status": "ok", "data": req.query.id} : {"status": "error", "errorCode": 404};
};