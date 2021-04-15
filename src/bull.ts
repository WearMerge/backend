import Queue from 'bull';
import { setQueues, BullAdapter } from 'bull-board'
import { insertToDB } from './tools/insert-to-db';
import { join } from 'path';

let queue: Queue.Queue = null;

export const bullConnect = async (cpu: number, settings: Queue.QueueOptions) => {
    console.log(__dirname);
    await new Promise<void>(resolve => {
        queue = new Queue('wearmerge', settings);
        queue.process(cpu, join(__dirname, '/processors/processor.js'));
        setQueues([
            new BullAdapter(queue)
        ]);
        console.log('Connected to redis');
        resolve();
    });
};

export const bullAddJob = async (sessionId: string) => {
    await queue.add({ id: sessionId });
};