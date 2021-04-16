import express from 'express';
import cors from 'cors';
import { router } from './router';
import { bullConnect } from './bull';
import { router as bullBoard } from 'bull-board';
import Queue from 'bull';

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

if (!prod) {
    app.use(cors());
}
app.use('/', router);
app.use('/bull-board', bullBoard);

const main = async () => {
    await bullConnect(bullCPU, bullSettings);
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
};

main();