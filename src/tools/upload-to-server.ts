import { mongoDb } from '../mongo';
import path from 'path';
import Formidable from 'formidable';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const uploadToServer = async (req: any, res: any) => {
    const sessionId = uuidv4();
    let form = new Formidable.IncomingForm({
        uploadDir: 'tmp/'
    });
    return await new Promise<string>(resolve => {
        form.on('file', (filename, file) => {
            const dir = path.join('uploads', sessionId, filename);
            fs.access(dir, fs.constants.F_OK, (err) => {
                if (err) {
                    fs.mkdir(dir, { recursive: true }, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        fs.rename(file.path, path.join(dir, file.name), () => {});
                    });
                } else {
                    fs.rename(file.path, path.join(dir, file.name), () => {});
                }
            });
        });
        form.on('end', async () => {
            await setupSessionToDB(sessionId);
            res.status(200).send(sessionId);
            resolve(sessionId);
        });
        form.parse(req, () => {});
    });
};

const setupSessionToDB = async (sessionId: string) => {
    const db = mongoDb();
    await db.collection('session').insertOne({ sessionId: sessionId, createdAt: new Date() });
    await db.collection('session').createIndex({ "createdAt": 1 }, { expireAfterSeconds: 604800 });
    await db.createCollection(sessionId)
    await db.collection(sessionId).createIndex({ "createdAt": 1 }, { expireAfterSeconds: 604800 });
};