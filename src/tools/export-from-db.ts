import { mongoDb } from '../mongo';
import fs from 'fs';
import jsonexport from 'jsonexport';
import es from 'event-stream';
import { join } from 'path';
import util from 'util';

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);

const types = [
    {
        name: 'heart_rate',
        header: ['_id','createdAt','uuid','brand','schema','type','data.heart_rate.value','data.heart_rate.unit','data.effective_time_frame.date_time','data.descriptive_statistic','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    },
    {
        name: 'step_count',
        header: ['_id','createdAt','uuid','brand','schema','type','data.step_count.value','data.step_count.unit','data.effective_time_frame.date_time','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    },
    {
        name: 'calories_burned',
        header: ['_id','createdAt','uuid','brand','schema','type','data.kcal_burned.value','data.kcal_burned.unit','data.effective_time_frame.date_time','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    },
    {
        name: 'physical_activity',
        header: ['_id','createdAt','uuid','brand','schema','type','data.activity_name','data.distance.value','data.distance.unit','data.effective_time_frame.date_time','data.kcal_burned.value','data.kcal_burned.unit','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    },
    {
        name: 'body_weight',
        header: ['_id','createdAt','uuid','brand','schema','type','data.body_weight.value','data.body_weight.unit','data.effective_time_frame.date_time','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    },
    {
        name: 'body_height',
        header: ['_id','createdAt','uuid','brand','schema','type','data.body_height.value','data.body_height.unit','data.effective_time_frame.date_time','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    },
    {
        name: 'body_fat_percentage',
        header: ['_id','createdAt','uuid','brand','schema','type','data.body_fat_percentage.value','data.body_fat_percentage.unit','data.effective_time_frame.date_time','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    },
    {
        name: 'total_sleep_time',
        header: ['_id','createdAt','uuid','brand','schema','type','data.total_sleep_time.value','data.total_sleep_time.unit','data.effective_time_frame.date_time','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    },
    {
        name: 'pace',
        header: ['_id','createdAt','uuid','brand','schema','type','data.pace.value','data.pace.unit','data.effective_time_frame.date_time','data.descriptive_statistic','data.effective_time_frame.time_interval.start_date_time','data.effective_time_frame.time_interval.end_date_time']
    }
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
        const path = join(pathDir, element.name + '.csv');
        const writer = fs.createWriteStream(path);
        const cursor = db.collection(sessionId).find({ type: element.name }).stream();
        await new Promise<void>(resolve => {
            cursor.pipe(es.map((doc: any, next: any) => {
                doc = JSON.stringify(doc);
                next(null, doc)
            })).pipe(jsonexport({ headers: element.header })).pipe(writer);
            cursor.on('error', (err: Error) => {
                console.log(err);
            });
            writer.on('close', () => {
                resolve();
            });
        });
    }));
};
