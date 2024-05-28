import type { MeetingDTO } from '@entities';
import { type IMeetingRepo, injectMeetingToken } from '@entities/meeting/i.meeting.repo';
import { injectable } from '@shared/core/injectable';

@injectable(injectMeetingToken)
export class MeetingRepo implements IMeetingRepo {
  get(id: string): MeetingDTO {
    throw new Error('Method not implemented.');
  }
  add(dto: { meetingDate: string; meetingPoint?: string | undefined; participants?: string[] | undefined; title: string; description?: string | undefined; creater: string; }): MeetingDTO {
    throw new Error('Method not implemented.');
  }
  delete(id: string): void {
    throw new Error('Method not implemented.');
  }
}
