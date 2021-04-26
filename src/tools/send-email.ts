import sgMail from '@sendgrid/mail';
import { mongoDb } from '../mongo';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (sessionId: string) => {
    const db = await mongoDb();
    const session = await db.collection('session').findOne({ sessionId: sessionId })
    const link = (process.env.NODE_ENV === 'production') ?  process.env.URL + '/download/' + sessionId : 'http://localhost:4200/download/' + sessionId;
    const msg = {
        to: session.email,
        from: process.env.EMAIL,
        subject: 'Your files are ready via WearMerge',
        text: 'WearMerge\nDownload link - Expires in 7 days\n',
        html: '<h1>WearMerge</h1><strong>Download link - Expires in 7 days</strong><br><a href="' + link + '">' + link +'</a>'
    };
    await sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.log(error)
            console.log(error.response.body.errors);
        });
}
