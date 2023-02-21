import mongodb from 'mongodb';
const { MongoClient, ObjectId } = mongodb;

const client = new MongoClient("mongodb+srv://ASOKij389hUBNA928:aPUwJSCQCi60pBBevRGk87n4p3SmHLK8@interview.yfkxro1.mongodb.net/?retryWrites=true&w=majority");

export const aggregate = async (stages = [], limit = undefined, sort = undefined, collection) => {
    try {
        await client.connect();

        let allOps = [
            ...stages
        ]

        if (limit != undefined) {
            allOps.push({'$limit': parseInt(limit)});
        }

        if (sort != undefined) {
            allOps.push({'$sort': sort});
        }

        let db = client.db("redgecko");
        let result = db.collection(collection);
        
        return result
        .aggregate(
            allOps
        )
        .toArray();
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

export const find = async (filter = {}, projection = {}, limit = 0, sort = {}, collection) => {
    await client.connect();

    let db = client.db("redgecko");
    let result = db.collection(collection);
    try {
        return result
            .find(filter, {projection: projection})
            .limit(parseInt(limit))
            .sort(sort)
            .toArray();
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

export const insert = async (data, collection) => {
    await client.connect();

    let db = client.db("redgecko");
    let result = db.collection(collection);
    try {
        result.insertOne(data);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

export const update = async (filter, update, collection) => {
    await client.connect();

    let db = client.db("redgecko");
    let result = db.collection(collection);
    try {
        result.updateMany(filter, update);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}