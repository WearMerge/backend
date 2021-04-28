import { mongoDb } from '../mongo';
import path from 'path';
import Formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { deleteDir } from '../helpers/delete-dir';
import util from 'util';

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
//const rename = util.promisify(fs.rename);
const copy = util.promisify(fs.copyFile);

export const uploadToServer = async (req: any, res: any) => {
    const files: any[] = [];
    const fields: any[] = [];
    const sessionId = uuidv4();
    let form = new Formidable.IncomingForm({
        uploadDir: 'tmp/',
        maxFileSize: 200 * 1024 * 1024
    });
    const db = await mongoDb();
    return await new Promise<string>(resolve => {
        form.on('error', (e) => {
            // send mail for max file error
            console.log(e);
        });
        form.on('file', async (filename, file) => {
            files.push({
                filePath: path.join('uploads', sessionId, file.name),
                dir: path.join('uploads', sessionId, filename),
                path: file.path
            });
        });
        form.on('field', async (fieldName, fieldValue) => {
            fields.push({
                sessionId: sessionId,
                fieldName: fieldName,
                fieldValue: fieldValue
            });
        });
        form.on('end', () => {
            res.status(200).send('uploaded');
        });
        form.parse(req, async () => {
            saveFiles(files).then(() => saveFields(fields, db)).then(() => resolve(sessionId));
        });
    });
};

const saveFiles = async (files: any[]) => {
    await Promise.all(files.map(async (val: any) => {
        await access(val.dir, fs.constants.F_OK).catch(async (err: any) => {
            if (err) {
                await mkdir(val.dir, { recursive: true }).then(async () => {
                    await copy(val.path, val.filePath);
                    await deleteDir(val.path);
                });
            } else {
                await copy(val.path, val.filePath);
                await deleteDir(val.path);
            }
        });
    }));        
};

const saveFields = async (fields: any[], db: any) => {
    await Promise.all(fields.map(async (val: any) => {
        if (val.fieldName === 'email') {
            if (validator.isEmail(val.fieldValue)) {
                await db.collection('session').insertOne({ sessionId: val.sessionId, email: val.fieldValue, createdAt: new Date(), expiredAt: addDays(new Date(), 7) });
            } else {
                await deleteDir(path.join('uploads', val.sessionId));
                //resolve('Invalid e-mail address');
            }
        }
    }));
};

const addDays = (date: Date, days: number) => {
    const obj = new Date(date);
    obj.setDate(obj.getDate() + days);
    return obj
};
