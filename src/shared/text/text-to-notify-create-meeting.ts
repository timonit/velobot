import type { Meeting } from '@entities';
import { MSGS } from '@shared/constants';
import type { User } from 'grammy/types';

const insertParticipants = (text: string, participants: User[]): string => {
  const reg = new RegExp('---- Участники ----[\\W|\\w]*$', 'm');

  return text.replace(reg, `---- Участники ----\n${participants.map((user) => user.username ? `@${user.username}` : user.first_name).join(', ')}`);
}

const description = (meeting: Meeting) => {
  if (!meeting.dto.description) return '';

  return `

Описание:
<pre>${meeting.dto.description}</pre>`;
}

const meetingPoint = (meeting: Meeting) => {
  if (!meeting.dto.meetingPoint) return '';

  return `

Место:
<code>${meeting.dto.meetingPoint}</code>`;
}

export function textToNotifyCreateMeeting(meeting: Meeting) {
  const username = meeting.dto.creater.username || meeting.dto.creater.first_name;
  
  const text = `${username} ${MSGS.NOTIFY_GROUP_MEETING}

<b>${meeting.dto.title}</b>${description(meeting)}${meetingPoint(meeting)}

Дата:
<u>${new Date(meeting.dto.meetingDate).toLocaleString('RU')}</u>

id: <i>${meeting.id}</i>

---- Участники ----`;

  return insertParticipants(text, meeting.dto.participants);
}
