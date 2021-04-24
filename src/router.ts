import express from 'express';
import { uploadToServer } from './tools/upload-to-server';
import { bullAddJob } from './bull';
import { getSession, downloadFile } from './scripts/queries';

export const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Welcome to WearMerge!');
});

router.get('/find-session/:sessionId', async (req, res) => {
    getSession(req.params.sessionId, res);
});

router.get('/download/:sessionId', async (req, res) => {
    downloadFile(req.params.sessionId, res);
});

router.post('/upload-file', (req, res) => {
    uploadToServer(req, res).then(async (sessionId) => {
        if (sessionId !== '') {
            bullAddJob(sessionId);
        }
    });
});