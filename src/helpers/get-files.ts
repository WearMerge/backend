import fs from 'fs';

export const getFiles = async (path: string) => {
    const entries = await fs.promises.readdir(path, { withFileTypes: true });
    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter(folder => !folder.isDirectory())
        .map(file => ({ ...file, path: path + file.name }));
    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());
    for (const folder of folders) {
        files.push(...await getFiles(`${path}${folder.name}/`));
    }
    return files;
};
