import { mongoDb } from '../mongo';
import path from 'path';
import Formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { deleteDir } from '../helpers/delete-dir';

export const uploadToServer = async (req: any, res: any) => {
    const sessionId = uuidv4();
    let form = new Formidable.IncomingForm({
        uploadDir: 'tmp/',
        maxFileSize: 200 * 1024 * 1024
    });
    const db = mongoDb();
    return await new Promise<string>(resolve => {
        form.on('error', (e) => {
            // send mail for max file error
            console.log(e);
        });
        form.on('file', async (filename, file) => {
            const filePath = path.join('uploads', sessionId, file.name);
            const dir = path.join('uploads', sessionId, filename);
            fs.access(dir, fs.constants.F_OK, (err) => {
                if (err) {
                    fs.mkdir(dir, { recursive: true }, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        fs.rename(file.path, filePath, () => {});
                    });
                } else {
                    fs.rename(file.path, filePath, () => {});
                }
            });
        });
        form.on('field', async (fieldName, fieldValue) => {
            if (fieldName === 'email') {
                if (validator.isEmail(fieldValue)) {
                    await db.collection('session').insertOne({ sessionId: sessionId, email: fieldValue });
                } else {
                    deleteDir(path.join('uploads', sessionId));
                    resolve('Invalid e-mail address');
                }
            }
        });
        form.on('end', async () => {
            //await setupSessionToDB(sessionId);
            fs.access(path.join('uploads', sessionId), fs.constants.F_OK, async (err) => {
                if (err) {
                    await db.collection('session').deleteOne({ sessionId: sessionId });
                }
                resolve(sessionId);
            });
        });
        form.parse(req, () => {});
    });
};

const setupSessionToDB = async (sessionId: string) => {
    const db = mongoDb();
    //await db.createCollection(sessionId)
    //await db.collection(sessionId).createIndex({ "createdAt": 1 }, { expireAfterSeconds: 604800 });
};