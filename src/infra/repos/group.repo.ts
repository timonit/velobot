import { injectable } from '@shared/core/injectable';
import type { Chat, User } from 'grammy/types';

const data: {[p: Chat['id']]: Chat} = {};

@injectable('group')
export class GroupRepo {
  data: {[p: User['id']]: Chat} = data;

  get(id: User['id']): Chat {
    const item = this.data[id];
    return item || undefined;
  }

  set(userId: User['id'], chat: Chat): Chat {
    this.data[userId] = chat;

    return this.data[userId];
  }
}
