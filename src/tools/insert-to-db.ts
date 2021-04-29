import { mongoDb } from '../mongo';
import fs from 'fs';
import csvParser from 'csv-parser';
import stripBomStream from 'strip-bom-stream';
import streamJson, { Readable, Transform } from 'stream-json/streamers/StreamArray';
import bigXml from 'big-xml';
import path from'path';
import {v4 as uuidv4 } from 'uuid';
import ReplaceStream from 'replacestream';
import { getFiles } from '../helpers/get-files';
import { fitbitSummary, huaweiXLS, samsungProfile } from '../helpers/reconstruct-files';
import { validator } from '../helpers/validate-data';
import Ajv from 'ajv';
import { deleteDir } from '../helpers/delete-dir';

const ajv = new Ajv({strict: false});

const bufferLength = 100000;

const xiaomiInvalid = new RegExp(/date,lastSyncTime,heartRate,timestamp[\n]*/);
const fitbitSummaryInvalid = new RegExp(/Body\nDate,Weight,BMI,Fat|Food\nDate,Calories In|Activities\nDate,Calories Burned,Steps,Distance,Floors,Minutes Sedentary,Minutes Lightly Active,Minutes Fairly Active,Minutes Very Active,Activity Calories|Sleep\nStart Time,End Time,Minutes Asleep,Minutes Awake,Number of Awakenings,Time in Bed,Minutes REM Sleep,Minutes Light Sleep,Minutes Deep Sleep|Food Log/);
// const fitbitInvalid = new RegExp(/\[[\n ]*\{[\n ]*"logId"[\n ]*\:[\n ]*\d*[\n ]*\,[\n ]*"dateOfSleep"/);
const fitbitInvalid = new RegExp(/\[\{[\n ]*"dateTime"[\n ]*\:[\0-\377:nonascii:]*?,[\n ]*"value"[\n ]*:[\n ]*"[\0-\377:nonascii:]*?"[\n ]*\}/);
const garminInvalid = new RegExp(/\[[\n ]*\{[\n ]*"summarizedActivitiesExport"[\n ]*\:[\n ]*\[/);
const garminObjectInvalid = new RegExp(/\{[\n ]*"userName"[\0-\377:nonascii:]*?\"firstName"|\{[\n ]*"preferredLocale"[\0-\377:nonascii:]*?\"stepLengths"/);
const huaweiInvalid = new RegExp(/\[[\n ]*\{[\n ]*"sportDataUserData"[\n ]*\:[\n ]*\[/);
const samsungInvalid = new RegExp(/com.samsung.health.\w+.\w+,\d+,\d+\n|com.samsung.shealth.\w+.\w+,\d+,\d+\n/);
const samsungProfileInvalid = new RegExp(/com.samsung.health.\w+.\w+,\d+,\d+\ntext_value,float_value,update_time,create_time,long_value,key,blob_value,int_value,deviceuuid,pkg_name,double_value,datauuid\n/);

const insertCSV = async (path: string, validators: any, db: any, sessionId: string, uuid: string) => {
    let parser: Readable;
    let hasMiddleWare = false;
    let isSamsung = false;
    let isXiaomi = false;
    const isFinished = await new Promise<boolean>(resolve => {
        const middleware  = fs.createReadStream(path)
            .pipe(ReplaceStream(samsungProfileInvalid, () => {
                hasMiddleWare = true;
                resolve(samsungProfile(path, validators, db, sessionId, uuid, bufferLength, ajv));
                return '';
            })as Transform)
            .pipe(ReplaceStream(samsungInvalid, () => {
                hasMiddleWare = true;
                isSamsung = true;
                return '';
            })as Transform)
            .pipe(ReplaceStream(xiaomiInvalid, () => {
                hasMiddleWare = true;
                isXiaomi = true;
                return '';
            })as Transform)
            .pipe(ReplaceStream(fitbitSummaryInvalid, () => {
                hasMiddleWare = true;
                resolve(fitbitSummary(path, validators, db, sessionId, uuid, bufferLength, ajv));
                return '';
            })as Transform);
        middleware.on('data', () => {});
        middleware.on('end', () => {
            if (!hasMiddleWare) {
                parser = fs.createReadStream(path).pipe(stripBomStream()).pipe(csvParser());
            } else {
                if (isSamsung) {
                    parser = fs.createReadStream(path)
                        .pipe(ReplaceStream(/com.samsung.health.\w+.\w+,\d+,\d+\n|com.samsung.shealth.\w+.\w+,\d+,\d+\n/, ''))
                        .pipe(ReplaceStream(/,\n/g, '\n'))
                        .pipe(stripBomStream())
                        .pipe(csvParser());
                } else if (isXiaomi) {
                    parser = fs.createReadStream(path)
                        .pipe(ReplaceStream(/date,lastSyncTime,heartRate,timestamp[\n]*/, 'lastSyncTime,heartRate\n'))
                        .pipe(stripBomStream())
                        .pipe(csvParser());
                }
            }
            resolve(false)
        });
        middleware.on('error', (e: Error) => {
            //console.log(e);
        });
    });
    if (isFinished) {
        return;
    }
    let buffer: Promise<any[]>[] = [];
    await new Promise<void>(resolve => {
        parser.on('data', async (data) => {
            buffer.push(validator(data, validators, uuid, ajv));
            if (buffer.length > bufferLength) {
                parser.pause();
                Promise.all(buffer).then(x => {
                    const array = x.flat();
                    if (array.length) {
                        return db.collection(sessionId).insertMany(x);
                    }
                    // return db.collection(sessionId).insertMany(x.flat());
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
                    const array = (await Promise.all(buffer)).flat();
                    if (array.length) {
                        await db.collection(sessionId).insertMany(array);
                    }
                    // await db.collection(sessionId).insertMany((await Promise.all(buffer)).flat());
                } catch (error) {
                    console.log(error);
                }
            }
            resolve();
        }).on('error', async (e) => {
            //console.log(e);
            resolve();
        });
    });
};

const insertXML = async (path: string, validators: any, db: any, sessionId: string, uuid: string) => {
    const parser = bigXml.createReader(path, /^(Me|Record|Workout|ActivitySummary)$/);
    let buffer: Promise<any[]>[] = [];
    await new Promise<void>(resolve => {
        parser.on('record', async (data: any) => {
            if (data.children != null) {
                if (data.children[0].children != null) {
                    data.attrs.children = data.children[0].children.map((x: any) => x.attrs);
                } else if (data.children != null) {
                    data.attrs.children = data.children.map((x: any) => x.attrs);
                }
            }
            buffer.push(validator(data.attrs, validators, uuid, ajv));
            if (buffer.length > bufferLength) {
                parser.pause();
                Promise.all(buffer).then(x => {
                    const array = x.flat();
                    if (array.length) {
                        return db.collection(sessionId).insertMany(x);
                    }
                }).then(() => {
                    parser.resume();
                }).catch((e) => {
                    console.log(e);
                });
                buffer = [];
            }
        }).on('end', async ()=>{
            if (buffer.length > 0) {
                try {
                    const array = (await Promise.all(buffer)).flat();
                    if (array.length) {
                        await db.collection(sessionId).insertMany(array);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            resolve();
        }).on('error', async (e: Error) => {
            //console.log(e);
            resolve();
        });
    });
};

const insertJSON = async (path: string, validators: any, db: any, sessionId: string, uuid: string) => {
    let parser: Readable;
    let hasMiddleWare = false;
    let isFitbit = false;
    let isGarmin = false;
    let isGarminObject = false;
    let isHuawei = false;
    await new Promise<void>(resolve => {
        const middleware = fs.createReadStream(path)
            .pipe(ReplaceStream(fitbitInvalid, () => {
                hasMiddleWare = true;
                isFitbit = true;
                return '';
            })as Transform)
            .pipe(ReplaceStream(garminInvalid, () => {
                hasMiddleWare = true;
                isGarmin = true;  
                return '';
            })as Transform)
            .pipe(ReplaceStream(garminObjectInvalid, () => {
                hasMiddleWare = true;
                isGarminObject = true;
                return '';
            })as Transform)
            .pipe(ReplaceStream(huaweiInvalid, () => {
                hasMiddleWare = true;
                isHuawei = true;
                return '';
            })as Transform);
        middleware.on('data', () => {});
        middleware.on('end', () => {
            if (!hasMiddleWare) {
                parser = fs.createReadStream(path).pipe(streamJson.withParser());
            } else {
                if (isFitbit) {
                    parser = fs.createReadStream(path)
                        .pipe(ReplaceStream(/\{/g, '{"' + path.replace(/^.*[\\\/]/, '').split('-')[0] + '":"null",'))
                        .pipe(streamJson.withParser());
                } else if (isGarmin) {
                    parser = fs.createReadStream(path)
                        .pipe(ReplaceStream(/\[[\n ]*\{[\n ]*"summarizedActivitiesExport"[\n ]*\:[\n ]*\[/, '['))
                        .pipe(ReplaceStream(/\}\]\}\]/, '}]'))
                        .pipe(streamJson.withParser());
                } else if (isGarminObject) {
                    parser = fs.createReadStream(path)
                        .pipe(ReplaceStream(/\{/, '[{'))
                        .pipe(ReplaceStream(/\}$/, '}]'))
                        .pipe(streamJson.withParser());
                } else if (isHuawei) {
                    parser = fs.createReadStream(path)
                        .pipe(ReplaceStream(/\{[\n ]*"sportDataUserData"[\n ]*\:[\n ]*\[|\][\n ]*\,[\n ]*"timeZone"[\n ]*\:[\n ]*"\+\d+"[\n ]*\,[\n ]*"recordDay"[\n ]*\:[\n ]*\d+[\n ]*\,[\n ]*"version"[\n ]*\:[\n ]*\d+[\n ]*\}/g, ''))
                        .pipe(streamJson.withParser());
                }
            }
            resolve();
        });
        middleware.on('error', () => {});
    });
    let buffer: Promise<any[]>[] = [];
    await new Promise<void>(resolve => {
        parser.on('data', async (data: any) => {
            buffer.push(validator(data.value, validators, uuid, ajv));
            if (buffer.length > bufferLength) {
                parser.pause();
                Promise.all(buffer).then(x => {
                    const array = x.flat();
                    if (array.length) {
                        return db.collection(sessionId).insertMany(x);
                    }
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
                    const array = (await Promise.all(buffer)).flat();
                    if (array.length) {
                        await db.collection(sessionId).insertMany(array);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            resolve();
        }).on('error', async (e) => {
            //console.log(e);
            resolve();
        });
    });
};

export const insertToDB = async (sessionId: string) => {
    const db = await mongoDb();
    const validators = await getFiles('./validators/');
    const uploadsFiles = await getFiles(path.join('uploads', sessionId, '/'));
    
    let uuid = new Map();

    console.log("files: ",uploadsFiles.length);
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
            //console.log(obj.path);
            if (fileType === 'csv') {
                await insertCSV(obj.path, validators, db, sessionId, uuid.get(key));
            } else if (fileType === 'json') {
                await insertJSON(obj.path, validators, db, sessionId, uuid.get(key));
            } else if (fileType === 'xml') {
                await insertXML(obj.path, validators, db, sessionId, uuid.get(key));
            } else if (fileType === 'xls') {
                await huaweiXLS(obj.path, validators, db, sessionId, uuid.get(key), bufferLength, ajv);
            }
        }));
        await deleteDir(path.join('uploads', sessionId));
    }
}
