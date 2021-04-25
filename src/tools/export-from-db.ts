import { mongoDb } from '../mongo';
import fs from 'fs';
import jsonexport from 'jsonexport';
import es from 'event-stream';
import { join } from 'path';
import util from 'util';

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);

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
    const db = await mongoDb();
    const pathDir = join('./downloads', sessionId);
    await access(pathDir, fs.constants.F_OK).catch(async (err: any) => {
        if (err) {
            await mkdir(pathDir, { recursive: true });
        }
    });
    await Promise.all(types.map(async (element) => {
        const path = join(pathDir, element + '.csv');
        const writer = fs.createWriteStream(path);
        const cursor = db.collection(sessionId).find({ type: element }).stream();
        await new Promise<void>(resolve => {
            cursor.pipe(es.map((doc: any, next: any) => {
                doc = JSON.stringify(doc);
                next(null, doc)
            })).pipe(jsonexport()).pipe(writer);
            cursor.on('error', (err: Error) => {
                console.log(err);
            });
            writer.on('close', () => {
                resolve();
            });
        });
    }));
};
