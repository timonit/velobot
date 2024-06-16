import type { EntityDTO } from '@shared/core/entities/entity.dto';
import type { User, Message } from 'grammy/types';

export interface MeetingDTO extends EntityDTO {
  meetingDate: Date;
  meetingPoint: string;
  participants: User[];
  title: string;
  description: string;
  creater: User;
  messageId?: number | null;
  chatId?: number | null;
}
