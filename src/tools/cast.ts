export class Cast {
    data: any;
    brand: string;
    schema: string;
    uuid: string;

    constructor(data: any, validator: string[], uuid: string) {
        this.data = data;
        this.brand = validator[0];
        this.schema = validator[1];
        this.uuid = uuid;
    }

    insert() {
        if (this.brand === 'xiaomi') {
            return this.xiaomi();
        } else if (this.brand === 'fitbit') {
            return this.fitbit();
        } else if (this.brand === 'garmin') {
            return this.garmin();
        } else if (this.brand === 'samsung') {
            return this.samsung();
        } else if (this.brand === 'huawei') {
            return this.huawei();
        } else if (this.brand === 'apple') {
            return this.apple();
        } else {
            return [];
        }
    }

    private heartRate(value: any, startDateTime: Date =null, endDateTime: Date =null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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
    }

    private stepCount(value: number, startDateTime: Date =null, endDateTime: Date =null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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
    }

    private caloriesBurned(value: number, startDateTime: Date =null, endDateTime: Date =null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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
    }

    private physicalActivity(activityName: string, value: any, startDateTime: Date =null, endDateTime: Date =null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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
    }

    private bodyWeight(value: number, startDateTime: Date =null, endDateTime: Date =null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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
    }

    private bodyHeight(value: number, startDateTime: Date=null, endDateTime: Date=null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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
    }

    private bodyFatPercentage(value: number, startDateTime: Date=null, endDateTime: Date=null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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
    }

    private totalSleepTime(value: number, startDateTime: Date=null, endDateTime: Date=null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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
    }

    private pace(value: any, startDateTime: Date=null, endDateTime: Date=null) {
        if (!endDateTime) {
            return {
                uuid: this.uuid,
                brand: this.brand,
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
                uuid: this.uuid,
                brand: this.brand,
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

    private xiaomi() {
        if (this.schema === 'heartrate_auto.json') {
            return this.heartRate({ heartRate: Number(this.data['heartRate']), descriptiveStatistic: 'count' }, new Date(this.data['date'] + ' ' + this.data['time']));
        } else if (this.schema === 'heartrate.json') {
            return this.heartRate({ heartRate: Number(this.data['heartRate']), descriptiveStatistic: 'count' }, new Date(Number(this.data['lastSyncTime']) * 1000));
        } else if (this.schema === 'activity.json') {
            const date = new Date(this.data['date']);
            return [
                this.stepCount(Number(this.data['steps']), date),
                this.caloriesBurned(Number(this.data['calories']), date),
                this.physicalActivity('running', { distance: Number(this.data['runDistance']) / 1000, calories: null }, date)
            ];
        } else if (this.schema === 'activity_minute.json') {
            return this.stepCount(Number(this.data['steps']), new Date(this.data['date'] + ' ' + this.data['time']));
        } else if (this.schema === 'activity_stage.json') {
            const start = new Date(this.data['date'] + ' ' + this.data['start']);
            const end = new Date(this.data['date'] + ' ' + this.data['stop']);
            return [
                this.stepCount(Number(this.data['steps']), start, end),
                this.caloriesBurned(Number(this.data['calories']), start, end)
            ];
        } else if (this.schema === 'body.json') {
            const date = new Date(Number(this.data['timestamp']) * 1000);
            return [
                this.bodyWeight(Number(this.data['weight']), date),
                this.bodyHeight(Number(this.data['height']), date),
                this.bodyFatPercentage(Number(this.data['fatRate']), date)
            ];
        } else if (this.schema === 'sleep.json') {
            return this.totalSleepTime(Number(this.data['deepSleepTime']) + Number(this.data['shallowSleepTime']), new Date(Number(this.data['start']) * 1000), new Date(Number(this.data['stop']) * 1000));
        } else if (this.schema === 'sport.json') {
            const date = new Date(Number(this.data['startTime']) * 1000);
            return [
                this.pace({ pace: Number(this.data['maxPace']), descriptiveStatistic: 'maximum' }, date),
                this.pace({ pace: Number(this.data['minPace']), descriptiveStatistic: 'minimum' }, date),
                this.pace({ pace: Number(this.data['avgPace']), descriptiveStatistic: 'average' }, date),
                this.physicalActivity(this.data['type'], { distance: Number(this.data['distance']), calories: Number(this.data['calories']) }, date),
                this.caloriesBurned(Number(this.data['calories']), date)
            ];
        } else if (this.schema === 'user.json') {
            return [
                this.bodyWeight(Number(this.data['weight']), null),
                this.bodyHeight(Number(this.data['height']), null)
            ];
        } else {
            return [];
        }
    }

    private fitbit() {
        if (this.schema === 'activities.json') {
            const date = new Date(this.data['Date']);
            return [
                this.caloriesBurned(Number(this.data['Calories_Burned']), date),
                this.stepCount(Number(this.data['Steps']), date)
            ];
        } else if (this.schema === 'body.json') {
            const date = new Date(this.data['Date']);
            const weight = Number(this.data['Weight']);
            return [
                this.bodyWeight(weight, date),
                this.bodyHeight(Math.sqrt(weight / Number(this.data['BMI'])), date),
                this.bodyFatPercentage(Number(this.data['Fat']), date)
            ];
        } else if (this.schema === 'sleep.json') {
            return this.totalSleepTime(Number(this.data['Minutes_Asleep']), new Date(this.data['Start_Time'].replace(/([\0-\377:nonascii:]*?)(AM|PM)/g, '$1 $2')), new Date(this.data['End_Time'].replace(/([\0-\377:nonascii:]*?)(AM|PM)/g, '$1 $2')));
        } else if (this.schema === 'profile.json') {
            return [
                this.bodyWeight(Number(this.data['weight']), null),
                this.bodyHeight(Number(this.data['height']), null)
            ];
        } else if (this.schema === 'exercise.json') {
            const date = new Date(this.data['startTime']);
            return [
                this.physicalActivity(this.data['activityName'], { distance: null, calories: this.data['calories'] }, date),
                this.stepCount(Number(this.data['steps']), date),
                this.heartRate({ heartRate: Number(this.data['averageHeartRate']), descriptiveStatistic: 'average' }, date),
                this.caloriesBurned(Number(this.data['calories']), date)
            ];
        } else if (this.schema === 'steps_date.json') {
            return this.stepCount(Number(this.data['value']), new Date(this.data['dateTime']));
        } else if (this.schema === 'calories.json') {
            return this.caloriesBurned(Number(this.data['value']), new Date(this.data['dateTime']));
        } else if (this.schema === 'heart_rate.json') {
            return this.heartRate({ heartRate: Number(this.data['value']['bpm']), descriptiveStatistic: 'count' }, new Date(this.data['dateTime']));
        } else if (this.schema === 'sleep_date.json') {
            return this.totalSleepTime(Number(this.data['timeInBed']), new Date(this.data['startTime']), new Date(this.data['endTime']));
        } else {
            return [];
        }
    }

    private garmin() {
        if (this.schema === 'sleepData.json') {
            const start = new Date(this.data['sleepStartTimestampGMT']);
            const end = new Date(this.data['sleepEndTimestampGMT']);
            return this.totalSleepTime((end.getTime() - start.getTime())/60000, start, end);
        } else if (this.schema === 'summarizedActivities.json') {
            const date = new Date(this.data['startTimeGmt']);
            const steps = Number(this.data['steps']);
            if (isNaN(steps)) {
                return [
                    this.physicalActivity(this.data['activityType'], { distance: Number(this.data['distance'])/100000, calories: Number(this.data['calories']) }, date),
                    this.pace({ pace: (Number(this.data['duration'])/60000)/(Number(this.data['distance'])/100000), descriptiveStatistic: 'average' }, date),
                    this.heartRate({ heartRate: Number(this.data['avgHr']), descriptiveStatistic: 'average' }, date),
                    this.heartRate({ heartRate: Number(this.data['maxHr']), descriptiveStatistic: 'maximum' }, date),
                    this.caloriesBurned(Number(this.data['calories']), date)
                ];
            } else {
                return [
                    this.physicalActivity(this.data['activityType'], { distance: Number(this.data['distance'])/100000, calories: Number(this.data['calories']) }, date),
                    this.pace({ pace: (Number(this.data['duration'])/60000)/(Number(this.data['distance'])/100000), descriptiveStatistic: 'average' }, date),
                    this.stepCount(steps, date),
                    this.heartRate({ heartRate: Number(this.data['avgHr']), descriptiveStatistic: 'average' }, date),
                    this.heartRate({ heartRate: Number(this.data['maxHr']), descriptiveStatistic: 'maximum' }, date),
                    this.caloriesBurned(Number(this.data['calories']), date)
                ];
            }
        } else if (this.schema === 'UDSFile.json') {
            const date = new Date(this.data['calendarDate']['date']);
            return [
                this.pace({ pace: (Number(this.data['durationInMilliseconds'])/60000)/(Number(this.data['totalDistanceMeters'])/1000), descriptiveStatistic: 'average' }, date),
                this.heartRate({ heartRate: Number(this.data['minHeartRate']), descriptiveStatistic: 'minimum' }, date),
                this.heartRate({ heartRate: Number(this.data['maxHeartRate']), descriptiveStatistic: 'maximum' }, date),
                this.heartRate({ heartRate: Number(this.data['currentDayRestingHeartRate']), descriptiveStatistic: 'average' }, date),
                this.stepCount(Number(this.data['totalSteps']), date)
            ];
        } else if (this.schema === 'user_profile.json') {
            return [
                this.bodyWeight(Number(this.data['weight'])/1000, null),
                this.bodyHeight(Number(this.data['height']), null)
            ];
        } else {
            return [];
        }
    }

    private samsung() {
        if (this.schema === 'health_height.json') {
            return this.bodyHeight(Number(this.data['height']), new Date(this.data['start_time']));
        } else if (this.schema === 'health_sleep_stage.json') {
            const start = new Date(this.data['start_time']);
            const end = new Date(this.data['end_time']);
            return this.totalSleepTime((end.getTime() - start.getTime())/60000, start, end);
        } else if (this.schema === 'health_weight.json') {
            const date = new Date(this.data['start_time']);
            return [
                this.bodyWeight(Number(this.data['weight']), date),
                this.bodyHeight(Number(this.data['height']), date)
            ];
        } else if (this.schema === 'shealth_activity_day_summary.json') {
            const date = new Date(this.data['create_time']);
            const totalDistance = Number(this.data['distance']) / 1000;
            const runTime = Number(this.data['run_time']) / 60000;
            const walkTime = Number(this.data['walk_time']) / 60000;
            const pace = (runTime + walkTime)/totalDistance;
            return [
                this.stepCount(Number(this.data['step_count']), date),
                this.physicalActivity('running', { distance: runTime/pace, calories: null }, date),
                this.physicalActivity('walking', { distance: walkTime/pace, calories: null }, date),
                this.pace({ pace: pace, descriptiveStatistic: 'count' }, date),
                this.caloriesBurned(Number(this.data['calorie']), date)
            ];
        } else if (this.schema === 'shealth_exercise.json') {
            const start = new Date(this.data['com.samsung.health.exercise.start_time']);
            const end = new Date(this.data['com.samsung.health.exercise.end_time']);
            return [
                this.caloriesBurned(Number(this.data['total_calorie']), start, end),
                this.heartRate({ heartRate: Number(this.data['heart_rate_sample_count']), descriptiveStatistic: 'count' }, start, end),
                this.heartRate({ heartRate: Number(this.data['com.samsung.health.exercise.max_heart_rate']), descriptiveStatistic: 'maximum' }, start, end),
                this.heartRate({ heartRate: Number(this.data['com.samsung.health.exercise.min_heart_rate']), descriptiveStatistic: 'minimum' }, start, end),
                this.heartRate({ heartRate: Number(this.data['com.samsung.health.exercise.mean_heart_rate']), descriptiveStatistic: 'median' }, start, end)
            ];
        } else if (this.schema === 'shealth_sleep.json') {
            const start = new Date(this.data['com.samsung.health.sleep.start_time']);
            const end = new Date(this.data['com.samsung.health.sleep.end_time']);
            return this.totalSleepTime((end.getTime() - start.getTime())/60000, start, end);
        } else if (this.schema === 'shealth_sleep_data.json') {
            const start = new Date(this.data['start_time']);
            const end = new Date(this.data['update_time']);
            return this.totalSleepTime((end.getTime() - start.getTime())/60000, start, end);
        } else if (this.schema === 'shealth_step_daily_trend.json') {
            const date = new Date(this.data['create_time']);
            return [
                this.stepCount(Number(this.data['count']), date),
                this.physicalActivity('step_daily', { distance: Number(this.data['distance'])/1000, calories: Number(this.data['calorie']) }, date),
                this.caloriesBurned(Number(this.data['calorie']), date)
            ];
        } else if (this.schema === 'shealth_tracker_heart_rate.json') {
            const start = new Date(this.data['com.samsung.health.heart_rate.start_time']);
            const end = new Date(this.data['com.samsung.health.heart_rate.end_time']);
            return [
                this.heartRate({ heartRate: Number(this.data['com.samsung.health.heart_rate.max']), descriptiveStatistic: 'maximum' }, start, end),
                this.heartRate({ heartRate: Number(this.data['com.samsung.health.heart_rate.min']), descriptiveStatistic: 'minimum' }, start, end),
                this.heartRate({ heartRate: Number(this.data['com.samsung.health.heart_rate.heart_rate']), descriptiveStatistic: 'count' }, start, end)
            ];
        } else if (this.schema === 'shealth_tracker_pedometer_step_count.json') {
            const start = new Date(this.data['com.samsung.health.step_count.start_time']);
            const end = new Date(this.data['com.samsung.health.step_count.end_time']);
            return [
                this.stepCount(Number(this.data['com.samsung.health.step_count.count']), start, end),
                this.physicalActivity('podometer', { distance: Number(this.data['com.samsung.health.step_count.distance'])/1000, calories: Number(this.data['com.samsung.health.step_count.calorie']) }, start, end),
                this.caloriesBurned(Number(this.data['com.samsung.health.step_count.calorie']), start, end)
            ];
        } else {
            return [];
        }
    }

    private huawei() {
        if (this.schema === 'health_detail_data.json') {
            const start = new Date(Number(this.data['startTime']));
            const end = new Date(Number(this.data['endTime']));
            const type = Number(this.data['type']);
            const key = this.data['samplePoints']['key'];
            if (type === 3) {
                return this.totalSleepTime((end.getTime() - start.getTime())/60000, start, end);
            } else if (type === 7) {
                if (key === 'HEARTRATE_RATE') {
                    return this.heartRate({ heartRate: Number(this.data['samplePoints']['value']), descriptiveStatistic: 'count' }, start, end);
                } else if (key === 'DATA_POINT_DYNAMIC_HEARTRATE') {
                    return this.heartRate({ heartRate: Number(this.data['samplePoints']['value']), descriptiveStatistic: 'maximum' }, start, end);
                } else if (key === 'DATA_POINT_REST_HEARTRATE') {
                    return this.heartRate({ heartRate: Number(this.data['samplePoints']['value']), descriptiveStatistic: 'minimum' }, start, end);
                } else {
                    return [];
                }
            } else if (type === 8) {
                return this.bodyFatPercentage(Number(this.data['samplePoints']['value']), start, end);
            } else if (type === 9) {
                return this.totalSleepTime((end.getTime() - start.getTime())/60000, start, end); 
            } else {
                return [];
            }
        } else if (this.schema === 'sport_per_minute_merged_data.json') {
            const start = new Date(Number(this.data['startTime']));
            const end = new Date(Number(this.data['endTime']));
            let results = [];
            for (const element of this.data['sportBasicInfos']) {
                results.push([
                    this.stepCount(Number(element['steps']), start, end),
                    this.physicalActivity(this.data['sportType'].toString(), { distance: Number(element['distance'])/1000, calories: Number(element['calorie']) }, start, end),
                    this.caloriesBurned(Number(element['calorie']), start, end),
                    this.pace({ pace: Number(element['duration'])/(Number(element['distance'])/1000), descriptiveStatistic: 'count'}, start, end)
                ]);
            }
            return results.flat();
        } else if (this.schema === 'sports_health_data.json') {
            return [
                this.bodyWeight(Number(this.data['weight']), null),
                this.bodyHeight(Number(this.data['height']), null)
            ];
        } else {
            return [];
        }
    }

    private apple() {
        
    }
}

exports.Cast = Cast;