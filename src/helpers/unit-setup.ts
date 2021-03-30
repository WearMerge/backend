export const unitSetup = async (sessionId: string, db: any) => {
    await new Promise<void>(async (resolve) => {
        const parser = await db.collection(sessionId).find({ type: 'unit' }).stream();
        parser.on('data', async (data:any) => {
            parser.pause();
            const cursor = await db.collection(sessionId).find({ brand: data.brand }).stream();
            cursor.on('data', (doc:any) => {
                cursor.pause();
                if (doc.brand === 'xiaomi') {
                    
                } else if (doc.brand === 'fitbit') {

                }
                cursor.resume();
            }).on('close', () => {
                parser.resume();
            });
        }).on('close', () => {
            resolve();
        });
    });
};