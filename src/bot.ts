import 'reflect-metadata';
import { Bot } from 'grammy';
import { CreateMeetingFeature } from '@features/meeting';
import '@infra';

const unnamed = 'Без названия';

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("timon send hi!"));

bot.command('create_meeting', async (ctx) => {
  const feature = CreateMeetingFeature.instace();
  const title = ctx.match || unnamed;
  const author = await ctx.getAuthor();

  const meeting = feature.execute({
    title,
    meetingDate: new Date().toLocaleString(),
    creater: author.user.id.toString()
  });

  ctx.reply(JSON.stringify(meeting));
});

bot.on("message", (ctx) => {
  console.log('\n===== msg =====');
  console.log('ctx', ctx);
  console.log('===== end msg ===== \n');
  ctx.reply('Автоответчик');
});



bot.start({
  async onStart(info) {
    console.log('Bot started');
    
    await bot.api.setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "create_meeting", description: "Create meeting" },
    ]);
  }
});
