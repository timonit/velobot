import type { ID } from '@shared/core';
import type { MeetingDTO } from './meeting.dto';
import type { User } from 'grammy/types';
import type { Filter } from 'mongodb';

export type AddMeetingDTO = {
  meetingDate: string;
  meetingPoint?: string;
  participants?: User[];
  title: string;
  description?: string;
  creater: User;
}

export interface IMeetingRepo {
  get(where: Filter<MeetingDTO>): Promise<MeetingDTO[]>;
  add(dto: AddMeetingDTO): Promise<MeetingDTO>;
  delete(id: MeetingDTO['id']): Promise<void>;
}

export const injectMeetingToken = Symbol();
