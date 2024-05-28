import "reflect-metadata";
import { CreateMeetingFeature } from '@features/create-meet/create-meeting.feature';
import './infra/repos/meeting.repo';

const feature = CreateMeetingFeature.instace();
console.log('feature', feature);
