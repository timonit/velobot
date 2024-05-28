import type { EntityDTO } from '@shared/core/entities/entity.dto';

export interface MeetingDTO extends EntityDTO {
  meetingDate: string;
  meetingPoint: string;
  participants: string[];
  title: string;
  description: string;
  creater: string;
}
