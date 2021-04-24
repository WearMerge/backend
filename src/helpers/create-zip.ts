import AdmZip from 'adm-zip';
import { deleteDir } from '../helpers/delete-dir';
import { join } from 'path';

export const createZip = async (sessionId: string) => {
    const zip = new AdmZip();
    const path = join('downloads', sessionId);
    return await new Promise<void>(resolve => {
        zip.addLocalFolder(path);
        zip.writeZip(path + '.zip', async () => {
            await deleteDir(path);
            resolve();
        });
    });
};