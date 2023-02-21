import * as mongo from '../mongoOperations.js';
import { ObjectId } from 'mongodb';

export const auth = async (req) => {
    let userFilter = {"$and": [ {"_id": ObjectId(req.body.userId)}, {"session": req.body.sessionId} ] };
    let siteFilter = {"$and": [ {"users._id": ObjectId(req.body.userId) }]}

    let userData = await mongo.find(userFilter, undefined, 1, undefined, "users");

    let siteData = await mongo.find(siteFilter, undefined, 1, undefined, "users");

    return {status: "ok"} //Temporary skip for the auth
    //return (siteData.length > 0) ? {"status": "ok", "data": ObjectId(req.body.id)} : {"status": "error", "errorCode": "404"};
};

export const login = async (req) => {
    let filter = {"username": req.body.user, "password": req.body.password};

    let sessionId = new ObjectId().toString()

    let values = {
        $set: {
            "users": sessionId
        }
    }

    let userGetResult = await mongo.find(filter, undefined, undefined, undefined, "users");

    let authResult = await mongo.update(filter, values, "users");
            
    return (authResult) ? {"status": "ok", "data": {"sessionId": sessionId, userId: userGetResult[0]["_id"]}} : {"status": "error", "errorCode": "404"};
};

const hashPassword = (password) => {
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 10000;
    var hash = pbkdf2(password, salt, iterations);

    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    };
}

const isPasswordCorrect = (savedHash, savedSalt, savedIterations, passwordAttempt) => {
    return savedHash == pbkdf2(passwordAttempt, savedSalt, savedIterations);
}