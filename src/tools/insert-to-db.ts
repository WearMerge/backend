import { MongoClient } from 'mongodb';
import fs from 'fs';
import Ajv from 'ajv';
import csvParser from 'csv-parser';
import stripBomStream from 'strip-bom-stream';
import streamJson, { Readable, Transform, Writable } from 'stream-json/streamers/StreamArray';
import bigXml from 'big-xml';
import path from'path';
import { Cast } from './cast';
import {v4 as uuidv4 } from 'uuid';
import ReplaceStream from 'replacestream';

const ajv = new Ajv({strict: false});

const bufferLength = 100000;

// const containsDate = ['dateComponents_apple-activity_summary.json', 'calendarDate_garmin-sleepData.json', 'dateOfSleep_fitbit-sleep_date.json', 'Date_fitbit-foods.json', 'Date_fitbit-body.json', 'Date_fitbit-activities.json', 'date_xiaomi-activity.json', 'date_xiaomi-activity_minute.json', 'date_xiaomi-activity_stage.json', 'date_xiaomi-heartrate_auto.json', 'date_xiaomi-sleep.json'];
// const containsDateAndTime = ['endDate_apple-workout.json', 'startDate_apple-workout.json', 'creationDate_apple-workout.json', 'endDate_apple-record.json', 'startDate_apple-record.json', 'creationDate_apple-record.json', 'com.samsung.health.step_count.end_time_samsung-shealth_tracker_pedometer_step_count.json', 'com.samsung.health.step_count.create_time_samsung-shealth_tracker_pedometer_step_count.json', 'com.samsung.health.step_count.update_time_samsung-shealth_tracker_pedometer_step_count.json', 'com.samsung.health.step_count.start_time_samsung-shealth_tracker_pedometer_step_count.json', 'com.samsung.health.heart_rate.end_time_samsung-shealth_tracker_health_rate.json', 'com.samsung.health.heart_rate.create_time_samsung-shealth_tracker_health_rate.json', 'com.samsung.health.heart_rate.update_time_samsung-shealth_tracker_health_rate.json', 'com.samsung.health.heart_rate.start_time_samsung-shealth_tracker_health_rate.json', 'create_time_samsung-shealth_step_daily_trend.json', 'update_time_samsung-shealth_step_daily_trend.json', 'com.samsung.health.sleep.end_time_samsung-shealth_sleep.json', 'com.samsung.health.sleep.create_time_samsung-shealth_sleep.json', 'com.samsung.health.sleep.update_time_samsung-shealth_sleep.json', 'com.samsung.health.sleep.start_time_samsung-shealth_sleep.json', 'create_time_samsung-shealth_sleep_data.json', 'update_time_samsung-shealth_sleep_data.json', 'start_time_samsung-shealth_sleep_data.json', 'com.samsung.health.exercise.end_time_samsung-shealth_exercise.json', 'com.samsung.health.exercise.create_time_samsung-shealth_exercise.json', 'com.samsung.health.exercise.update_time_samsung-shealth_exercise.json', 'com.samsung.health.exercise.start_time_samsung-shealth_exercise.json', 'create_time_samsung-shealth_activity_day_summary.json', 'update_time_samsung-shealth_activity_day_summary.json', 'create_time_samsung-health_weight.json', 'update_time_samsung-health_weight.json', 'start_time_samsung-health_weight.json', 'end_time_samsung-health_sleep_stage.json', 'create_time_samsung-health_sleep_stage.json', 'update_time_samsung-health_sleep_stage.json', 'start_time_samsung-health_sleep_stage.json', 'create_time_samsung-health_height.json', 'update_time_samsung-health_height.json', 'start_time_samsung-health_height.json', 'sleepEndTimestampGMT_garmin-sleepData.json', 'sleepStartTimestampGMT_garmin-sleepData.json', 'restingHeartRateTimestamp_garmin-UDSFile.json', 'date_garmin-UDSFile.json', 'dateTime_fitbit-sleep_date.json', 'endTime_fitbit-sleep_date.json', 'startTime_fitbit-sleep_date.json', 'originalStartTime_fitbit-exercise.json', 'startTime_fitbit-exercise.json', 'lastModified_fitbit-exercise.json', 'dateTime_fitbit-steps_date.json', 'dateTime_fitbit-heart_rate.json', 'Start_Time_fitbit-sleep.json', 'End_Time_fitbit-sleep.json', 'dateTime_fitbit-calories.json'];
// const containsTimestampUTC = ['lastSyncTime_xiaomi-activity.json', 'timestamp_xiaomi-body.json', 'lastSyncTime_xiaomi-sleep.json', 'start_xiaomi-sleep.json', 'stop_xiaomi-sleep.json', 'startTime_xiaomi-sport.json'];
// const containsTimestamp = ['endTime_huawei-sport_per_minute_merged_data.json', 'startTime_huawei-sport_per_minute_merged_data.json', 'endTime_huawei-health_detail_data.json', 'startTime_huawei-health_detail_data.json', 'beginTimestamp_garmin-summarizedActivities.json', 'startTimeGmt_garmin-summarizedActivities.json', 'startTimeLocal_garmin-summarizedActivities.json'];
// const containsTime = ['time_xiaomi-activity_minute.json', 'start_xiaomi-activity_stage.json', 'stop_xiaomi-activity_stage.json', 'time_xiaomi-heartrate_auto.json'];
// const isNotNumber = ['timeZone'];

const xiaomiInvalid = new RegExp(/date,lastSyncTime,heartRate,timestamp[\n]*/);
const fitbitSummaryInvalid = new RegExp(/Body\nDate,Weight,BMI,Fat|Food\nDate,Calories In|Activities\nDate,Calories Burned,Steps,Distance,Floors,Minutes Sedentary,Minutes Lightly Active,Minutes Fairly Active,Minutes Very Active,Activity Calories|Sleep\nStart Time,End Time,Minutes Asleep,Minutes Awake,Number of Awakenings,Time in Bed,Minutes REM Sleep,Minutes Light Sleep,Minutes Deep Sleep|Food Log/);
// const fitbitInvalid = new RegExp(/\[[\n ]*\{[\n ]*"logId"[\n ]*\:[\n ]*\d*[\n ]*\,[\n ]*"dateOfSleep"/);
const fitbitInvalid = new RegExp(/\[\{[\n ]*"dateTime"[\n ]*\:[\0-\377:nonascii:]*?,[\n ]*"value"[\n ]*:[\n ]*"[\0-\377:nonascii:]*?"[\n ]*\}/);
const garminInvalid = new RegExp(/\[[\n ]*\{[\n ]*"summarizedActivitiesExport"[\n ]*\:[\n ]*\[/);
const garminObjectInvalid = new RegExp(/\{[\n ]*"userName"[\0-\377:nonascii:]*?\"firstName"/);
const huaweiInvalid = new RegExp(/\[[\n ]*\{[\n ]*"sportDataUserData"[\n ]*\:[\n ]*\[/);
const samsungInvalid = new RegExp(/com.samsung.health.\w+.\w+,\d+,\d+\n|com.samsung.shealth.\w+.\w+,\d+,\d+\n/);


const getFiles = async (path: string) => {
    const entries = await fs.promises.readdir(path, { withFileTypes: true });
    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter(folder => !folder.isDirectory())
        .map(file => ({ ...file, path: path + file.name }));
    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());
    for (const folder of folders) {
        files.push(...await getFiles(`${path}${folder.name}/`));
    }
    return files;
};

// const convertTimeTo24 = (time) => {
//     const hours = parseInt(time.substr(0, 2));
//     if (time.indexOf(/AM|am/g) != -1 && hours == 12) {
//         time = time.replace('12', '0');
//     }
//     if (time.indexOf(/PM|pm/g)  != -1 && hours < 12) {
//         time = time.replace(hours, (hours + 12));
//     }
//     return time.replace(/AM|PM|am|pm/g, '');
// };

// const castTypes = (data, schema) => {
//     let rawDate = '';
//     let keyName = '';
//     for (let key in data) {
//         keyName = key + '_' + schema;
//         if (typeof data[key] === 'object') {
//             data[key] = castTypes(data[key], schema);
//         } else if (containsDate.includes(keyName)) {
//             rawDate = data[key];
//             data[key] = new Date(rawDate);
//         } else if (containsDateAndTime.includes(keyName)) {
//             if (data[key].match(/\d(AM|PM)/g) !== null) {
//                 data[key] = new Date(data[key].replace(/([\0-\377:nonascii:]*?)(AM|PM)/g, '$1 $2'));
//             } else {
//                 data[key] = new Date(data[key]);
//             }
//         } else if (containsTimestampUTC.includes(keyName)) {
//             data[key] = new Date(Number(data[key]) * 1000);
//         } else if (containsTimestamp.includes(keyName)) {
//             data[key] = new Date(data[key]);
//         } else if (containsTime.includes(keyName)) {
//             data[key] = new Date(rawDate + ' ' + data[key]);
//         } else if (typeof Number(data[key]) === 'number' && !isNaN(data[key]) && !isNotNumber.includes(key)) {
//             data[key] = Number(data[key]);
//         }
//     }
//     return data;
// };

const validation = async (data: any, validators: {path: string, name: string }[], uuid: string) => {
    return await Promise.all(validators.map(async (schemaObj: any) => {
        //console.log(schemaObj.path);
        const schema = require('.' + schemaObj.path);
        const valid = await ajv.validate(schema, data);
        if (valid) {
            const brandAndSchema = schemaObj.name.split('-');
            // return ({
            //     brand: brandAndSchema[0],
            //     schema: brandAndSchema[1],
            //     data: castTypes(data, schemaObj.name)
            // });
            return new Cast(data, brandAndSchema, uuid).insert();
        }
    })).then(obj => obj.filter(x => x).flat());
};

const insertCSV = async (path: string, validators: any, db: any, userId: string, uuid: string) => {
    let parser: Readable;
    await new Promise<void>(resolve => {
        const middleware  = fs.createReadStream(path)
            .pipe(ReplaceStream(samsungInvalid, () => {
                middleware.destroy();
                parser = fs.createReadStream(path)
                    .pipe(ReplaceStream(/com.samsung.health.\w+.\w+,\d+,\d+\n|com.samsung.shealth.\w+.\w+,\d+,\d+\n/, ''))
                    .pipe(ReplaceStream(/,\n/g, '\n'))
                    .pipe(stripBomStream())
                    .pipe(csvParser());
                resolve();
                return '';
            }))
            .pipe(ReplaceStream(xiaomiInvalid, () => {
                middleware.destroy();
                parser = fs.createReadStream(path)
                    .pipe(ReplaceStream(/date,lastSyncTime,heartRate,timestamp[\n]*/, 'lastSyncTime,heartRate\n'))
                    .pipe(stripBomStream())
                    .pipe(csvParser());
                resolve();
                return '';
            }));
        middleware.on('finish', () => {
            parser = fs.createReadStream(path).pipe(stripBomStream()).pipe(csvParser());
            resolve();
        });
        middleware.on('error', () => {});
    });
    let buffer: Promise<any[]>[] = [];
    await new Promise<void>(resolve => {
        parser.on('data', async (data) => {
            //console.log(data);
            buffer.push(validation(data, validators, uuid));
            if (buffer.length > bufferLength) {
                parser.pause();
                Promise.all(buffer).then(x => {
                    return db.collection(userId).insertMany(x.flat());
                }).then(() => {
                    parser.resume();
                }).catch(() => {});
                buffer = [];
            }
        }).on('end', async () => {
            if (buffer.length > 0) {
                try {
                    await db.collection(userId).insertMany((await Promise.all(buffer)).flat());
                } catch (error) {
                    //console.error(error);
                }
            }
            resolve();
        }).on('error', async (e) => {
            //console.error(e);
            resolve();
        });
    });
};

const insertXML = async (path: string, validators: any, db: any, userId: string, uuid: string) => {
    const parser = bigXml.createReader(path, /^(Me|Record|Workout|ActivitySummary)$/);
    let buffer: Promise<any[]>[] = [];
    await new Promise<void>(resolve => {
        parser.on('record', async (data: any) => {
            //console.log(data);
            if (data.children != null) {
                //console.log(data);
                if (data.children[0].children != null) {
                    data.attrs.children = data.children[0].children.map((x: any) => x.attrs);
                } else if (data.children != null) {
                    data.attrs.children = data.children.map((x: any) => x.attrs);
                }
            }
            buffer.push(validation(data.attrs, validators, uuid));
            if (buffer.length > bufferLength) {
                parser.pause();
                Promise.all(buffer).then(x => {
                    return db.collection(userId).insertMany(x.flat());
                }).then(() => {
                    parser.resume();
                }).catch(() => {});
                buffer = [];
            }
        }).on('end', async ()=>{
            if (buffer.length > 0) {
                try {
                    await db.collection(userId).insertMany((await Promise.all(buffer)).flat());
                } catch (error) {
                    //console.error(error);
                }
            }
            resolve();
        }).on('error', async (e: Error) => {
            //console.error(e);
            resolve();
        });
    });
};

const insertJSON = async (path: string, validators: any, db: any, userId: string, uuid: string) => {
    let parser: Readable;
    await new Promise<void>(resolve => {
        const middleware = fs.createReadStream(path)
            .pipe(ReplaceStream(fitbitInvalid, () => {
                middleware.destroy();
                parser = fs.createReadStream(path)
                    .pipe(ReplaceStream(/\{/g, '{"' + path.replace(/^.*[\\\/]/, '').split('-')[0] + '":"null",'))
                    .pipe(streamJson.withParser());
                resolve();
                return '';
            })as Transform)
            .pipe(ReplaceStream(garminInvalid, () => {
                middleware.destroy();
                parser = fs.createReadStream(path)
                    .pipe(ReplaceStream(/\[[\n ]*\{[\n ]*"summarizedActivitiesExport"[\n ]*\:[\n ]*\[/, '['))
                    .pipe(ReplaceStream(/\}\]\}\]/, '}]'))
                    .pipe(streamJson.withParser());
                resolve();
                return '';
            })as Transform)
            .pipe(ReplaceStream(garminObjectInvalid, () => {
                middleware.destroy();
                parser = fs.createReadStream(path)
                    .pipe(ReplaceStream(/\{/, '[{'))
                    .pipe(ReplaceStream('\}', '}]'))
                    .pipe(streamJson.withParser());
                resolve();
                return '';
            })as Transform);
        console.log(9);
        //console.log(middleware);
        // middleware.on('data', (data: any) => {
        //     //console.log(data);
        // });
        middleware.on('end', () => {
            console.log(1);
            parser = fs.createReadStream(path).pipe(streamJson.withParser());
            resolve();
        });
        middleware.on('error', () => {});
    });
    console.log(8);
    let buffer: Promise<any[]>[] = [];
    await new Promise<void>(resolve => {
        parser.on('data', async (data: any) => {
            buffer.push(validation(data.value, validators, uuid));
            //console.log(data);
            if (buffer.length > bufferLength) {
                parser.pause();
                Promise.all(buffer).then(x => {
                    return db.collection(userId).insertMany(x.flat());
                }).then(() => {
                    parser.resume();
                }).catch((e) => {
                    console.log(e);
                });
                buffer = [];
            }
        }).on('end', async () => {
            if (buffer.length > 0) {
                try {
                    await db.collection(userId).insertMany((await Promise.all(buffer)).flat());
                } catch (error) {
                    console.error(error);
                }
            }
            resolve();
        }).on('error', async (e) => {
            console.error(e);
            resolve();
        });
    });
};

export async function main(userId: string) {
    const client = await new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true, forceServerObjectId: true }).connect();
    const db = client.db('wearmerge');
    // db.dropDatabase();
    // await db.dropCollection(userId);

    const validators = await getFiles('./validators/');
    const uploadsFiles = await getFiles(path.join('uploads', userId, '/'));
    
    let uuid = new Map();

    if (uploadsFiles.length === 0) {
        console.log('Error');
    } else {
        await Promise.all(uploadsFiles.map(async obj => {
            const dirs = obj.path.split(path.sep);
            let key = null;
            if (dirs[2].includes('/')) {
                // Windows OS
                key = dirs[2].split('/')[0];
            } else {
                // Linux OS
                key = dirs[2];
            }
            if (!uuid.has(key)) {
                uuid.set(key, uuidv4());
            }
            const fileType = obj.name.substr(obj.name.lastIndexOf('.') + 1);
            if (fileType === 'csv') {
                await insertCSV(obj.path, validators, db, userId, uuid.get(key));
            } else if (fileType === 'json') {
                await insertJSON(obj.path, validators, db, userId, uuid.get(key));
            } else if (fileType === 'xml') {
                await insertXML(obj.path, validators, db, userId, uuid.get(key));
            }
        }));
    }
    await client.close();
}

//main('uploader_2');