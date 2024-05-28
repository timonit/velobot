import { Entity } from '@shared/core/entities/entity';
import type { MeetingDTO } from './meeting.dto';

export class Meeting extends Entity<MeetingDTO>{
  get meetingDate(): Date {
    return new Date(this.dto.meetingDate);
  }
}
