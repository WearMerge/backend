import sgMail from '@sendgrid/mail';
import { mongoDb } from '../mongo';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (sessionId: string) => {
    const db = await mongoDb();
    const session = await db.collection('session').findOne({ sessionId: sessionId })
    const downloadLink = (process.env.NODE_ENV === 'production') ?  process.env.URL + '/download/' + sessionId : 'http://localhost:4200/download/' + sessionId;
    const analysisLink = (process.env.NODE_ENV === 'production') ?  process.env.URL + '/analysis/' + sessionId : 'http://localhost:4200/analysis/' + sessionId;
    const msg = {
        to: session.email,
        from: process.env.EMAIL,
        subject: 'Your files are ready via WearMerge',
        text: 'WearMerge\nAnalysis & Download link - Expires in 7 days\n',
        html: '<h1>WearMerge</h1><strong>Analysis link - Expires in 7 days</strong><br/><a href="' + analysisLink + '">' + analysisLink +'</a><br/><strong>Download link - Expires in 7 days</strong><br/><a href="' + downloadLink + '">' + downloadLink +'</a>'
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
