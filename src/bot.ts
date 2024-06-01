import 'reflect-metadata';
import { MeetingRepo } from '@infra';
import { Bot } from 'grammy';

class App {
  repos = {
    MeetingRepo
  };
}

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("timon send hi!"));

bot.command('timon', (ctx) => {
  ctx.react('👍');
});

bot.on("message", (ctx) => {
  console.log('ctx', ctx.msg);
  ctx.reply('Автоответчик')
});

await bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show help text" },
]);


// Start the bot.
bot.start({
  onStart(info) {
    console.log('Bot started')
  }
});
