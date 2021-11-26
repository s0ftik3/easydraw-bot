const Telegraf = require('telegraf');
const config = require('./config');
const bot = new Telegraf(config.token, { handlerTimeout: config.handler_timeout });

const rateLimit = require('telegraf-ratelimit');
const session = require('telegraf/session');

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, './locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true,
});

const connect = require('./scripts/database/connect');
const attachUser = require('./middlewares/attachUser');
const ignoreOldMessages = require('./middlewares/ignoreOldMessages');
const checkAgreement = require('./middlewares/checkAgreement');
const {
    handleStart,
    handleCallback,
    handleLanguage,
    handleQuery,
    handleAgreement,
    handleMode,
    handleSettings,
    handleBack
} = require('./handlers');

bot.use(i18n.middleware());
bot.use(session());
bot.use(attachUser());
bot.use(ignoreOldMessages());
bot.use(checkAgreement());
bot.use(rateLimit(config.limit));

bot.command(['s', 'start', 'help'], handleStart());

bot.hears(config.button.settings, handleSettings());

bot.action('mode', handleMode());
bot.action('language', handleLanguage());
bot.action('agreement', handleAgreement());
bot.action(/language:(.*)/, handleLanguage());
bot.action(['yes', 'no'], handleAgreement());
bot.action(/mode:(.*)/, handleMode());
bot.action(/back:(.*)/, handleBack());

bot.on(['photo', 'document'], handleQuery());
bot.on('callback_query', handleCallback());

bot.launch().then(async () => {
    await connect();
    console.log(
        `[${bot.context.botInfo.first_name}] The bot has been started --> https://t.me/${bot.context.botInfo.username}`
    );
});