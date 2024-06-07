import { Entity } from '@shared/core/entities/entity';
import type { MeetingDTO } from './meeting.dto';
import type { User } from 'grammy/types';
import { uniqBy } from 'lodash';

export class Meeting extends Entity<MeetingDTO>{
  get meetingDate(): Date {
    return new Date(this.dto.meetingDate);
  }

  get participants(): User[] {
    return this.dto.participants;
  }

  setParticipants(userIDs: User[]) {
    const participants = uniqBy([...this.dto.participants, ...userIDs], 'id');
    this.dto.participants = participants;
  }

  removeParticipant(userId: User['id']) {
    this.dto.participants = this.dto.participants.filter((user) => {
      return user.id !== userId;
    })
  }

  hasParticipant(userOrId: User | User['id']): boolean {
    const id = typeof userOrId === 'number' ? userOrId : userOrId.id;

    return this.dto.participants.some((user) => user.id === id);
  }

  setMessageId(id: number) {
    this.dto.messageId = id;
  }

  setChatId(id: number) {
    this.dto.chatId = id;
  }
}
