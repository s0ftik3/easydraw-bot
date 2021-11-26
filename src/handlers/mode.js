'use strict';

const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        const action = ctx.match;

        if (action === 'mode') {
            await ctx.editMessageText(ctx.i18n.t('service.choose_mode'), {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(ctx.user.mode === 0 ? '· 🦄 ·' : '🦄', 'mode:0'),
                        Markup.callbackButton(ctx.user.mode === 1 ? '· 🐤 ·' : '🐤', 'mode:1'),
                        Markup.callbackButton(ctx.user.mode === 5 ? '· 🐸 ·' : '🐸', 'mode:5')
                    ],
                    [
                        Markup.callbackButton(ctx.user.mode === 6 ? '· 🐼 ·' : '🐼', 'mode:6'),
                        Markup.callbackButton(ctx.user.mode === 7 ? '· 🦊 ·' : '🦊', 'mode:7'),
                        Markup.callbackButton(ctx.user.mode === 11 ? '· 🐰 ·' : '🐰', 'mode:11')
                    ],
                    [
                        Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings')
                    ]
                ])
            });

            return ctx.answerCbQuery();
        } else {
            const newMode = ctx.match[0].split(':')[1];

            if (newMode == ctx.user.mode) return ctx.answerCbQuery(ctx.i18n.t('error.already_selected'), true);

            ctx.user.mode = newMode;
            await ctx.user.save();

            await ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                [
                    Markup.callbackButton(ctx.user.mode === 0 ? '· 🦄 ·' : '🦄', 'mode:0'),
                    Markup.callbackButton(ctx.user.mode === 1 ? '· 🐤 ·' : '🐤', 'mode:1'),
                    Markup.callbackButton(ctx.user.mode === 5 ? '· 🐸 ·' : '🐸', 'mode:5')
                ],
                [
                    Markup.callbackButton(ctx.user.mode === 6 ? '· 🐼 ·' : '🐼', 'mode:6'),
                    Markup.callbackButton(ctx.user.mode === 7 ? '· 🦊 ·' : '🦊', 'mode:7'),
                    Markup.callbackButton(ctx.user.mode === 11 ? '· 🐰 ·' : '🐰', 'mode:11')
                ],
                [
                    Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings')
                ]
            ]));

            return ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};