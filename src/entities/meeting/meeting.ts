import { Entity } from '@shared/entities/entity';
import type { MeetDTO } from './meeting.dto';

export class Meet extends Entity<MeetDTO>{
  get meetingDate(): Date {
    return new Date(this.dto.meetingDate);
  }
}
