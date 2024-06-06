import 'reflect-metadata';
import '@infra';
import { Bot, InlineKeyboard } from 'grammy';
import { CreateMeetingFeature } from '@features/meeting';
import { MeetingRepo } from '@infra';
import { Meeting } from '@entities';
import { MSGS, KEYBOARDS } from '@shared/constants';
import { textToNotifyCreateMeeting } from '@shared/text/text-to-notify-create-meeting';

const group = 'velikgroup';

const bot = new Bot(process.env.BOT_TOKEN);

const buttons = new InlineKeyboard()
    .text('Присоединится', 'join to meeting')
    .text('Отказаться', 'cancel');

bot.command("start", (ctx) => {
  console.log('start', ctx.update);
  if (ctx.chat.type === 'private') {
    ctx.reply(MSGS.GREETING, {
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

bot.on("message:web_app_data", async (ctx) => {
  const data = JSON.parse(ctx.msg.web_app_data.data);
  const feature = CreateMeetingFeature.instace();

  const meeting = feature.execute({ creater: ctx.from.id, participants: [ctx.from.id], ...data});
  console.log('meetingRepo', ctx.update)

  ctx.reply(
    `${MSGS.MEETING_CREATE_SUCCESS}\n${meeting.dto.title}`,
    { parse_mode: 'HTML' }
  );

  const text = await textToNotifyCreateMeeting(bot, meeting);

  bot.api.sendMessage(`@${group}`, text, { reply_markup: buttons, parse_mode: 'HTML' });
});

bot.callbackQuery('join to meeting', async (ctx) => {
  const repo = new MeetingRepo();
  const meetingDTO = repo.get(ctx.entities('italic')[0].text);
  const meeting = Meeting.instace(meetingDTO);
  
  if ( meeting.dto.participants.indexOf(ctx.from.id) >= 0 ) return;

  meeting.setParticipants([ctx.from.id]);
  repo.patch(meeting.dto);

  const text = await textToNotifyCreateMeeting(bot, meeting);
  ctx.editMessageText(text, { reply_markup: buttons, parse_mode: 'HTML'});
});

bot.callbackQuery('cancel', async (ctx) => {
  const repo = new MeetingRepo();
  const meetingDTO = repo.get(ctx.entities('italic')[0].text);
  const meeting = Meeting.instace(meetingDTO);

  if ( meeting.dto.participants.indexOf(ctx.from.id) < 0 ) return;
  
  meeting.removeParticipant(ctx.from.id);
  repo.patch(meeting.dto);

  const text = await textToNotifyCreateMeeting(bot, meeting);
  ctx.editMessageText(text, { reply_markup: buttons, parse_mode: 'HTML'});
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
    console.log('Bot started');
    
    await bot.api.setMyCommands([
      { command: "start", description: "Start the bot" },
    ]);
  }
});
