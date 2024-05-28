import type { ID } from '@shared/core';
import type { MeetingDTO } from './meeting.dto';

type AddMeetingDTO = {
  meetingDate: string;
  meetingPoint?: string;
  participants?: string[];
  title: string;
  description?: string;
  creater: string;
}

export interface IMeetingRepo {
  get(id: ID): MeetingDTO;
  add(dto: AddMeetingDTO): MeetingDTO;
  delete(id: ID): void;
}

export const injectMeetingToken = Symbol();
