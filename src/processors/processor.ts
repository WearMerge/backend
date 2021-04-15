import { Job } from 'bull';
import { insertToDB } from '../tools/insert-to-db';

export default function(job: Job) {
    console.log('starting')
    return insertToDB(job.data.id);
}