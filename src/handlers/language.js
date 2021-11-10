'use strict';

const User = require('../models/User');
const Markup = require('telegraf/markup');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true,
});

module.exports = () => async (ctx) => {
    try {
        const buttons = [];
        const localesFolder = fs.readdirSync('./src/locales/');
        localesFolder.forEach((file) => {
            const localization = file.split('.')[0];
            buttons.push(Markup.callbackButton(i18n.t(localization, 'language'), `set_lang:${localization}`));
        });

        const keyboard = buttons.filter((e) => e.callback_data != `set_lang:${ctx.user.language}`);

        if (ctx.updateType === 'callback_query') {
            const language = ctx.match[0].split(':')[1];
            ctx.i18n.locale(language);

            await User.updateOne({ id: ctx.from.id }, { $set: { language: language } }, () => {});
            ctx.user.language = language;

            ctx.editMessageText(ctx.i18n.t('service.language_changed'));

            ctx.answerCbQuery();
        } else {
            ctx.replyWithHTML(ctx.i18n.t('service.change_language'), {
                reply_markup: Markup.inlineKeyboard(keyboard, { columns: 2 })
            });
        }
    } catch (err) {
        console.error(err);
    }
};