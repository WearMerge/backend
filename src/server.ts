import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import Formidable from 'formidable';

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to WearMerge!');
});

app.post('/upload-file', (req, res) => {
    const sessionId = uuidv4();
    let form = new Formidable.IncomingForm({
        uploadDir: 'tmp/'
    });
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
    form.on('end', () => {
        res.status(200).send(sessionId);
    });
    form.parse(req, () => {});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});