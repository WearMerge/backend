import { insertToDB } from '../tools/insert-to-db';
import { exportFromDB } from '../tools/export-from-db';
import { createZip } from '../helpers/create-zip';

export const integration = async (sessionId: string) => {
    await insertToDB(sessionId)
    await exportFromDB(sessionId);
    await createZip(sessionId);
    console.log('end');
};