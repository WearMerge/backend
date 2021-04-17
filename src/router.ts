import express from 'express';
import { uploadToServer } from './tools/upload-to-server';
import { bullAddJob } from './bull';
import { join } from 'path';

export const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Welcome to WearMerge!');
});

router.get('/download/:sessionId', async (req, res) => {
    res.download(join('downloads', req.params.sessionId + '.zip'));
});

router.post('/upload-file', (req, res) => {
    uploadToServer(req, res).then(async (sessionId) => {
        if (sessionId !== '') {
            bullAddJob(sessionId);
        }
    });
});