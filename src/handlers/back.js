'use strict';

const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        const direction = ctx.match[0].split(':')[1];

        switch (direction) {
            case 'settings':
                return ctx.editMessageText(ctx.i18n.t('service.settings'), {
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(ctx.i18n.t('button.mode'), 'mode'),
                            Markup.callbackButton(ctx.i18n.t('button.language'), 'language'),
                        ],
                        [
                            Markup.callbackButton(ctx.i18n.t('button.agreement'), 'agreement')
                        ]
                    ])
                });
                break;
            default:
                console.log('No action determined');
                break;
        }

        ctx.answerCbQuery();
    } catch (err) {
        console.error(err);
    }
};