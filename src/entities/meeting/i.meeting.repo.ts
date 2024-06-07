import type { ID } from '@shared/core';
import type { MeetingDTO } from './meeting.dto';
import type { User } from 'grammy/types';

export type AddMeetingDTO = {
  meetingDate: string;
  meetingPoint?: string;
  participants?: User[];
  title: string;
  description?: string;
  creater: User;
}

export interface IMeetingRepo {
  get(id: MeetingDTO['id']): MeetingDTO;
  add(dto: AddMeetingDTO): MeetingDTO;
  delete(id: MeetingDTO['id']): void;
}

export const injectMeetingToken = Symbol();
