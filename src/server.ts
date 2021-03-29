import { mongoConnect } from './mongo';
import express from 'express';
import cors from 'cors';
import Queue from 'bull';
import { router } from './router';

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = 'mongodb://localhost:27017';
const mongoDatabase = 'wearmerge';

const queue = new Queue('data processing', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

app.use(cors());
app.use('/', router);



mongoConnect(mongoURL, mongoDatabase).then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
});
