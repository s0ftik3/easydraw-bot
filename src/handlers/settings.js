'use strict';

const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        return ctx.replyWithHTML(ctx.i18n.t('service.settings'), {
            reply_markup: Markup.inlineKeyboard([
                [
                    Markup.callbackButton(ctx.i18n.t('button.mode'), 'mode'),
                    Markup.callbackButton(ctx.i18n.t('button.language'), 'language'),
                ],
                [
                    Markup.callbackButton(ctx.i18n.t('button.agreement'), 'agreement')
                ],
                [
                    Markup.urlButton(ctx.i18n.t('button.channel'), 'https://t.me/softik')
                ]
            ])
        });
    } catch (err) {
        console.error(err);
    }
};