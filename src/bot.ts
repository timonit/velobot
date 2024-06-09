import 'reflect-metadata';
import '@infra';
import { Bot, InlineKeyboard } from 'grammy';
import { CreateMeetingFeature } from '@features/meeting';
import { GroupRepo, MeetingRepo } from '@infra';
import { Meeting, type MeetingDTO } from '@entities';
import { MSGS, KEYBOARDS } from '@shared/constants';
import { textToNotifyCreateMeeting } from '@shared/text/text-to-notify-create-meeting';
import { RejectMeetingFeature } from './features/meeting/reject-meeting/reject-meeting.feature';
import { CronJob } from 'cron';
import { day, hour } from '@shared/utils';
import dayjs from 'dayjs';

const meetingRepo = new MeetingRepo();
const groupRepo = new GroupRepo();

const bot = new Bot(process.env.BOT_TOKEN);

const checkDateNotification = (currentDate: Date, meeting: Meeting, ms: number): boolean => {
  const afterDate = new Date(meeting.meetingDate.getTime() - ms);
  const result = dayjs(currentDate).isSame(afterDate, 'hour');

  return result;
}

const executeTasksByTime = () => {
  const result = meetingRepo.getAll();
  const needToDelete: {[p: number]: Meeting[]} = {};
  const currentDate = new Date();
  console.log('executeTasksByTime', currentDate)

  result.forEach((meetingDTO) => {
    const meeting = Meeting.instace(meetingDTO);

    if (meeting.meetingDate < currentDate) {
      if (meeting.dto.chatId as number in needToDelete) {
        needToDelete[meeting.dto.chatId as number].push(meeting);
      }
      else needToDelete[meeting.dto.chatId as number] = [meeting];
      return;
    }

    if (checkDateNotification(currentDate, meeting, day*3)) {
      console.log('3 day')
      bot.api.getChat(meeting.dto.chatId as number)
        .then(async (chat) => {
          try {
            await bot.api.sendMessage(
              `@${chat.username}`,
              `Напоминание!\n\n${meeting.dto.title}\nЧерез 3 дня состоиться встреча.`
            );
          }
          catch(err) {console.error(err);}
        });
    } else if (checkDateNotification(currentDate, meeting, day)) {
      console.log('1 day')
      bot.api.getChat(meeting.dto.chatId as number)
        .then(async (chat) => {
          try {
            bot.api.sendMessage(
              `@${chat.username}`,
              `Напоминание!\n\n${meeting.dto.title}\nЧерез 1 день состоиться встреча.`
            );
          } catch(err) {console.error(err)};
        });
    } else if (checkDateNotification(currentDate, meeting, hour*3)) {
      console.log('3 hour')
      bot.api.getChat(meeting.dto.chatId as number)
        .then(async (chat) => {
          try {
            bot.api.sendMessage(
              `@${chat.username}`,
              `Напоминание!\n\n${meeting.dto.title}\nЧерез 3 часа состоиться встреча.`
            );
          } catch(err){console.error(err)};
        });
    }
  });

  const entries = Object.entries(needToDelete) as unknown as [number, Meeting[]][];
  if (entries.length) {
    entries.forEach(([key, meetings]) => {
      bot.api.getChat(key)
        .then(async (chat) => {
          try {
            await bot.api.deleteMessages(
              `@${chat.username}`,
              meetings.map((item) => item.dto.messageId as number)
            );
          } catch(err) {console.error(err)};
        });
    })
  }
}

const job = new CronJob('20 * * * *', executeTasksByTime);
job.start();


const buttons = new InlineKeyboard()
  .text('Присоединится', 'join to meeting')
  .text('Отказаться', 'cancel');

const controlMeetingButtons = new InlineKeyboard()
  .text('Удалить встречу', 'reject meeting');

bot.chatType('private').command("start", async (ctx) => {
  // console.log('start', ctx.update);
  // console.log('=== === ===');

  if (ctx.chat.type === 'private') {
    ctx.reply(MSGS.GREETING+`\n\nЧто бы создавать встречи в группе, перейдите в целевую группу, добавьте меня и напишите в чат /start@${bot.botInfo.username}`, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [
          [{
            text: KEYBOARDS.CREATE_MEETING,
            web_app: {
              url: 'https://timonit.github.io/velobot/public/'
            }
          }]
        ]
      }
    });
  }
});

bot.chatType(['group', 'supergroup', 'channel']).command('start', async (ctx) => {
  // console.log('start group', ctx.update);
  const user = ctx.from;
  const chat = ctx.chat;

  groupRepo.set(user.id, chat);
  
  ctx.reply(`Теперь пользователь ${user.username ? `@${user.username}` : user.first_name } ассоциируется с этой группой(@${chat.username}) и может создавать встречи.\nОдин Пользователь может быть связан только с одной группой.`);
});

bot.on("message:web_app_data", async (ctx) => {
  const creater = ctx.from;
  const group = groupRepo.get(creater.id);
  if (!group) {
    ctx.reply(`У вас нет привязаной группы.\nЗайдите в группу и напишите /start@${bot.botInfo.username}`);
    return;
  }

  const data = JSON.parse(ctx.msg.web_app_data.data);
  const createMeeting = CreateMeetingFeature.instace();

  const meeting = createMeeting.execute({ creater, participants: [creater], ...data});
  // console.log('Created', meeting)

  ctx.reply(
    `${MSGS.MEETING_CREATE_SUCCESS}\n\n${meeting.dto.title}\n\nid: <i>${meeting.id}</i>`,
    { reply_markup: controlMeetingButtons, parse_mode: 'HTML' }
  );
  
  const text = textToNotifyCreateMeeting(meeting);
  const res = await bot.api.sendMessage(`@${group.username}`, text, { reply_markup: buttons, parse_mode: 'HTML' });

  meeting.setChatId(res.chat.id);
  meeting.setMessageId(res.message_id);

  await bot.api.pinChatMessage(res.chat.id, res.message_id);
});

bot.callbackQuery('join to meeting', async (ctx) => {
  const meetingDTO = meetingRepo.get(ctx.entities('italic')[0].text);
  const meeting = Meeting.instace(meetingDTO);
  
  if ( meeting.hasParticipant(ctx.from) ) return;

  meeting.setParticipants([ctx.from]);
  meetingRepo.patch(meeting.dto);

  const text = textToNotifyCreateMeeting(meeting);
  ctx.editMessageText(text, { reply_markup: buttons, parse_mode: 'HTML'});
});

bot.callbackQuery('cancel', async (ctx) => {
  const meetingDTO = meetingRepo.get(ctx.entities('italic')[0].text);
  const meeting = Meeting.instace(meetingDTO);

  if ( !meeting.hasParticipant(ctx.from.id) ) return;
  
  meeting.removeParticipant(ctx.from.id);
  meetingRepo.patch(meeting.dto);

  const text = textToNotifyCreateMeeting(meeting);
  ctx.editMessageText(text, { reply_markup: buttons, parse_mode: 'HTML'});
});

bot.callbackQuery('reject meeting', async (ctx) => {
  const rejectMeeting = RejectMeetingFeature.instace();
  const meetingId = ctx.entities('italic')[0].text;
  const meeting = meetingRepo.get(meetingId);

  rejectMeeting.execute(meetingId);

  if (meeting.chatId && meeting.messageId) {
    await bot.api.deleteMessage(meeting.chatId, meeting.messageId);
  }

  await ctx.editMessageText(`(Удалена)\n${ctx.msg?.text}`, { parse_mode: 'HTML'});
});

bot.on(':new_chat_members:me', (ctx) => {
  ctx.reply('hi peaple')
  console.log('ctx', ctx.update);
});

bot.catch((err) => {
  const e = err.error;
  console.error("My error handler:", e);
});




bot.start({
  async onStart(info) {
    console.log('Bot started\n==========\n\n');
    
    await bot.api.setMyCommands([
      { command: "start", description: "Start the bot" },
    ]);
  }
});
