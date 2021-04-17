import rimraf from 'rimraf';

export const deleteDir = (path: string) => {
    return new Promise<void>(resolve => {
        rimraf(path, async (e: Error) => {
            resolve();
        });
    });
};