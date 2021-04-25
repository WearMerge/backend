import { MongoClient } from 'mongodb';

let db: any = null;

const prod = process.env.NODE_ENV === 'production';
const mongoURL = prod ? 'mongodb://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@mongo:27017' : 'mongodb://localhost:27017';
const mongoDatabase = 'wearmerge';

const mongoConnect = async (url: string, database: string) => {
    await new Promise<void>((resolve) => {
        if (db) {
            console.log('Connected to mongodb');
            resolve();
        }
        MongoClient.connect(url, { forceServerObjectId: true }, (err, client) => {
            if (err) {
                console.error(err);
                process.exit();
            }
            db = client.db(database);
            console.log('Connected to mongodb');
            resolve();
        });
    });
};

export const mongoDb = async () => {
    if (db === null) {
        await mongoConnect(mongoURL, mongoDatabase);
    }
    return db;
};

export const mongoClose = async () => {
    await new Promise<void>((resolve) => {
        if (db) {
            db.close((err: Error, res: any) => {
                if (err) {
                    console.error(err);
                    process.exit();
                }
                db = null;
                console.log('Disconnected from mongodb');
                resolve();
            });
        }
    });
};
