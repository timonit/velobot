import { type IMeetingRepo, injectMeetingToken } from '@entities/meeting/i.meeting.repo';
import type { ID } from '@shared/core';
import { Feature } from '@shared/core/features';
import { inject } from '@shared/core/inject';

export class RejectMeetingFeature extends Feature {
  @inject(injectMeetingToken)
  meetingRepo!: IMeetingRepo;

  async execute(meetingId: ID): Promise<void> {
    await this.meetingRepo.delete(meetingId);
  }
}
