import type { ID } from '@shared/core';
import type { MeetingDTO } from './meeting.dto';

export type AddMeetingDTO = {
  meetingDate: string;
  meetingPoint?: string;
  participants?: number[];
  title: string;
  description?: string;
  creater: number;
}

export interface IMeetingRepo {
  get(id: ID): MeetingDTO;
  add(dto: AddMeetingDTO): MeetingDTO;
  delete(id: ID): void;
}

export const injectMeetingToken = Symbol();
