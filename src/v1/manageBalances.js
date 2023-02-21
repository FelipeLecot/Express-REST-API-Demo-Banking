import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const getBalances = async (req) => {    
    let balances = await mongo.find(undefined, undefined, undefined, undefined, "Banking");

    return (balances.length > 0) ? {"status": "ok", "data": balances} : {"status": "error", "errorCode": 404};
};

export const creditBalance = async (req) => {
    if (req.body.id != null && req.body.account != null && req.body.quantity != null) {
        return {"status": "error", "errorCode": 400};
    }

    let filter = {"_id": new ObjectId(req.body.id)};

    let values = {
        "$inc": {[req.body.account]: parseInt(req.body.quantity)}
    }

    console.log(values)

    let result = await mongo.update(filter, values, "Banking");

    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": 404};
};

export const debitBalance = async (req) => {
    if (req.body.id != null && req.body.account != null && req.body.quantity != null) {
        return {"status": "error", "errorCode": 400};
    }
    
    let filter = {"_id": new ObjectId(req.body.id)};

    let values = {
        "$inc": {[req.body.account]: parseInt(-1 * req.body.quantity)}
    }

    let result = await mongo.update(filter, values, "Banking");

    return (result) ? {"status": "ok", "data": req.body.id} : {"status": "error", "errorCode": 404};
};

export const transferBalance = async (req) => {
    if (req.body.from != null && req.body.to != null && req.body.quantity != null && req.body.account != null) {
        return {"status": "error", "errorCode": 400};
    }
        
    let filterFrom = {"_id": new ObjectId(req.body.from)};
    
    let valuesFrom = {
        "$inc": {[req.body.account]: parseInt(-1 * eq.query.quantity)}
    }
    
    let resultFrom = await mongo.update(filterFrom, valuesFrom, "Banking");
    
    let filterTo = {"_id": new ObjectId(req.body.to)};

    let valuesTo = {
        "$inc": {[req.body.account]: parseInt(req.body.quantity)}
    }
    
    let resultTo = await mongo.update(filterTo, valuesTo, "Banking");

    return (resultTo && resultFrom) ? {"status": "ok"} : {"status": "error", "errorCode": 404};
};