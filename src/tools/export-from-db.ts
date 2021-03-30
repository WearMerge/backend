import { mongoDb } from '../mongo';
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

export const exportFromDB = async (sessionId: string) => {
    const db = mongoDb();
    const pathDir = path.join('./downloads', sessionId);
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
        const cursor = db.collection(sessionId).find({ type: element }).stream();
        await new Promise<void>(resolve => {
            cursor.pipe(es.map((doc: any, next: any) => {
                doc = JSON.stringify(doc);
                next(null, doc)
            })).pipe(jsonexport()).pipe(writer);
            cursor.on('close', () => {
                resolve();
            });
            cursor.on('error', (err: Error) => {
                console.log(err);
            });
        });
    }));
};