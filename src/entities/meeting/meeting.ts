import { Entity } from '@shared/core/entities/entity';
import type { MeetingDTO } from './meeting.dto';

export class Meeting extends Entity<MeetingDTO>{
  get meetingDate(): Date {
    return new Date(this.dto.meetingDate);
  }

  setParticipants(userIDs: number[]) {
    const participants = new Set([...this.dto.participants, ...userIDs]);
    this.dto.participants = Array.from(participants);
  }

  removeParticipant(userId: number) {
    const participants = new Set(this.dto.participants);
    participants.delete(userId);
    this.dto.participants = Array.from(participants);
  }
}
