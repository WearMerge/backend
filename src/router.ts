import express from 'express';
import { insertToDB } from './tools/insert-to-db';
import { exportFromDB } from './tools/export-from-db';
import { uploadToServer } from './tools/upload-to-server';
import { bullAddJob } from './bull';
import sgMail from '@sendgrid/mail';
import path from'path';
import { getFiles } from '././helpers/get-files';

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const router = express.Router();

router.get('/', async (req, res) => {
    //await fillValues('uploader_5', mongoDb());
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

// router.get('/mail', (req, res) => {
//     const msg = {
//         to: '',
//         from: '',
//         subject: 'Test mail',
//         text: 'something',
//         html: '<strong>something</strong>'
//     };
//     sgMail
//         .send(msg)
//         .then(() => {
//             console.log('Email sent')
//         })
//         .catch((error) => {
//             console.error(error)
//         });
//     res.status(200).send('E-Mail sent');
// });

router.post('/upload-file', (req, res) => {
    uploadToServer(req, res).then(async (sessionId) => {
        if (sessionId !== '') {
            bullAddJob(sessionId);
        }
        res.status(200).send(sessionId);
    });
    //uploadToServer(req, res);
});