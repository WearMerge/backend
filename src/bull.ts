import Queue from 'bull';
import { insertToDB } from './tools/insert-to-db';

let queue: Queue.Queue = null;

export const bullConnect = async (cpu: number, settings: any) => {
    await new Promise<void>(resolve => {
        queue = new Queue('wearmerge', settings);
        queue.process(cpu, async (job) => {
            return insertToDB(job.data.id);
        });
        console.log('Connected to redis');
        resolve();
    });
};

export const bullAddJob = async (sessionId: string) => {
    await queue.add({ id: sessionId });
};