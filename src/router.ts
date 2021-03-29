import express from 'express';
import { insertToDB } from './tools/insert-to-db';
import { exportFromDB } from './tools/export-from-db';
import { uploadToServer } from './tools/upload-to-server';
import { bullAddJob } from './bull';

export const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to WearMerge!');
});

router.get('/export/:sessionId', (req, res) => {
    res.status(200).send('Exporting...');
    exportFromDB(req.params.sessionId);
});

router.get('/insert/:sessionId', (req, res) => {
    res.status(200).send('Inserting...');
    insertToDB(req.params.sessionId);
});

router.post('/upload-file', (req, res) => {
    uploadToServer(req, res).then(async (sessionId) => {
        //insertToDB(sessionId);
        bullAddJob(sessionId);
    });
});