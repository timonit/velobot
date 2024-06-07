import { Meeting } from '@entities';
import { type IMeetingRepo, injectMeetingToken } from '@entities/meeting/i.meeting.repo';
import { Feature } from '@shared/core/features';
import { inject } from '@shared/core/inject';
import type { User } from 'grammy/types';

export type CreateMeetingFeatureDTO = {
  meetingDate: string;
  meetingPoint?: string;
  participants?: User[];
  title: string;
  description?: string;
  creater: User;
}

export class CreateMeetingFeature extends Feature {
  @inject(injectMeetingToken)
  meetingRepo!: IMeetingRepo;

  execute(dto: CreateMeetingFeatureDTO): Meeting {
    const meetingDTO = this.meetingRepo.add(dto);
    return new Meeting(meetingDTO);
  }
}
