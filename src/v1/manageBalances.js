import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const getBalances = async (req) => {    
    let balances = await mongo.find(undefined, undefined, undefined, undefined, "Banking");

    return (balances.length > 0) ? {"status": "ok", "data": balances} : {"status": "error", "errorCode": 404};
};

export const creditBalance = async (req) => {
    let filter = {"_id": new ObjectId(req.query.id)};

    let values = {
        "$inc": {[req.query.account]: parseInt(req.query.quantity)}
    }

    console.log(values)

    let result = await mongo.update(filter, values, "Banking");

    return (result) ? {"status": "ok", "data": req.query.id} : {"status": "error", "errorCode": 404};
};

export const debitBalance = async (req) => {
    let filter = {"_id": new ObjectId(req.query.id)};

    let values = {
        "$inc": {[req.query.account]: parseInt(-1 * eq.query.quantity)}
    }

    console.log(values)

    let result = await mongo.update(filter, values, "Banking");

    return (result) ? {"status": "ok", "data": req.query.id} : {"status": "error", "errorCode": 404};
};

export const transferBalance = async (req) => {
    let filterFrom = {"_id": new ObjectId(req.query.from)};
    
    let valuesFrom = {
        "$inc": {[req.query.account]: parseInt(-1 * eq.query.quantity)}
    }
    
    let resultFrom = await mongo.update(filterFrom, valuesFrom, "Banking");
    
    let filterTo = {"_id": new ObjectId(req.query.to)};

    let valuesTo = {
        "$inc": {[req.query.account]: parseInt(req.query.quantity)}
    }
    
    let resultTo = await mongo.update(filterTo, valuesTo, "Banking");

    return (resultTo && resultFrom) ? {"status": "ok", "data": req.query.id} : {"status": "error", "errorCode": 404};
};