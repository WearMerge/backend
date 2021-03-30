export const fillValues = async (sessionId: string, db: any) => {
    await fitbit(sessionId, db);
    await xiaomi(sessionId, db);
    await samsung(sessionId, db);
};

const fitbit = async (sessionId: string, db: any) => {
    await new Promise<void>(async (resolve) => {
        const cursor = await db.collection(sessionId).find({ brand: 'fitbit', type: 'physical_activity' });
        while (await cursor.hasNext()) {
            const data = await cursor.next();
            const steps = await db.collection(sessionId).findOne({ uuid: data.uuid, type: 'step_count', "data.effective_time_frame.date_time": data.data.effective_time_frame.date_time });
            const heightMax = await db.collection(sessionId).find({ uuid: data.uuid, type: 'body_height', "data.effective_time_frame.date_time": { $gte: data.data.effective_time_frame.date_time }}).sort({ "data.effective_time_frame.date_time": 1 }).limit(1).toArray();
            const heightMin = await db.collection(sessionId).find({ uuid: data.uuid, type: 'body_height', "data.effective_time_frame.date_time": { $lt: data.data.effective_time_frame.date_time }}).sort({ "data.effective_time_frame.date_time": -1 }).limit(1).toArray();
            let height: any;
            if (heightMax.length && heightMin.length) {
                const max = Math.abs(heightMax[0].data.effective_time_frame.date_time - steps.data.effective_time_frame.date_time);
                const min = Math.abs(heightMin[0].data.effective_time_frame.date_time - steps.data.effective_time_frame.date_time);
                if (max < min) {
                    height = heightMax[0];
                } else {
                    height = heightMin[0];
                }
            } else if (heightMax.length) {
                height = heightMax[0];
            } else if (heightMin.length) {
                height = heightMin[0];
            } else {
                height = await db.collection(sessionId).findOne({ uuid: data.uuid, type: 'body_height' });
            }
            if (height !== undefined && steps !== undefined) {
                const distance = steps.data.step_count.value * height.data.body_height.value * 0.414 / 100000;
                const duration = await db.collection(sessionId).findOne({ uuid: data.uuid, type: 'pace', "data.effective_time_frame.date_time": data.data.effective_time_frame.date_time });
                await db.collection(sessionId).updateOne(
                    { _id: duration._id },
                    { $set: { "data.pace.value":  (duration.data.pace.value/60000) / distance} }
                );
                await db.collection(sessionId).updateOne(
                    { _id: data._id },
                    { $set: { "data.distance.value":  distance} }
                );
            }
        }
        resolve();
    });
};

const xiaomi = async (sessionId: string, db: any) => {
    await new Promise<void>(async (resolve) => {
        const cursor = await db.collection(sessionId).find({ brand: 'xiaomi', type: 'physical_activity', 'data.activity_name': 'running' });
        while (await cursor.hasNext()) {
            const data = await cursor.next();
            const paceMax = await db.collection(sessionId).find({ uuid: data.uuid, type: 'pace', "data.effective_time_frame.date_time": { $gte: data.data.effective_time_frame.date_time }}).sort({ "data.effective_time_frame.date_time": 1 }).limit(1).toArray();
            const paceMin = await db.collection(sessionId).find({ uuid: data.uuid, type: 'pace', "data.effective_time_frame.date_time": { $lt: data.data.effective_time_frame.date_time }}).sort({ "data.effective_time_frame.date_time": -1 }).limit(1).toArray();
            let pace: any;
            if (paceMax.length && paceMin.length) {
                const max = Math.abs(paceMax[0].data.effective_time_frame.date_time - data.data.effective_time_frame.date_time);
                const min = Math.abs(paceMin[0].data.effective_time_frame.date_time - data.data.effective_time_frame.date_time);
                if (max < min) {
                    pace = paceMax[0];
                } else {
                    pace = paceMin[0];
                }
            } else if (paceMax.length) {
                pace = paceMax[0];
            } else {
                pace = paceMin[0];
            }
            const weightMax = await db.collection(sessionId).find({ uuid: data.uuid, type: 'body_weight', "data.effective_time_frame.date_time": { $gte: data.data.effective_time_frame.date_time }}).sort({ "data.effective_time_frame.date_time": 1 }).limit(1).toArray();
            const weightMin = await db.collection(sessionId).find({ uuid: data.uuid, type: 'body_weight', "data.effective_time_frame.date_time": { $lt: data.data.effective_time_frame.date_time }}).sort({ "data.effective_time_frame.date_time": -1 }).limit(1).toArray();
            let weight: any;
            if (weightMax.length && weightMin.length) {
                const max = Math.abs(weightMax[0].data.effective_time_frame.date_time - data.data.effective_time_frame.date_time);
                const min = Math.abs(weightMin[0].data.effective_time_frame.date_time - data.data.effective_time_frame.date_time);
                if (max < min) {
                    weight = weightMax[0];
                } else {
                    weight = weightMin[0];
                }
            } else if (weightMax.length) {
                weight = weightMax[0];
            } else if (weightMin.length) {
                weight = weightMin[0];
            } else {
                weight = await db.collection(sessionId).findOne({ uuid: data.uuid, type: 'body_weight' });
            }
            const totalDistance = await db.collection(sessionId).findOne({ uuid: data.uuid, type: 'physical_activity', 'data.activity_name': 'walking', "data.effective_time_frame.date_time": data.data.effective_time_frame.date_time });
            if (pace !== undefined && weight !== undefined && totalDistance !== undefined) {
                const totalDuration = pace.data.pace.value * totalDistance.data.distance.value;
                let met = (200*totalDistance.data.kcal_burned.value) / (totalDuration*3.5*weight.data.body_weight.value);
                if (isNaN(met)) {
                    met = 0;
                }
                const duration = pace.data.pace.value * data.data.distance.value;
                await db.collection(sessionId).updateOne(
                    { _id: data._id },
                    { $set: { "data.kcal_burned.value": duration*(met*3.5*weight.data.body_weight.value)/200 } }
                );
            }
        }
        resolve();
    });
};

const samsung = async (sessionId: string, db: any) => {
    await new Promise<void>(async (resolve) => {
        const cursor = await db.collection(sessionId).find({ brand: 'samsung', type: 'physical_activity', 'data.activity_name': 'running' });
        while (await cursor.hasNext()) {
            const data = await cursor.next();
            const weightMax = await db.collection(sessionId).find({ uuid: data.uuid, type: 'body_weight', "data.effective_time_frame.date_time": { $gte: data.data.effective_time_frame.date_time }}).sort({ "data.effective_time_frame.date_time": 1 }).limit(1).toArray();
            const weightMin = await db.collection(sessionId).find({ uuid: data.uuid, type: 'body_weight', "data.effective_time_frame.date_time": { $lt: data.data.effective_time_frame.date_time }}).sort({ "data.effective_time_frame.date_time": -1 }).limit(1).toArray();
            let weight: any;
            if (weightMax.length && weightMin.length) {
                const max = Math.abs(weightMax[0].data.effective_time_frame.date_time - data.data.effective_time_frame.date_time);
                const min = Math.abs(weightMin[0].data.effective_time_frame.date_time - data.data.effective_time_frame.date_time);
                if (max < min) {
                    weight = weightMax[0];
                } else {
                    weight = weightMin[0];
                }
            } else if (weightMax.length) {
                weight = weightMax[0];
            } else {
                weight = weightMin[0];
            }
            const totalDistance = await db.collection(sessionId).findOne({ uuid: data.uuid, type: 'physical_activity', 'data.activity_name': 'walking', "data.effective_time_frame.date_time": data.data.effective_time_frame.date_time });
            const pace = await db.collection(sessionId).findOne({ uuid: data.uuid, type: 'pace', "data.effective_time_frame.date_time": data.data.effective_time_frame.date_time });
            const calories = await db.collection(sessionId).findOne({ uuid: data.uuid, type: 'calories_burned', "data.effective_time_frame.date_time": data.data.effective_time_frame.date_time });
            if (pace !== undefined && weight !== undefined && totalDistance !== undefined) {
                const totalDuration = pace.data.pace.value * totalDistance.data.distance.value;
                let met = (200*calories.data.kcal_burned.value) / (totalDuration*3.5*weight.data.body_weight.value);
                if (isNaN(met)) {
                    met = 0;
                }
                const durationRunning = pace.data.pace.value * data.data.distance.value;
                const durationWalking = pace.data.pace.value * totalDistance.data.distance.value;
                await db.collection(sessionId).updateOne(
                    { _id: data._id },
                    { $set: { "data.kcal_burned.value": durationRunning*(met*3.5*weight.data.body_weight.value)/200 } }
                );
                await db.collection(sessionId).updateOne(
                    { _id: totalDistance._id },
                    { $set: { "data.kcal_burned.value": durationWalking*(met*3.5*weight.data.body_weight.value)/200 } }
                );
            }
        }
        resolve();
    });
};

// const promiseAll = async (obj: any) => {
//     if (obj && typeof obj.then == 'function') obj = await obj;
//     if (!obj || typeof obj != 'object') return obj;
//     const forWaiting: any = [];
//     Object.keys(obj).forEach(k => {
//         if (obj[k] && typeof obj[k].then == 'function') forWaiting.push(obj[k].then((res: any) => obj[k] = res));
//         if (obj[k] && typeof obj[k] == 'object') forWaiting.push(promiseAll(obj[k]))
//     });
//     await Promise.all(forWaiting);
//     return obj;
// }