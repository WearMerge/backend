import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (email: string) => {
    const msg = {
        to: email,
        from: process.env.EMAIL,
        subject: 'Your files are ready via WearMerge',
        text: 'WearMerge\nDownload link - Expires on 7 days\n',
        html: '<h1>WearMerge</h1><strong>Download link &middot Expires on 7 days</strong><a href=""></a>'
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        });
};