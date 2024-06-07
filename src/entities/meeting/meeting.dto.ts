import type { EntityDTO } from '@shared/core/entities/entity.dto';
import type { User, Message } from 'grammy/types';

export interface MeetingDTO extends EntityDTO {
  meetingDate: string;
  meetingPoint: string;
  participants: User[];
  title: string;
  description: string;
  creater: User;
  messageId?: number;
  chatId?: number;
}
