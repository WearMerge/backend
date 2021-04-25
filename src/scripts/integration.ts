import { insertToDB } from '../tools/insert-to-db';
import { exportFromDB } from '../tools/export-from-db';
import { createZip } from '../helpers/create-zip';
import { sendEmail } from '../tools/send-email'

export const integration = async (sessionId: string) => {
    await insertToDB(sessionId)
    await exportFromDB(sessionId);
    await createZip(sessionId);
    await sendEmail(sessionId);
    console.log('end');
};
