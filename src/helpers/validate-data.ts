import { openMHealth } from './cast';

export const validator = async (data: any, validators: {path: string, name: string }[], uuid: string, ajv: any) => {
    return await Promise.all(validators.map(async (schemaObj: any) => {
        const schema = require('.' + schemaObj.path);
        const valid = await ajv.validate(schema, data);
        if (valid) {
            const brandAndSchema = schemaObj.name.split('-');
            return openMHealth(data, { brand: brandAndSchema[0], schema: brandAndSchema[1] }, uuid);
        }
    })).then(obj => obj.filter(x => x).flat());
};