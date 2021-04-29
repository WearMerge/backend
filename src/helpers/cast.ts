import e from "express";

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

const heartRate = (header: { uuid: string, brand: string, schema: string }, value: { heartRate: number, descriptiveStatistic: string }, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const stepCount = (header: { uuid: string, brand: string, schema: string }, value: number, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const caloriesBurned = (header: { uuid: string, brand: string, schema: string }, value: number, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const physicalActivity = (header: { uuid: string, brand: string, schema: string }, activityName: string, value: { distance: number, calories: number }, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const bodyWeight = (header: { uuid: string, brand: string, schema: string }, value: number, startDateTime: Date =null, endDateTime: Date =null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const bodyHeight = (header: { uuid: string, brand: string, schema: string }, value: number, startDateTime: Date=null, endDateTime: Date=null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const bodyFatPercentage = (header: { uuid: string, brand: string, schema: string }, value: number, startDateTime: Date=null, endDateTime: Date=null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const totalSleepTime = (header: { uuid: string, brand: string, schema: string }, value: number, startDateTime: Date=null, endDateTime: Date=null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const pace = (header: { uuid: string, brand: string, schema: string }, value: { pace: number, descriptiveStatistic: string }, startDateTime: Date=null, endDateTime: Date=null) => {
    if (!endDateTime) {
        return {
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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
            createdAt: new Date(),
            uuid: header.uuid,
            brand: header.brand,
            schema: header.schema,
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

const unit = (header: { uuid: string, brand: string, schema: string }, data: { weight: string, height: string, distance: string }) => {
    return {
        createdAt: new Date(),
        uuid: header.uuid,
        brand: header.brand,
        schema: header.schema,
        type: 'unit',
        data: {
            weight: data.weight,
            height: data.height,
            distance: data.distance
        }
    };
};

const metricOrImperial = (value: string) => {
    if (value.match(/METRIC|meter/)) {
        return 'metric';
    }
    return 'imperial';
};

const userDemographic = (header: { uuid: string, brand: string, schema: string }, data: { gender: string, yearOfBithday: number }) => {
    return {
        createdAt: new Date(),
        uuid: header.uuid,
        brand: header.brand,
        schema: header.schema,
        type: 'demographic',
        data: {
            gender: data.gender,
            yearOfBithday: data.yearOfBithday
        }
    };
};

const xiaomi = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'heartrate_auto.json') {
        return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['heartRate']), descriptiveStatistic: 'count' }, new Date(data['date'] + ' ' + data['time']));
    } else if (schema === 'heartrate.json') {
        return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['heartRate']), descriptiveStatistic: 'count' }, new Date(Number(data['lastSyncTime']) * 1000));
    } else if (schema === 'activity.json') {
        const date = new Date(data['date']);
        return [
            stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['steps']), date),
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['calories']), date),
            physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'running', { distance: Number(data['runDistance']) / 1000, calories: null }, date),
            physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'walking', { distance: Number(data['distance']) / 1000, calories: Number(data['calories']) }, date)
        ];
    } else if (schema === 'activity_minute.json') {
        return stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['steps']), new Date(data['date'] + ' ' + data['time']));
    } else if (schema === 'activity_stage.json') {
        const start = new Date(data['date'] + ' ' + data['start']);
        const end = new Date(data['date'] + ' ' + data['stop']);
        return [
            stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['steps']), start, end),
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['calories']), start, end)
        ];
    } else if (schema === 'body.json') {
        const date = new Date(Number(data['timestamp']) * 1000);
        return [
            bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['weight']), date),
            bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['height']), date),
            bodyFatPercentage({ uuid: uuid, brand: brand, schema: schema }, Number(data['fatRate']), date)
        ];
    } else if (schema === 'sleep.json') {
        return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, Number(data['deepSleepTime']) + Number(data['shallowSleepTime']), new Date(Number(data['start']) * 1000), new Date(Number(data['stop']) * 1000));
    } else if (schema === 'sport.json') {
        const date = new Date(Number(data['startTime']) * 1000);
        return [
            pace({ uuid: uuid, brand: brand, schema: schema }, { pace: Number(data['maxPace']), descriptiveStatistic: 'maximum' }, date),
            pace({ uuid: uuid, brand: brand, schema: schema }, { pace: Number(data['minPace']), descriptiveStatistic: 'minimum' }, date),
            pace({ uuid: uuid, brand: brand, schema: schema }, { pace: Number(data['avgPace']), descriptiveStatistic: 'average' }, date),
            physicalActivity({ uuid: uuid, brand: brand, schema: schema }, data['type'], { distance: Number(data['distance']), calories: Number(data['calories']) }, date),
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['calories']), date)
        ];
    } else if (schema === 'user.json') {
        const date = new Date(data['birthday']);
        let gender: string;
        if (Number(data['gender'])) {
            gender = 'Male';
        } else {
            gender = 'Female';
        }
        return [
            bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['weight']), null),
            bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['height']), null),
            userDemographic({ uuid: uuid, brand: brand, schema: schema }, { gender: gender, yearOfBithday: date.getFullYear() })
        ];
    } else {
        return [];
    }
}

const fitbit = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'activities.json') {
        const date = new Date(data['Date']);
        return [
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['Calories_Burned']), date),
            stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['Steps']), date)
        ];
    } else if (schema === 'body.json') {
        const date = new Date(data['Date']);
        const weight = Number(data['Weight']);
        return [
            bodyWeight({ uuid: uuid, brand: brand, schema: schema }, weight, date),
            bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Math.sqrt(weight / Number(data['BMI']))*100, date),
            bodyFatPercentage({ uuid: uuid, brand: brand, schema: schema }, Number(data['Fat']), date)
        ];
    } else if (schema === 'sleep.json') {
        return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, Number(data['Minutes_Asleep']), new Date(data['Start_Time'].replace(/([\0-\377:nonascii:]*?)(AM|PM)/g, '$1 $2')), new Date(data['End_Time'].replace(/([\0-\377:nonascii:]*?)(AM|PM)/g, '$1 $2')));
    } else if (schema === 'profile.json') {
        const date = new Date(data['date_of_birth']);
        let gender: string;
        if (data['gender'] === 'MALE') {
            gender = 'Male';
        } else {
            gender = 'Female';
        }
        return [
            unit({ uuid: uuid, brand: brand, schema: schema }, { weight: metricOrImperial(data['weight_unit']), height: metricOrImperial(data['height_unit']), distance: metricOrImperial(data['distance_unit']) }),
            bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['weight']), null),
            bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['height']), null),
            userDemographic({ uuid: uuid, brand: brand, schema: schema }, { gender: gender, yearOfBithday: date.getFullYear() })
        ];
    } else if (schema === 'exercise.json') {
        const date = new Date(data['startTime']);
        return [
            pace({ uuid: uuid, brand: brand, schema: schema }, { pace: null, descriptiveStatistic: 'count' }, date),
            physicalActivity({ uuid: uuid, brand: brand, schema: schema }, data['activityName'], { distance: null, calories: data['calories'] }, date),
            stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['steps']), date),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['averageHeartRate']), descriptiveStatistic: 'average' }, date),
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['calories']), date)
        ];
    } else if (schema === 'steps_date.json') {
        return stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['dateTime']));
    } else if (schema === 'calories.json') {
        return caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['dateTime']));
    } else if (schema === 'heart_rate.json') {
        return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['value']['bpm']), descriptiveStatistic: 'count' }, new Date(data['dateTime']));
    } else if (schema === 'sleep_date.json') {
        return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, Number(data['timeInBed']), new Date(data['startTime']), new Date(data['endTime']));
    } else {
        return [];
    }
}

const garmin = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'sleepData.json') {
        const start = new Date(data['sleepStartTimestampGMT']);
        const end = new Date(data['sleepEndTimestampGMT']);
        return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, (end.getTime() - start.getTime())/60000, start, end);
    } else if (schema === 'summarizedActivities.json') {
        const date = new Date(data['startTimeGmt']);
        const steps = Number(data['steps']);
        if (isNaN(steps)) {
            return [
                physicalActivity({ uuid: uuid, brand: brand, schema: schema }, data['activityType'], { distance: Number(data['distance'])/100000, calories: Number(data['calories']) }, date),
                pace({ uuid: uuid, brand: brand, schema: schema }, { pace: (Number(data['duration'])/60000)/(Number(data['distance'])/100000), descriptiveStatistic: 'average' }, date),
                heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['avgHr']), descriptiveStatistic: 'average' }, date),
                heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['maxHr']), descriptiveStatistic: 'maximum' }, date),
                caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['calories']), date)
            ];
        } else {
            return [
                physicalActivity({ uuid: uuid, brand: brand, schema: schema }, data['activityType'], { distance: Number(data['distance'])/100000, calories: Number(data['calories']) }, date),
                pace({ uuid: uuid, brand: brand, schema: schema }, { pace: (Number(data['duration'])/60000)/(Number(data['distance'])/100000), descriptiveStatistic: 'average' }, date),
                stepCount({ uuid: uuid, brand: brand, schema: schema }, steps, date),
                heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['avgHr']), descriptiveStatistic: 'average' }, date),
                heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['maxHr']), descriptiveStatistic: 'maximum' }, date),
                caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['calories']), date)
            ];
        }
    } else if (schema === 'UDSFile.json') {
        const date = new Date(data['calendarDate']['date']);
        return [
            pace({ uuid: uuid, brand: brand, schema: schema }, { pace: (Number(data['durationInMilliseconds'])/60000)/(Number(data['totalDistanceMeters'])/1000), descriptiveStatistic: 'average' }, date),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['minHeartRate']), descriptiveStatistic: 'minimum' }, date),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['maxHeartRate']), descriptiveStatistic: 'maximum' }, date),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['currentDayRestingHeartRate']), descriptiveStatistic: 'average' }, date),
            stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['totalSteps']), date)
        ];
    } else if (schema === 'user_profile.json') {
        const date = new Date(data['birthDate']);
        let gender: string;
        if (data['gender'] === 'MALE') {
            gender = 'Male';
        } else {
            gender = 'Female';
        }
        return [
            bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['weight'])/1000, null),
            bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['height']), null),
            userDemographic({ uuid: uuid, brand: brand, schema: schema }, { gender: gender, yearOfBithday: date.getFullYear() })
        ];
    } else if (schema === 'user_settings.json') {
        return unit({ uuid: uuid, brand: brand, schema: schema }, { weight: null, height: null, distance: metricOrImperial(data['stepLengths'][0]['unitKey']) });
    } else {
        return [];
    }
}

const samsung = (data: any, brand: string, schema: string, uuid: string) => {
    if (schema === 'health_height.json') {
        return bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['height']), new Date(data['start_time'] + String(data['time_offset']).replace('UTC', 'GMT')));
    } else if (schema === 'health_sleep_stage.json') {
        const start = new Date(data['start_time']);
        const end = new Date(data['end_time']);
        return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, (end.getTime() - start.getTime())/60000, start, end);
    } else if (schema === 'health_weight.json') {
        const date = new Date(data['start_time'] +  String(data['time_offset']).replace('UTC', 'GMT'));
        return [
            bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['weight']), date),
            bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['height']), date)
        ];
    } else if (schema === 'shealth_activity_day_summary.json') {
        const date = new Date(Number(data['day_time']));
        const totalDistance = Number(data['distance']) / 1000;
        const runTime = Number(data['run_time']) / 60000;
        const walkTime = Number(data['walk_time']) / 60000;
        const calculatePace = (runTime + walkTime)/totalDistance;
        return [
            stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['step_count']), date),
            physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'running', { distance: runTime/calculatePace, calories: null }, date),
            physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'walking', { distance: walkTime/calculatePace, calories: null }, date),
            pace({ uuid: uuid, brand: brand, schema: schema }, { pace: calculatePace, descriptiveStatistic: 'count' }, date),
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['calorie']), date)
        ];
    } else if (schema === 'shealth_exercise.json') {
        const start = new Date(data['com.samsung.health.exercise.start_time'] +  String(data['com.samsung.health.exercise.time_offset']).replace('UTC', 'GMT'));
        const end = new Date(data['com.samsung.health.exercise.end_time'] +  String(data['com.samsung.health.exercise.time_offset']).replace('UTC', 'GMT'));
        return [
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['total_calorie']), start, end),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['heart_rate_sample_count']), descriptiveStatistic: 'count' }, start, end),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['com.samsung.health.exercise.max_heart_rate']), descriptiveStatistic: 'maximum' }, start, end),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['com.samsung.health.exercise.min_heart_rate']), descriptiveStatistic: 'minimum' }, start, end),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['com.samsung.health.exercise.mean_heart_rate']), descriptiveStatistic: 'median' }, start, end)
        ];
    } else if (schema === 'shealth_sleep.json') {
        const start = new Date(data['com.samsung.health.sleep.start_time'] +  String(data['com.samsung.health.sleep.time_offset']).replace('UTC', 'GMT'));
        const end = new Date(data['com.samsung.health.sleep.end_time'] +  String(data['com.samsung.health.sleep.time_offset']).replace('UTC', 'GMT'));
        return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, (end.getTime() - start.getTime())/60000, start, end);
    } else if (schema === 'shealth_sleep_data.json') {
        const start = new Date(data['start_time'] +  String(data['time_offset']).replace('UTC', 'GMT'));
        const end = new Date(data['update_time'] +  String(data['time_offset']).replace('UTC', 'GMT'));
        return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, (end.getTime() - start.getTime())/60000, start, end);
    } else if (schema === 'shealth_step_daily_trend.json') {
        const date = new Date(Number(data['day_time']));
        return [
            stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['count']), date),
            physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'step_daily', { distance: Number(data['distance'])/1000, calories: Number(data['calorie']) }, date),
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['calorie']), date)
        ];
    } else if (schema === 'shealth_tracker_heart_rate.json') {
        const start = new Date(data['com.samsung.health.heart_rate.start_time'] +  String(data['com.samsung.health.heart_rate.time_offset']).replace('UTC', 'GMT'));
        const end = new Date(data['com.samsung.health.heart_rate.end_time'] +  String(data['com.samsung.health.heart_rate.time_offset']).replace('UTC', 'GMT'));
        return [
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['com.samsung.health.heart_rate.max']), descriptiveStatistic: 'maximum' }, start, end),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['com.samsung.health.heart_rate.min']), descriptiveStatistic: 'minimum' }, start, end),
            heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['com.samsung.health.heart_rate.heart_rate']), descriptiveStatistic: 'count' }, start, end)
        ];
    } else if (schema === 'shealth_tracker_pedometer_step_count.json') {
        const start = new Date(data['com.samsung.health.step_count.start_time'] +  String(data['com.samsung.health.step_count.time_offset']).replace('UTC', 'GMT'));
        const end = new Date(data['com.samsung.health.step_count.end_time'] +  String(data['com.samsung.health.step_count.time_offset']).replace('UTC', 'GMT'));
        return [
            stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['com.samsung.health.step_count.count']), start, end),
            physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'podometer', { distance: Number(data['com.samsung.health.step_count.distance'])/1000, calories: Number(data['com.samsung.health.step_count.calorie']) }, start, end),
            caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['com.samsung.health.step_count.calorie']), start, end)
        ];
    } else if (schema === 'health_user_profile.json') {
        let gender: string;
        if (data['gender'] === 'M') {
            gender = 'Male';
        } else {
            gender = 'Female';
        }
        return [
            bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['weight']['value']), new Date(data['weight']['create_time'])),
            bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['height']['value']), new Date(data['height']['create_time'])),
            userDemographic({ uuid: uuid, brand: brand, schema: schema }, { gender: gender, yearOfBithday: Math.floor(Number(data['birth_date']) / 10000) })
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
            return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, (end.getTime() - start.getTime())/60000, start, end);
        } else if (type === 7) {
            if (key === 'HEARTRATE_RATE') {
                return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['samplePoints']['value']), descriptiveStatistic: 'count' }, start, end);
            } else if (key === 'DATA_POINT_DYNAMIC_HEARTRATE') {
                return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['samplePoints']['value']), descriptiveStatistic: 'maximum' }, start, end);
            } else if (key === 'DATA_POINT_REST_HEARTRATE') {
                return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['samplePoints']['value']), descriptiveStatistic: 'minimum' }, start, end);
            } else {
                return [];
            }
        } else if (type === 8) {
            return bodyFatPercentage({ uuid: uuid, brand: brand, schema: schema }, Number(data['samplePoints']['value']), start, end);
        } else if (type === 9) {
            return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, (end.getTime() - start.getTime())/60000, start, end); 
        } else {
            return [];
        }
    } else if (schema === 'sport_per_minute_merged_data.json') {
        const start = new Date(Number(data['startTime']));
        const end = new Date(Number(data['endTime']));
        const results = [];
        for (const element of data['sportBasicInfos']) {
            results.push([
                stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(element['steps']), start, end),
                physicalActivity({ uuid: uuid, brand: brand, schema: schema }, data['sportType'].toString(), { distance: Number(element['distance'])/1000, calories: Number(element['calorie']) }, start, end),
                caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(element['calorie']), start, end),
                pace({ uuid: uuid, brand: brand, schema: schema }, { pace: Number(element['duration'])/(Number(element['distance'])/1000), descriptiveStatistic: 'count'}, start, end)
            ]);
        }
        return results.flat();
    } else if (schema === 'sports_health_data.json') {
        return [
            bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['weight']), null),
            bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['height']), null)
        ];
    } else {
        return [];
    }
};

const apple = (data: any, brand:string, schema: string, uuid: string): any => {
    if (schema === 'activity_summary.json') {
        return caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['activeEnergyBurned']), new Date(data['dateComponents']));   
    } else if (schema === 'record.json') {
        if (data['type'] === 'HKQuantityTypeIdentifierHeartRate') {
            return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['value']), descriptiveStatistic: 'count' }, new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierRestingHeartRate') {
            return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['value']), descriptiveStatistic: 'count' }, new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierWalkingHeartRateAverage') {
            return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['value']), descriptiveStatistic: 'average' }, new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKCategoryTypeIdentifierHighHeartRateEvent') {
            return heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(data['children'][0]['value'].split(' ')[0]), descriptiveStatistic: 'maximum' }, new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN') {
            const buffer = [];
            const date = data['startDate'].split(' ');
            for (const val of data['children']) {
                buffer.push(heartRate({ uuid: uuid, brand: brand, schema: schema }, { heartRate: Number(val['bpm']), descriptiveStatistic: 'count' }, new Date(date[0] + ' ' + val['time'].replace(/,\d+/, '') + ' ' + date[2])));
            }
            return buffer;
        } else if (data['type'] === 'HKQuantityTypeIdentifierStepCount') {
            return stepCount({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKCategoryTypeIdentifierSleepAnalysis') {
            const start = new Date(data['startDate']);
            const end = new Date(data['endDate']);
            return totalSleepTime({ uuid: uuid, brand: brand, schema: schema }, (end.getTime() - start.getTime())/60000, start, end);
        } else if (data['type'] === 'HKQuantityTypeIdentifierWalkingSpeed') {
            return pace({ uuid: uuid, brand: brand, schema: schema }, { pace: 1/(Number(data['value'])*60), descriptiveStatistic: 'count' }, new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierDistanceWalkingRunning') {
            return physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'running', { distance: Number(data['value']), calories: null }, new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierDistanceCycling') {
            return physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'cycling', { distance: Number(data['value']), calories: null }, new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierDistanceSwimming') {
            return physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'swimming', { distance: Number(data['value'])/1000, calories: null }, new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierBasalEnergyBurned') {
            return caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierActiveEnergyBurned') {
            return caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierBodyMass') {
            return bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierLeanBodyMass') {
            return bodyWeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierHeight') {
            return bodyHeight({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['startDate']), new Date(data['endDate']));
        } else if (data['type'] === 'HKQuantityTypeIdentifierBodyFatPercentage') {
            return bodyFatPercentage({ uuid: uuid, brand: brand, schema: schema }, Number(data['value']), new Date(data['startDate']), new Date(data['endDate']));
        } else {
            return [];
        }
    } else if (schema === 'workout.json') {
        if (data['workoutActivityType'] === 'HKWorkoutActivityTypeCycling') {
            return [
                physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'cycling', { distance: Number(data['totalDistance']), calories: Number(data['totalEnergyBurned']) }, new Date(data['startDate']), new Date(data['endDate'])),
                pace({ uuid: uuid, brand: brand, schema: schema }, { pace: Number(data['duration'])/Number(data['totalDistance']), descriptiveStatistic: 'count' }, new Date(data['startDate']), new Date(data['endDate'])),
                caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['totalEnergyBurned']), new Date(data['startDate']), new Date(data['endDate']))
            ];
        } else if (data['workoutActivityType'] === 'HKWorkoutActivityTypeWalking') {
            let paceValue = 0;
            if (Number(data['totalDistance'])) {
                paceValue = Number(data['duration'])/Number(data['totalDistance']);
            }
            return [
                physicalActivity({ uuid: uuid, brand: brand, schema: schema }, 'walking', { distance: Number(data['totalDistance']), calories: Number(data['totalEnergyBurned']) }, new Date(data['startDate']), new Date(data['endDate'])),
                pace({ uuid: uuid, brand: brand, schema: schema }, { pace: paceValue, descriptiveStatistic: 'count' }, new Date(data['startDate']), new Date(data['endDate'])),
                caloriesBurned({ uuid: uuid, brand: brand, schema: schema }, Number(data['totalEnergyBurned']), new Date(data['startDate']), new Date(data['endDate']))
            ];
        } else {
            return [];
        }
    } else if (schema === 'me.json') {
        const date = new Date(data['HKCharacteristicTypeIdentifierDateOfBirth']);
        let gender: string;
        if (data['HKCharacteristicTypeIdentifierBiologicalSex'] === 'HKBiologicalSexMale') {
            gender = 'Male';
        } else {
            gender = 'Female';
        }
        return userDemographic({ uuid: uuid, brand: brand, schema: schema }, { gender: gender, yearOfBithday: date.getFullYear() });
    } else {
        return [];
    }
};
