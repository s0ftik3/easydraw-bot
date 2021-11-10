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
    handleAgreement
} = require('./handlers');

bot.use(i18n.middleware());
bot.use(session());
bot.use(async (ctx, next) => attachUser(ctx, next));
bot.use(async (ctx, next) => ignoreOldMessages(ctx, next));
bot.use(async (ctx, next) => checkAgreement(ctx, next));
bot.use(rateLimit(require('./config').limit));

bot.command(['s', 'start', 'help'], handleStart());
bot.command('language', handleLanguage());
bot.command('agreement', handleAgreement());

bot.action(/set_lang:(.*)/, handleLanguage());
bot.action(['yes', 'no'], handleAgreement());

bot.on(['photo', 'document'], handleQuery());
bot.on('callback_query', handleCallback());

bot.launch().then(async () => {
    await connect();
    console.log(
        `[${bot.context.botInfo.first_name}] The bot has been started --> https://t.me/${bot.context.botInfo.username}`
    );
});