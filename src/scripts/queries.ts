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
};

export const deleteSessions = async () => {
    const db = await mongoDb();
    const cursor = await db.collection('session').find({ expiredAt: { $lt: new Date() } });
    while (await cursor.hasNext()) {
        const data = await cursor.next();
        await db.dropCollection(data.sessionId);
        await db.collection('session').deleteOne(data);
        await deleteDir(join('downloads', data.sessionId + '.zip'));
    }
};

export const periodPerUser = async (sessionId: string, res: any) => {
    const db = await mongoDb();
    const users = await db.collection(sessionId).distinct('uuid');
    const results: Array<{user: string, days: number}> = [];
    await Promise.all(users.map(async (user: string) => {
        const minDateTime = await db.collection(sessionId).findOne(
            {
                uuid: user,
                'data.effective_time_frame.date_time': { $ne: undefined }
            },
            {
                sort: { 'data.effective_time_frame.date_time': 1 }
            }
        );
        const maxDateTime = await db.collection(sessionId).findOne(
            {
                uuid: user,
                'data.effective_time_frame.date_time': { $ne: undefined }
            },
            {
                sort: { 'data.effective_time_frame.date_time': -1 }
            }
        );
        const minStartTime = await db.collection(sessionId).findOne(
            {
                uuid: user,
                'data.effective_time_frame.time_interval.start_date_time': { $ne: undefined }
            },
            {
                sort: { 'data.effective_time_frame.time_interval.start_date_time': 1 }
            }
        );
        const maxEndTime = await db.collection(sessionId).findOne(
            {
                uuid: user,
                'data.effective_time_frame.time_interval.end_date_time': { $ne: undefined }
            },
            {
                sort: { 'data.effective_time_frame.time_interval.end_date_time': -1 }
            }
        );
        let min: Date;
        if (minDateTime !== undefined && minStartTime !== undefined) {
            if (minDateTime.data.effective_time_frame.date_time < minStartTime.data.effective_time_frame.time_interval.start_date_time) {
                min = minDateTime.data.effective_time_frame.date_time;
            } else {
                min = minStartTime.data.effective_time_frame.time_interval.start_date_time;
            }
        } else if (minDateTime !== undefined) {
            min = minDateTime.data.effective_time_frame.date_time;
        } else {
            min = minStartTime.data.effective_time_frame.time_interval.start_date_time;
        }
        let max: Date;
        if (maxDateTime !== undefined && maxEndTime !== undefined) {
            if (maxDateTime.data.effective_time_frame.date_time > maxEndTime.data.effective_time_frame.time_interval.start_date_time) {
                max = maxDateTime.data.effective_time_frame.date_time;
            } else {
                max = maxEndTime.data.effective_time_frame.time_interval.start_date_time;
            }
        } else if (maxDateTime !== undefined) {
            max = maxDateTime.data.effective_time_frame.date_time;
        } else {
            max = maxEndTime.data.effective_time_frame.time_interval.start_date_time;
        }
        const days = Math.ceil(Math.abs(max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24));
        results.push({
            user: user,
            days: days/365
        });
    }));
    res.status(200).send(results);
};

export const weightPerUser = async (sessionId: string, res: any) => {
    const db = await mongoDb();
    const users = await db.collection(sessionId).distinct('uuid');
    const results: any[] = []
    let count = 1;
    await Promise.all(users.map(async (user: string) => {
        const cursor = await db.collection(sessionId).find({ uuid: user, type: 'body_weight' });
        const array = [];
        while (await cursor.hasNext()) {
            const data = await cursor.next();
            if (data.data.effective_time_frame.date_time !== undefined && data.data.effective_time_frame.date_time !== null) {
                array.push({
                    x: data.data.effective_time_frame.date_time,
                    y: data.data.body_weight.value
                });
            } else if (data.data.effective_time_frame.time_interval !== undefined) {
                array.push({
                    x: data.data.effective_time_frame.time_interval.start_date_time,
                    y: data.data.body_weight.value
                });
            }
        }
        results.push({
            label: 'User ' + count++,
            data: array.sort((a, b) => a.x - b.x)
        });
    }));
    res.status(200).send(results);
};

export const devicePerUser = async (sessionId: string, res: any) => {
    const db = await mongoDb();
    const users = await db.collection(sessionId).distinct('uuid');
    const results: any[] = []
    await Promise.all(users.map(async (user: string) => {
        const brand = await db.collection(sessionId).findOne({ uuid: user });
        if (brand === undefined) {
            results.push('N/A');
        } else {
            results.push(brand.brand.charAt(0).toUpperCase() + brand.brand.slice(1));
        }
    }));
    const map = results.sort((a, b) => a.x - b.x).reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    res.status(200).send({
        labels: [...map.keys()],
        data: [...map.values()]
    });
};

export const agePerUser = async (sessionId: string, res: any) => {
    const db = await mongoDb();
    const users = await db.collection(sessionId).distinct('uuid');
    const results: any[] = []
    const now = new Date().getFullYear();
    await Promise.all(users.map(async (user: string) => {
        const demographic = await db.collection(sessionId).findOne({ uuid: user, type: 'demographic' });
        if (demographic === undefined) {
            results.push('N/A');
        } else {
            results.push(now - demographic.data.yearOfBithday);
        }
    }));
    const map = results.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    res.status(200).send({
        labels: [...map.keys()],
        data: [...map.values()]
    });
};

export const genderPerUser = async (sessionId: string, res: any) => {
    const db = await mongoDb();
    const users = await db.collection(sessionId).distinct('uuid');
    const results: any[] = []
    await Promise.all(users.map(async (user: string) => {
        const demographic = await db.collection(sessionId).findOne({ uuid: user, type: 'demographic' });
        if (demographic === undefined) {
            results.push('N/A');
        } else {
            results.push(demographic.data.gender);
        }
    }));
    const map = results.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    res.status(200).send({
        labels: [...map.keys()],
        data: [...map.values()]
    });
};