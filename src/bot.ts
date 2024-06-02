import 'reflect-metadata';
import { Bot } from 'grammy';
import { CreateMeetingFeature } from '@features/meeting';

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("timon send hi!"));

bot.command('create_meeting', (ctx) => {
  const f = CreateMeetingFeature.instace();
  const meeting = f.execute({
    meetingDate: new Date().toLocaleString(),
    title: 'aaa',
    creater: ctx.msg.chat.first_name ?? ctx.msg.chat.id.toString()
  });
  ctx.reply(JSON.stringify(meeting));
});

bot.on("message::url", (ctx) => {
  console.log('\n===== msg =====');
  console.log('ctx', ctx.msg);
  console.log('===== end msg ===== \n');
  ctx.reply('Автоответчик')
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
