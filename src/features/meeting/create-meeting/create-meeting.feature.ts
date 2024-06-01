import { Meeting } from '@entities';
import { type IMeetingRepo, injectMeetingToken } from '@entities/meeting/i.meeting.repo';
import { Feature } from '@shared/core/features';
import { inject } from '@shared/core/inject';

type CreateMeetingFeatureDTO = {
  meetingDate: string;
  meetingPoint?: string;
  participants?: string[];
  title: string;
  description?: string;
  creater: string;
}

export class CreateMeetingFeature extends Feature {
  @inject(injectMeetingToken)
  meetingRepo!: IMeetingRepo;

  execute(dto: CreateMeetingFeatureDTO): void {
    const meetingDTO = this.meetingRepo.add(dto);
  }
}