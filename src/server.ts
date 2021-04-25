import express from 'express';
import cors from 'cors';
import { router } from './router';
import { bullConnect } from './bull';
import { router as bullBoard } from 'bull-board';
import Queue from 'bull';
import cron from 'node-cron';
import { deleteSessions } from './scripts/queries';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;
const prod = process.env.NODE_ENV === 'production';
const bullSettings: Queue.QueueOptions = {
    redis: {
        host: prod ? 'redis' : '127.0.0.1',
        port: 6379
    },
    settings: {
        //stalledInterval: 0
    }
};
const bullCPU = 1;

cron.schedule('* * * 1 * *', () => {
    deleteSessions();
    console.log('Clearing db')
});

if (!prod) {
    app.use(cors());
    app.use('/bull-board', bullBoard);
}
app.use('/', router);

// const createDir = (name: string) => {
//     try {
//         fs.mkdirSync(name);
//     } catch (e: any) {

//     }
// };

const main = async () => {
    await bullConnect(bullCPU, bullSettings);
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
};

main();
