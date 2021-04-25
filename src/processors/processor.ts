import { Job } from 'bull';
import { integration } from '../scripts/integration';

export default async function(job: Job) {
    console.log('starting')
    return integration(job.data.id);
}
