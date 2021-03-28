import fs from 'fs';
import readline from 'readline';
import path from'path';
import xlsx from 'xlsx';

export const fitbitSummary = async (filePath: string) => {
    const parser = readline.createInterface({
        input: fs.createReadStream(filePath)
    });
    const headers = '^Date,Weight,BMI,Fat$|' + 
                    '^Date,Calories In$|' +
                    '^Date,Calories Burned,Steps,Distance,Floors,Minutes Sedentary,Minutes Lightly Active,Minutes Fairly Active,Minutes Very Active,Activity Calories$|' +
                    '^Start Time,End Time,Minutes Asleep,Minutes Awake,Number of Awakenings,Time in Bed,Minutes REM Sleep,Minutes Light Sleep,Minutes Deep Sleep$';
    let toCloseFile = false;
    let counter: number;
    let fileName: string;
    let writer: fs.WriteStream;
    let paths: string[] = [];
    return await new Promise<string[]>(resolve => {
        parser.on('line', line => {
            if (line.match('^Body$|^Foods$|^Activities$|^Sleep$|Food Log')) {
                counter = 0;
                counter++;
                fileName = path.join(path.dirname(filePath), line + '.csv');
            } else if (line.match(headers) && counter === 1) {
                if (toCloseFile) {
                    writer.close();
                } else {
                    toCloseFile = true;
                }
                counter++;
                writer = fs.createWriteStream(fileName, {flags: 'a', encoding: 'utf-8'});
                paths.push(fileName);
                writer.write(line.replace(/ /g, '_'));
            } else if (counter === 2) {
                if (line !== '') {
                    writer.write('\n' + line.replace(/("\d+)\,(\d+")/g, '$1$2'));
                }
            }
        }).on('close', () => {
            //fs.unlinkSync(filePath); 
            resolve(paths);
        }).on('error', async (e) => {
            console.log(e);
            resolve([]);
        });
    });
};

export const huaweiXLS = async (filePath: string) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    if (sheetName === '1-user basic info') {
        const worksheet = workbook.Sheets[sheetName];
        const writer = fs.createWriteStream(path.join(path.dirname(filePath), 'SportsHealth-Data.json'));
        await new Promise<void>(resolve => {
            writer.write(JSON.stringify([{
                weight: worksheet['B1'].v,
                height: worksheet['B2'].v,
                unitType: worksheet['B3'].v,
                modifyTime: worksheet['B4'].v
            }]), () => {
                writer.close();
                fs.unlinkSync(filePath);
                resolve();
            });
        });
    }
};