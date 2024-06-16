const TelegramBot = require("node-telegram-bot-api");
const User = require("../models/User");
require("dotenv").config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/start/, function (msg) {
  const option = {
    parse_mode: "Markdown",
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: "Share my phone number",
            request_contact: true,
          },
        ],
        ["Cancel"],
      ],
    },
  };
  bot.sendMessage(
    msg.chat.id,
    "Please share your phone number to verify",
    option,
  );
});

bot.on("contact", async (msg) => {
  const phoneNumber = `+${msg.contact.phone_number}`;
  const chatId = msg.chat.id;
  try {
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      await bot.sendMessage(chatId, "No user found with this phone number.");
      return;
    }

    if (user.isPhoneVerified) {
      await bot.sendMessage(chatId, "Phone number already verified.");
      return;
    }

    await bot.sendMessage(
      chatId,
      `Here is your verification code: ||${user.verificationCode}||`,
      { parse_mode: "MarkdownV2" },
    );
  } catch (error) {
    console.error(error);
    await bot.sendMessage(
      chatId,
      "An error occurred while verifying the phone number.",
    );
  }
});

module.exports = bot;
