import 'reflect-metadata';
import '@infra';
import { Bot } from 'grammy';
import { CreateMeetingFeature } from '@features/meeting';
import { MSGS, KEYBOARDS } from '@constants';

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => {
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
});

bot.on("message:web_app_data", (ctx) => {
  const data = JSON.parse(ctx.msg.web_app_data.data);
  const feature = CreateMeetingFeature.instace();

  const meeting = feature.execute(data);

  ctx.reply(
    `${MSGS.MEETING_CREATE_SUCCESS}\n${meeting.dto.title}\n${meeting.dto.meetingDate}`,
    { parse_mode: 'HTML' }
  );
});




bot.start({
  async onStart(info) {
    console.log('Bot started');
    
    await bot.api.setMyCommands([
      { command: "start", description: "Start the bot" },
    ]);
  }
});
