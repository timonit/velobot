import type { MeetingDTO } from '@entities';
import type { IMeetingRepo, AddMeetingDTO } from '@entities/meeting/i.meeting.repo';
import { injectMeetingToken } from '@entities/meeting/i.meeting.repo';
import { injectable } from '@shared/core/injectable';

const data: {[p: MeetingDTO['id']]: MeetingDTO} = {};

@injectable(injectMeetingToken)
export class MeetingRepo implements IMeetingRepo {
  data: {[p: MeetingDTO['id']]: MeetingDTO} = data;

  get(id: MeetingDTO['id']): MeetingDTO {
    const item = this.data[id];
    return item ?? undefined;
  }

  getAll(): MeetingDTO[] {
    return Object.values(this.data);
  }

  add(dto: AddMeetingDTO): MeetingDTO {
    const id = Date.now().toString();
    const meetingDTO: MeetingDTO = {
      ...dto,
      meetingPoint: dto.meetingPoint ?? '',
      participants: dto.participants ?? [],
      description: dto.description ?? '',
      id,
      createdAt: new Date().toLocaleString(),
    }

    this.data[id] = meetingDTO;

    return this.data[id];
  }
  
  delete(id: MeetingDTO['id']): void {
    delete this.data[id];
  }

  patch(dto: MeetingDTO): MeetingDTO {
    this.data[dto.id] = dto;

    return this.data[dto.id];
  }
}
