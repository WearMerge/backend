import { MongoClient } from 'mongodb';
import fs from 'fs';
import jsonexport from 'jsonexport';
import es from 'event-stream';
import path from 'path';

const types = [
    'heart_rate',
    'step_count',
    'calories_burned',
    'physical_activity',
    'body_weight',
    'body_height',
    'body_fat_percentage',
    'total_sleep_time',
    'pace'
];

export const exportFromDB = async (userId: string) => {
    const client = await new MongoClient('mongodb://localhost:27017', { forceServerObjectId: true }).connect();
    const db = client.db('wearmerge');
    const pathDir = path.join('./downloads', userId);
    await new Promise<void>(resolve => {
        fs.access(pathDir, fs.constants.F_OK, (err) => {
            if (err) {
                fs.mkdir(pathDir, () => {
                    resolve();
                });
            }
            resolve();
        });
    });
    await Promise.all(types.map(async (element) => {
        const writer = fs.createWriteStream(path.join(pathDir, element + '.csv'));
        const cursor = db.collection(userId).find({ type: element }).stream();
        await new Promise<void>(resolve => {
            cursor.pipe(es.map((doc: any, next: any) => {
                doc = JSON.stringify(doc);
                next(null, doc)
            })).pipe(jsonexport()).pipe(writer);
            cursor.on('close', () => {
                resolve();
            });
            cursor.on('error', (err) => {
                console.log(err);
            });
        });
    }));
    
    await client.close().then(()=>{console.log('EXPORTED')});
};