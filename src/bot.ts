import 'reflect-metadata';
import { Bot } from 'grammy';
import { CreateMeetingFeature, type CreateMeetingFeatureDTO } from '@features/meeting';
import '@infra';

const unnamed = 'Без названия';

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("timon send hi!"));

// bot.command('create_meeting', async (ctx) => {
//   ctx.reply(JSON.stringify(meeting), {
//     reply_markup: {
//       keyboard: [
//         [{
//           text: 'asdad',
//           web_app: {
//             url: 'https://timonit.github.io/velobot/public/'
//           }
//         }]
//       ]
//     }
//   });
// });

bot.on("message:web_app_data", (ctx) => {
  const data = JSON.parse(ctx.msg.web_app_data.data) as CreateMeetingFeatureDTO;
  const feature = CreateMeetingFeature.instace();

  const meeting = feature.execute(data);

  console.log('\n===== create meeting data =====');
  console.log(data);
  console.log('===== end data ===== \n');
  ctx.reply(JSON.stringify(meeting));
});



bot.start({
  async onStart(info) {
    console.log('Bot started');
    
    await bot.api.setMyCommands([
      { command: "start", description: "Start the bot" },
      // { command: "create_meeting", description: "Create meeting" },
    ]);
  }
});
