import { injectable } from '@shared/core/injectable';
import type { Chat } from 'grammy/types';
import { Repo } from '@shared/infra';

@injectable('group')
export class GroupRepo extends Repo {
  collectionName = 'Group';

  async get(id: any): Promise<Chat | null> {
    try {
      await this.client.connect();
      // return this.client.findFirst({where: {userId: id}}) as Promise<Chat | null>;
      const result = await this.collection.findOne({ userId: id }) as Chat | null;
      return result;
    } finally {
      await this.client.close();
    }
  }

  async set(userId: any, chat: Chat): Promise<void> {
    try {
      await this.client.connect();
      await this.collection.insertOne({
        userId,
        ...chat,
      });
    }
    finally {
      await this.client.close();
    }
  }
}
