import { mongoDb } from '../mongo';
import { join } from 'path';
import { deleteDir } from '../helpers/delete-dir'

export const getSession = async (sessionId: string, res: any) => {
    const db = await mongoDb();
    const session = await db.collection('session').findOne({ sessionId: sessionId });
    if (session === undefined) {
        res.status(404).send('Not found')
    } else {
        if (session.expiredAt >= new Date()) {
            res.status(200).send('Found');
        } else {
            res.status(404).send('Not found')
        }
    }
};

export const downloadFile = async (sessionId: string, res: any) => {
    const db = await mongoDb();
    const session = await db.collection('session').findOne({ sessionId: sessionId });
    if (session === undefined) {
        res.status(404).send('Not found')
    } else {
        if (session.expiredAt >= new Date()) {
            res.download(join('downloads', session.sessionId + '.zip'));
        } else {
            res.status(404).send('Not found');
        }
    }
}

export const deleteSessions = async () => {
    const db = await mongoDb();
    const cursor = await db.collection('session').find({ expiredAt: { $lt: new Date() } });
    while (await cursor.hasNext()) {
        const data = await cursor.next();
        await db.dropCollection(data.sessionId);
        await db.collection('session').deleteOne(data);
        await deleteDir(join('downloads', data.sessionId + '.zip'));
    }
}
