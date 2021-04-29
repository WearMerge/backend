import express from 'express';
import { uploadToServer } from './tools/upload-to-server';
import { bullAddJob } from './bull';
import { getSession, downloadFile } from './scripts/queries';
import { weightPerUser, devicePerUser, agePerUser, genderPerUser } from './scripts/queries';

export const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Welcome to WearMerge!');
});

router.get('/analysis/weight-user/:sessionId', async (req, res) => {
    await weightPerUser(req.params.sessionId, res);
})

router.get('/analysis/device-user/:sessionId', async (req, res) => {
    await devicePerUser(req.params.sessionId, res);
})

router.get('/analysis/age-user/:sessionId', async (req, res) => {
    await agePerUser(req.params.sessionId, res);
})

router.get('/analysis/gender-user/:sessionId', async (req, res) => {
    await genderPerUser(req.params.sessionId, res);
})

router.get('/find-session/:sessionId', async (req, res) => {
    await getSession(req.params.sessionId, res);
});

router.get('/download/:sessionId', async (req, res) => {
    await downloadFile(req.params.sessionId, res);
});

router.post('/upload-file', (req, res) => {
    uploadToServer(req, res).then(async (sessionId) => {
        if (sessionId !== '') {
            bullAddJob(sessionId);
        }
    });
});
