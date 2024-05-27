import type { EntityDTO } from '@shared/entities/entity.dto';

export interface MeetDTO extends EntityDTO {
  meetingDate: string;
  meetingPoint: string;
  participants: string[];
  title: string;
  description: string;
  creater: string;
}
