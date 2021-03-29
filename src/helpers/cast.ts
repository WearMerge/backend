export const openMHealth = (data: any, validator: { brand: string, schema: string }, uuid: string) => {
    if (validator.brand === 'xiaomi') {
        return xiaomi(data, validator.brand, validator.schema, uuid);
    } else if (validator.brand === 'fitbit') {
        return fitbit(data, validator.brand, validator.schema, uuid);
    } else if (validator.brand === 'garmin') {
        return garmin(data, validator.brand, validator.schema, uuid);
    } else if (validator.brand === 'samsung') {
        return samsung(data, validator.brand, validator.schema, uuid);
    } else if (validator.brand === 'huawei') {
        return huawei(data, validator.brand, validator.schema, uuid);
    } else if (validator.brand === 'apple') {
        return apple(data, validator.brand, validator.schema, uuid);
    } else {
        return [];
    }
};

const heartRate = (header: { uuid: string, brand: string }, value: { heartRate: number, descriptiveStatistic: string }, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'heart_rate',
            data: {
                heart_rate: {
                    value: value.heartRate,
                    unit: 'beats/min'
                },
                effective_time_frame: {
                    date_time: startDateTime
                },
                descriptive_statistic: value.descriptiveStatistic
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'heart_rate',
            data: {
                heart_rate: {
                    value: value.heartRate,
                    unit: 'beats/min'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                },
                descriptive_statistic: value.descriptiveStatistic
            }
        };
    }
};

const stepCount = (header: { uuid: string, brand: string }, value: number, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'step_count',
            data: {
                step_count: {
                    value: value,
                    unit: 'steps'
                },
                effective_time_frame: {
                    date_time: startDateTime
                }
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'step_count',
            data: {
                step_count: {
                    value: value,
                    unit: 'steps'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                }
            }
        };
    }
};

const caloriesBurned = (header: { uuid: string, brand: string }, value: number, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'calories_burned',
            data: {
                kcal_burned: {
                    value: value,
                    unit: 'kcal'
                },
                effective_time_frame: {
                    date_time: startDateTime
                }
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'calories_burned',
            data: {
                kcal_burned: {
                    value: value,
                    unit: 'kcal'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                }
            }
        };
    }
};

const physicalActivity = (header: { uuid: string, brand: string }, activityName: string, value: { distance: number, calories: number }, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'physical_activity',
            data: {
                activity_name: activityName,
                distance: {
                    value: value.distance,
                    unit: 'km'
                },
                effective_time_frame: {
                    date_time: startDateTime
                },
                kcal_burned: {
                    value: value.calories,
                    unit: 'kcal'
                }
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'physical_activity',
            data: {
                activity_name: activityName,
                distance: {
                    value: value.distance,
                    unit: 'km'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                },
                kcal_burned: {
                    value: value.calories,
                    unit: 'kcal'
                }
            }
        };
    }
};

const bodyWeight = (header: { uuid: string, brand: string }, value: number, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'body_weight',
            data: {
                body_weight: {
                    value: value,
                    unit: 'kg'
                },
                effective_time_frame: {
                    date_time: startDateTime
                }
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'body_weight',
            data: {
                body_weight: {
                    value: value,
                    unit: 'kg'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                }
            }
        };
    }
};

const bodyHeight = (header: { uuid: string, brand: string }, value: number, startDateTime: Date=null, endDateTime: Date=null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'body_height',
            data: {
                body_height: {
                    value: value,
                    unit: 'cm'
                },
                effective_time_frame: {
                    date_time: startDateTime
                }
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'body_height',
            data: {
                body_height: {
                    value: value,
                    unit: 'cm'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                }
            }
        };
    }
};

const bodyFatPercentage = (header: { uuid: string, brand: string }, value: number, startDateTime: Date=null, endDateTime: Date=null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'body_fat_percentage',
            data: {
                body_fat_percentage: {
                    value: value,
                    unit: '%'
                },
                effective_time_frame: {
                    date_time: startDateTime
                }
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'body_fat_percentage',
            data: {
                body_fat_percentage: {
                    value: value,
                    unit: '%'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                }
            }
        };
    }
};

const totalSleepTime = (header: { uuid: string, brand: string }, value: number, startDateTime: Date=null, endDateTime: Date=null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'total_sleep_time',
            data: {
                total_sleep_time: {
                    value: value,
                    unit: 'min'
                },
                effective_time_frame: {
                    date_time: startDateTime
                }
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'total_sleep_time',
            data: {
                total_sleep_time: {
                    value: value,
                    unit: 'min'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                }
            }
        };
    }
};

const pace = (header: { uuid: string, brand: string }, value: { pace: number, descriptiveStatistic: string }, startDateTime: Date=null, endDateTime: Date=null) => {
    if (!endDateTime) {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'pace',
            data: {
                pace: {
                    value: value.pace,
                    unit: 'min/km'
                },
                effective_time_frame: {
                    date_time: startDateTime
                },
                descriptive_statistic: value.descriptiveStatistic
            }
        };
    } else {
        return {
            uuid: header.uuid,
            brand: header.brand,
            type: 'pace',
            data: {
                pace: {
                    value: value.pace,
                    unit: 'min/km'
                },
                effective_time_frame: {
                    time_interval: {
                        start_date_time: startDateTime,
                        end_date_time: endDateTime
                    }
                },
                descriptive_statistic: value.descriptiveStatistic
            }
        };
    }
}

const xiaomi = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'heartrate_auto.json') {
        return heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['heartRate']), descriptiveStatistic: 'count' }, new Date(data['date'] + ' ' + data['time']));
    } else if (schema === 'heartrate.json') {
        return heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['heartRate']), descriptiveStatistic: 'count' }, new Date(Number(data['lastSyncTime']) * 1000));
    } else if (schema === 'activity.json') {
        const date = new Date(data['date']);
        return [
            stepCount({ uuid: uuid, brand: brand }, Number(data['steps']), date),
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['calories']), date),
            physicalActivity({ uuid: uuid, brand: brand }, 'running', { distance: Number(data['runDistance']) / 1000, calories: null }, date)
        ];
    } else if (schema === 'activity_minute.json') {
        return stepCount({ uuid: uuid, brand: brand }, Number(data['steps']), new Date(data['date'] + ' ' + data['time']));
    } else if (schema === 'activity_stage.json') {
        const start = new Date(data['date'] + ' ' + data['start']);
        const end = new Date(data['date'] + ' ' + data['stop']);
        return [
            stepCount({ uuid: uuid, brand: brand }, Number(data['steps']), start, end),
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['calories']), start, end)
        ];
    } else if (schema === 'body.json') {
        const date = new Date(Number(data['timestamp']) * 1000);
        return [
            bodyWeight({ uuid: uuid, brand: brand }, Number(data['weight']), date),
            bodyHeight({ uuid: uuid, brand: brand }, Number(data['height']), date),
            bodyFatPercentage({ uuid: uuid, brand: brand }, Number(data['fatRate']), date)
        ];
    } else if (schema === 'sleep.json') {
        return totalSleepTime({ uuid: uuid, brand: brand }, Number(data['deepSleepTime']) + Number(data['shallowSleepTime']), new Date(Number(data['start']) * 1000), new Date(Number(data['stop']) * 1000));
    } else if (schema === 'sport.json') {
        const date = new Date(Number(data['startTime']) * 1000);
        return [
            pace({ uuid: uuid, brand: brand }, { pace: Number(data['maxPace']), descriptiveStatistic: 'maximum' }, date),
            pace({ uuid: uuid, brand: brand }, { pace: Number(data['minPace']), descriptiveStatistic: 'minimum' }, date),
            pace({ uuid: uuid, brand: brand }, { pace: Number(data['avgPace']), descriptiveStatistic: 'average' }, date),
            physicalActivity({ uuid: uuid, brand: brand }, data['type'], { distance: Number(data['distance']), calories: Number(data['calories']) }, date),
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['calories']), date)
        ];
    } else if (schema === 'user.json') {
        return [
            bodyWeight({ uuid: uuid, brand: brand }, Number(data['weight']), null),
            bodyHeight({ uuid: uuid, brand: brand }, Number(data['height']), null)
        ];
    } else {
        return [];
    }
}

const fitbit = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'activities.json') {
        const date = new Date(data['Date']);
        return [
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['Calories_Burned']), date),
            stepCount({ uuid: uuid, brand: brand }, Number(data['Steps']), date)
        ];
    } else if (schema === 'body.json') {
        const date = new Date(data['Date']);
        const weight = Number(data['Weight']);
        return [
            bodyWeight({ uuid: uuid, brand: brand }, weight, date),
            bodyHeight({ uuid: uuid, brand: brand }, Math.sqrt(weight / Number(data['BMI'])), date),
            bodyFatPercentage({ uuid: uuid, brand: brand }, Number(data['Fat']), date)
        ];
    } else if (schema === 'sleep.json') {
        return totalSleepTime({ uuid: uuid, brand: brand }, Number(data['Minutes_Asleep']), new Date(data['Start_Time'].replace(/([\0-\377:nonascii:]*?)(AM|PM)/g, '$1 $2')), new Date(data['End_Time'].replace(/([\0-\377:nonascii:]*?)(AM|PM)/g, '$1 $2')));
    } else if (schema === 'profile.json') {
        return [
            bodyWeight({ uuid: uuid, brand: brand }, Number(data['weight']), null),
            bodyHeight({ uuid: uuid, brand: brand }, Number(data['height']), null)
        ];
    } else if (schema === 'exercise.json') {
        const date = new Date(data['startTime']);
        return [
            physicalActivity({ uuid: uuid, brand: brand }, data['activityName'], { distance: null, calories: data['calories'] }, date),
            stepCount({ uuid: uuid, brand: brand }, Number(data['steps']), date),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['averageHeartRate']), descriptiveStatistic: 'average' }, date),
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['calories']), date)
        ];
    } else if (schema === 'steps_date.json') {
        return stepCount({ uuid: uuid, brand: brand }, Number(data['value']), new Date(data['dateTime']));
    } else if (schema === 'calories.json') {
        return caloriesBurned({ uuid: uuid, brand: brand }, Number(data['value']), new Date(data['dateTime']));
    } else if (schema === 'heart_rate.json') {
        return heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['value']['bpm']), descriptiveStatistic: 'count' }, new Date(data['dateTime']));
    } else if (schema === 'sleep_date.json') {
        return totalSleepTime({ uuid: uuid, brand: brand }, Number(data['timeInBed']), new Date(data['startTime']), new Date(data['endTime']));
    } else {
        return [];
    }
}

const garmin = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'sleepData.json') {
        const start = new Date(data['sleepStartTimestampGMT']);
        const end = new Date(data['sleepEndTimestampGMT']);
        return totalSleepTime({ uuid: uuid, brand: brand }, (end.getTime() - start.getTime())/60000, start, end);
    } else if (schema === 'summarizedActivities.json') {
        const date = new Date(data['startTimeGmt']);
        const steps = Number(data['steps']);
        if (isNaN(steps)) {
            return [
                physicalActivity({ uuid: uuid, brand: brand }, data['activityType'], { distance: Number(data['distance'])/100000, calories: Number(data['calories']) }, date),
                pace({ uuid: uuid, brand: brand }, { pace: (Number(data['duration'])/60000)/(Number(data['distance'])/100000), descriptiveStatistic: 'average' }, date),
                heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['avgHr']), descriptiveStatistic: 'average' }, date),
                heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['maxHr']), descriptiveStatistic: 'maximum' }, date),
                caloriesBurned({ uuid: uuid, brand: brand }, Number(data['calories']), date)
            ];
        } else {
            return [
                physicalActivity({ uuid: uuid, brand: brand }, data['activityType'], { distance: Number(data['distance'])/100000, calories: Number(data['calories']) }, date),
                pace({ uuid: uuid, brand: brand }, { pace: (Number(data['duration'])/60000)/(Number(data['distance'])/100000), descriptiveStatistic: 'average' }, date),
                stepCount({ uuid: uuid, brand: brand }, steps, date),
                heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['avgHr']), descriptiveStatistic: 'average' }, date),
                heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['maxHr']), descriptiveStatistic: 'maximum' }, date),
                caloriesBurned({ uuid: uuid, brand: brand }, Number(data['calories']), date)
            ];
        }
    } else if (schema === 'UDSFile.json') {
        const date = new Date(data['calendarDate']['date']);
        return [
            pace({ uuid: uuid, brand: brand }, { pace: (Number(data['durationInMilliseconds'])/60000)/(Number(data['totalDistanceMeters'])/1000), descriptiveStatistic: 'average' }, date),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['minHeartRate']), descriptiveStatistic: 'minimum' }, date),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['maxHeartRate']), descriptiveStatistic: 'maximum' }, date),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['currentDayRestingHeartRate']), descriptiveStatistic: 'average' }, date),
            stepCount({ uuid: uuid, brand: brand }, Number(data['totalSteps']), date)
        ];
    } else if (schema === 'user_profile.json') {
        return [
            bodyWeight({ uuid: uuid, brand: brand }, Number(data['weight'])/1000, null),
            bodyHeight({ uuid: uuid, brand: brand }, Number(data['height']), null)
        ];
    } else {
        return [];
    }
}

const samsung = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'health_height.json') {
        return bodyHeight({ uuid: uuid, brand: brand }, Number(data['height']), new Date(data['start_time']));
    } else if (schema === 'health_sleep_stage.json') {
        const start = new Date(data['start_time']);
        const end = new Date(data['end_time']);
        return totalSleepTime({ uuid: uuid, brand: brand }, (end.getTime() - start.getTime())/60000, start, end);
    } else if (schema === 'health_weight.json') {
        const date = new Date(data['start_time']);
        return [
            bodyWeight({ uuid: uuid, brand: brand }, Number(data['weight']), date),
            bodyHeight({ uuid: uuid, brand: brand }, Number(data['height']), date)
        ];
    } else if (schema === 'shealth_activity_day_summary.json') {
        const date = new Date(data['create_time']);
        const totalDistance = Number(data['distance']) / 1000;
        const runTime = Number(data['run_time']) / 60000;
        const walkTime = Number(data['walk_time']) / 60000;
        const calculatePace = (runTime + walkTime)/totalDistance;
        return [
            stepCount({ uuid: uuid, brand: brand }, Number(data['step_count']), date),
            physicalActivity({ uuid: uuid, brand: brand }, 'running', { distance: runTime/calculatePace, calories: null }, date),
            physicalActivity({ uuid: uuid, brand: brand }, 'walking', { distance: walkTime/calculatePace, calories: null }, date),
            pace({ uuid: uuid, brand: brand }, { pace: calculatePace, descriptiveStatistic: 'count' }, date),
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['calorie']), date)
        ];
    } else if (schema === 'shealth_exercise.json') {
        const start = new Date(data['com.samsung.health.exercise.start_time']);
        const end = new Date(data['com.samsung.health.exercise.end_time']);
        return [
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['total_calorie']), start, end),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['heart_rate_sample_count']), descriptiveStatistic: 'count' }, start, end),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['com.samsung.health.exercise.max_heart_rate']), descriptiveStatistic: 'maximum' }, start, end),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['com.samsung.health.exercise.min_heart_rate']), descriptiveStatistic: 'minimum' }, start, end),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['com.samsung.health.exercise.mean_heart_rate']), descriptiveStatistic: 'median' }, start, end)
        ];
    } else if (schema === 'shealth_sleep.json') {
        const start = new Date(data['com.samsung.health.sleep.start_time']);
        const end = new Date(data['com.samsung.health.sleep.end_time']);
        return totalSleepTime({ uuid: uuid, brand: brand }, (end.getTime() - start.getTime())/60000, start, end);
    } else if (schema === 'shealth_sleep_data.json') {
        const start = new Date(data['start_time']);
        const end = new Date(data['update_time']);
        return totalSleepTime({ uuid: uuid, brand: brand }, (end.getTime() - start.getTime())/60000, start, end);
    } else if (schema === 'shealth_step_daily_trend.json') {
        const date = new Date(data['create_time']);
        return [
            stepCount({ uuid: uuid, brand: brand }, Number(data['count']), date),
            physicalActivity({ uuid: uuid, brand: brand }, 'step_daily', { distance: Number(data['distance'])/1000, calories: Number(data['calorie']) }, date),
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['calorie']), date)
        ];
    } else if (schema === 'shealth_tracker_heart_rate.json') {
        const start = new Date(data['com.samsung.health.heart_rate.start_time']);
        const end = new Date(data['com.samsung.health.heart_rate.end_time']);
        return [
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['com.samsung.health.heart_rate.max']), descriptiveStatistic: 'maximum' }, start, end),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['com.samsung.health.heart_rate.min']), descriptiveStatistic: 'minimum' }, start, end),
            heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['com.samsung.health.heart_rate.heart_rate']), descriptiveStatistic: 'count' }, start, end)
        ];
    } else if (schema === 'shealth_tracker_pedometer_step_count.json') {
        const start = new Date(data['com.samsung.health.step_count.start_time']);
        const end = new Date(data['com.samsung.health.step_count.end_time']);
        return [
            stepCount({ uuid: uuid, brand: brand }, Number(data['com.samsung.health.step_count.count']), start, end),
            physicalActivity({ uuid: uuid, brand: brand }, 'podometer', { distance: Number(data['com.samsung.health.step_count.distance'])/1000, calories: Number(data['com.samsung.health.step_count.calorie']) }, start, end),
            caloriesBurned({ uuid: uuid, brand: brand }, Number(data['com.samsung.health.step_count.calorie']), start, end)
        ];
    } else {
        return [];
    }
}

const huawei = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'health_detail_data.json') {
        const start = new Date(Number(data['startTime']));
        const end = new Date(Number(data['endTime']));
        const type = Number(data['type']);
        const key = data['samplePoints']['key'];
        if (type === 3) {
            return totalSleepTime({ uuid: uuid, brand: brand }, (end.getTime() - start.getTime())/60000, start, end);
        } else if (type === 7) {
            if (key === 'HEARTRATE_RATE') {
                return heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['samplePoints']['value']), descriptiveStatistic: 'count' }, start, end);
            } else if (key === 'DATA_POINT_DYNAMIC_HEARTRATE') {
                return heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['samplePoints']['value']), descriptiveStatistic: 'maximum' }, start, end);
            } else if (key === 'DATA_POINT_REST_HEARTRATE') {
                return heartRate({ uuid: uuid, brand: brand }, { heartRate: Number(data['samplePoints']['value']), descriptiveStatistic: 'minimum' }, start, end);
            } else {
                return [];
            }
        } else if (type === 8) {
            return bodyFatPercentage({ uuid: uuid, brand: brand }, Number(data['samplePoints']['value']), start, end);
        } else if (type === 9) {
            return totalSleepTime({ uuid: uuid, brand: brand }, (end.getTime() - start.getTime())/60000, start, end); 
        } else {
            return [];
        }
    } else if (schema === 'sport_per_minute_merged_data.json') {
        const start = new Date(Number(data['startTime']));
        const end = new Date(Number(data['endTime']));
        let results = [];
        for (const element of data['sportBasicInfos']) {
            results.push([
                stepCount({ uuid: uuid, brand: brand }, Number(element['steps']), start, end),
                physicalActivity({ uuid: uuid, brand: brand }, data['sportType'].toString(), { distance: Number(element['distance'])/1000, calories: Number(element['calorie']) }, start, end),
                caloriesBurned({ uuid: uuid, brand: brand }, Number(element['calorie']), start, end),
                pace({ uuid: uuid, brand: brand }, { pace: Number(element['duration'])/(Number(element['distance'])/1000), descriptiveStatistic: 'count'}, start, end)
            ]);
        }
        return results.flat();
    } else if (schema === 'sports_health_data.json') {
        return [
            bodyWeight({ uuid: uuid, brand: brand }, Number(data['weight']), null),
            bodyHeight({ uuid: uuid, brand: brand }, Number(data['height']), null)
        ];
    } else {
        return [];
    }
}

const apple = (data: any, brand:string, schema: string, uuid: string) => {
    
}