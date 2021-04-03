import rimraf from 'rimraf';
import fs from 'fs';

export const deleteDir = (dir: string) => {
    return new Promise<void>(resolve => {
        fs.access(dir, fs.constants.F_OK, (err) => {
            if (err) {
                resolve();
            }
            rimraf(dir, () => {
                //send mail
                resolve();
            });
        });
    });
};