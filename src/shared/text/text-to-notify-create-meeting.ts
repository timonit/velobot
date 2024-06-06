import type { Meeting } from '@entities';
import { MSGS } from '@shared/constants';
import type { Bot } from 'grammy';

const insertParticipants = (text: string, participants: number[]): string => {
  const reg = new RegExp('---- Участники ----[\\W|\\w]*$', 'm');

  return text.replace(reg, `---- Участники ----\n${participants.join(', ')}`);
}

export async function textToNotifyCreateMeeting(bot: Bot, meeting: Meeting) {
  // const result = await bot.api.getChatMember(`@${group}`, Number(meeting.dto.creater));
  const username = meeting.dto.creater;
  const text = `${username} ${MSGS.NOTIFY_GROUP_MEETING}

<b>${meeting.dto.title}</b>

Описание:
<pre>${meeting.dto.description}</pre>

Место:
<code>${meeting.dto.meetingPoint}</code>

Дата:
<u>${new Date(meeting.dto.meetingDate).toLocaleString()}</u>

id: <i>${meeting.id}</i>

---- Участники ----`;

  return insertParticipants(text, meeting.dto.participants);
}
