import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileFilter } from './helpers/file-filter'

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

const storage = (sessionId: string) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join('uploads', sessionId, '');
            fs.access(dir, noExist => {
                if (noExist) {
                    return fs.mkdir(dir, err => cb(err, dir));
                }
                return cb(null, dir);
            });
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
};

app.get('/', (req, res) => {
    res.send('Welcome to WearMerge!');
});

app.post('/upload-files', (req, res) => {
    const sessionId = uuidv4();

    const upload = multer({ storage: storage(sessionId), fileFilter: fileFilter}).array('file');

    upload(req, res, (err: any) => {
        console.log(req.files);
        if (!req.files) {
            return res.send('Please select files to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        res.send('Files uploaded with session id: ' + sessionId);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});