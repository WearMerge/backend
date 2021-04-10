import { mongoConnect } from './mongo';
import express from 'express';
import cors from 'cors';
import { router } from './router';
import { bullConnect } from './bull';

const app = express();
const port = process.env.PORT || 3000;
const prod = process.env.NODE_ENV === 'production';
const mongoURL = prod ? 'mongodb://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@mongo:27017' : 'mongodb://localhost:27017';
const mongoDatabase = 'wearmerge';
const bullSettings = {
    redis: {
        host: prod ? 'redis' : '127.0.0.1',
        port: 6379
    }
};
const bullCPU = 2;

if (!prod) {
    app.use(cors());
}
app.use('/', router);



mongoConnect(mongoURL, mongoDatabase).then(() => {
    bullConnect(bullCPU, bullSettings).then(() => {
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    });
});
