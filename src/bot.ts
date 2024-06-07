import 'reflect-metadata';
import '@infra';
import { Bot, InlineKeyboard } from 'grammy';
import { CreateMeetingFeature } from '@features/meeting';
import { GroupRepo, MeetingRepo } from '@infra';
import { Meeting } from '@entities';
import { MSGS, KEYBOARDS } from '@shared/constants';
import { textToNotifyCreateMeeting } from '@shared/text/text-to-notify-create-meeting';
import { RejectMeetingFeature } from './features/meeting/reject-meeting/reject-meeting.feature';

// const group = 'velikgroup';

const bot = new Bot(process.env.BOT_TOKEN);

const buttons = new InlineKeyboard()
  .text('Присоединится', 'join to meeting')
  .text('Отказаться', 'cancel');


const controlMeetingButtons = new InlineKeyboard()
  .text('Удалить встречу', 'reject meeting');

bot.chatType('private').command("start", async (ctx) => {
  console.log('start', ctx.update);
  console.log('=== === ===');

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
  console.log('start group', ctx.update);
  const user = ctx.from;
  const chat = ctx.chat;

  const groupRepo = new GroupRepo();
  groupRepo.set(user.id, chat);
  
  ctx.reply(`Теперь пользователь ${user.username ? `@${user.username}` : user.first_name } ассоциируется с этой группой(@${chat.username}) и может создавать встречи.\nОдин Пользователь может быть связан только с одной группой.`);
});

bot.on("message:web_app_data", async (ctx) => {
  const groupRepo = new GroupRepo();
  const creater = ctx.from;
  const group = groupRepo.get(creater.id);
  if (!group) {
    ctx.reply(`У вас нет привязаной группы.\nЗайдите в группу и напишите /start@${bot.botInfo.username}`);
    return;
  }

  const data = JSON.parse(ctx.msg.web_app_data.data);
  const createMeeting = CreateMeetingFeature.instace();

  const meeting = createMeeting.execute({ creater, participants: [creater], ...data});
  console.log('Created', meeting)

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
  const repo = new MeetingRepo();
  const meetingDTO = repo.get(ctx.entities('italic')[0].text);
  const meeting = Meeting.instace(meetingDTO);
  
  if ( meeting.hasParticipant(ctx.from) ) return;

  meeting.setParticipants([ctx.from]);
  repo.patch(meeting.dto);

  const text = textToNotifyCreateMeeting(meeting);
  ctx.editMessageText(text, { reply_markup: buttons, parse_mode: 'HTML'});
});

bot.callbackQuery('cancel', async (ctx) => {
  const repo = new MeetingRepo();
  const meetingDTO = repo.get(ctx.entities('italic')[0].text);
  const meeting = Meeting.instace(meetingDTO);

  if ( !meeting.hasParticipant(ctx.from.id) ) return;
  
  meeting.removeParticipant(ctx.from.id);
  repo.patch(meeting.dto);

  const text = textToNotifyCreateMeeting(meeting);
  ctx.editMessageText(text, { reply_markup: buttons, parse_mode: 'HTML'});
});

bot.callbackQuery('reject meeting', async (ctx) => {
  const rejectMeeting = RejectMeetingFeature.instace();
  const meetingId = ctx.entities('italic')[0].text;
  const meetingRepo = new MeetingRepo();
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
