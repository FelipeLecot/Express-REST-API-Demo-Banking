import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const createAccount = async (req) => {
    if (req.body.owner != undefined) {
        return {"status": "error", "errorCode": 400};
    }

    let id = new ObjectId();

    let values = {
        "_id": id,
        "owner": req.body.owner,
        "usd": 0,
        "ars": 0,
        "active": true,
    }

    let result = await mongo.insert(values, "Banking");
    
    return (result) ? {"status": "ok", "data": id} : {"status": "error", "errorCode": 404};
};

export const deleteAccount = async (req) => {
    let filter = {"_id": ObjectId(req.body.id), "active": true};

    let values = {
        "$set": {
            "active": false
        }
    }

    let result = await mongo.update(filter, values, "Banking");
    
    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": 404};
};