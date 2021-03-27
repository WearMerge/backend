export const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'text/json' || file.mimetype === 'text/xml' || file.mimetype === 'text/xls') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};