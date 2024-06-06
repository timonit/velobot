import { Feature } from '@shared/core/features';
import 'reflect-metadata';
import '@infra';
import { Bot, InlineKeyboard } from 'grammy';
import { CreateMeetingFeature } from '@features/meeting';
import { MSGS, KEYBOARDS } from '@constants';

const group = -1002166693511;

const bot = new Bot(process.env.BOT_TOKEN);

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

  const meeting = feature.execute({ creater: ctx.from.id, ...data});
  console.log('update', ctx.update)
  console.log('meetingRepo', feature.meetingRepo)

  ctx.reply(
    `${MSGS.MEETING_CREATE_SUCCESS}\n${meeting.dto.title}\n${meeting.dto.meetingDate}`,
    { parse_mode: 'HTML' }
  );

  // const button = new InlineKeyboard()
  //   .webApp('Присоединится', 'https://timonit.github.io/velobot/public/');

  // await bot.api.sendMessage(
  //   group,
  //   `${MSGS.NOTIFY_GROUP_MEETING}\n${meeting.dto.title}\n${meeting.dto.meetingDate}`,
  //   {
  //     reply_markup: button
  //   }
  // );
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
