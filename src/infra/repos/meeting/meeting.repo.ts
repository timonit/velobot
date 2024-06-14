import type { MeetingDTO } from '@entities';
import type { IMeetingRepo, AddMeetingDTO } from '@entities/meeting/i.meeting.repo';
import { injectMeetingToken } from '@entities/meeting/i.meeting.repo';
import { injectable } from '@shared/core/injectable';
import { Repo } from '@shared/infra';
import type { Filter } from 'mongodb';

@injectable(injectMeetingToken)
export class MeetingRepo extends Repo<MeetingDTO> implements IMeetingRepo {
  collectionName = 'Meeting';

  async get(where: Filter<MeetingDTO>): Promise<MeetingDTO[]> {
    try {
      await this.client.connect();
      const cursor = this.collection.find(where)
      const result = await cursor.toArray();
      return result;
    }
    finally {
      await this.client.close();
    }
  }

  async add(dto: AddMeetingDTO): Promise<MeetingDTO> {
    try {
      await this.client.connect();
      const createdAt = new Date();
      const id = createdAt.getTime().toString();
      const meetingDate = new Date(dto.meetingDate);

      const res = await this.collection.insertOne({
        ...dto,
        id,
        createdAt,
        meetingDate,
        meetingPoint: dto.meetingPoint || '',
        participants: dto.participants || [],
        description: dto.description || ''
      });

      const result = await this.collection.findOne({id});
      return result as MeetingDTO;
    }
    finally {
      await this.client.close();
    }
  }
  
  async delete(id: any): Promise<void> {
    try {
      await this.client.connect();
      await this.collection.deleteOne({id});
    }
    finally {
      await this.client.close();
    }
  }

  async patch(dto: MeetingDTO): Promise<void> {
    try {
      await this.client.connect();
      await this.collection.replaceOne({id: dto.id}, dto);
    }
    finally {
      await this.client.close();
    }
  }
}
