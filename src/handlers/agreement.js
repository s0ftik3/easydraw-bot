'use strict';

const Markup = require('telegraf/markup');
const updateUserAgreement = require('../scripts/database/updateUserAgreement');

module.exports = () => async (ctx) => {
    try {
        const action = ctx.match;

        if (action === 'agreement') {
            await ctx.editMessageText(ctx.i18n.t('service.change_agreement'), {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(ctx.i18n.t('button.b_yes', { dot: ctx.user.agreement ? ' · ' : '' }), 'yes'),
                        Markup.callbackButton(ctx.i18n.t('button.b_no', { dot: !ctx.user.agreement ? ' · ' : '' }), 'no')
                    ],
                    [
                        Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings')
                    ]
                ])
            });

            return ctx.answerCbQuery();
        } else {
            const translation = {
                yes: true,
                no: false
            };
            const subAction = translation[ctx.match];

            if (subAction === ctx.user.agreement) return ctx.answerCbQuery(ctx.i18n.t('error.already_selected'), true);

            if (subAction) {
                await updateUserAgreement(ctx.from.id, true);
                ctx.user.agreement = true;
                await ctx.user.save();
            } else {
                await updateUserAgreement(ctx.from.id, false);
                ctx.user.agreement = false;
                await ctx.user.save();
            }

            await ctx.editMessageText(ctx.i18n.t('service.change_agreement'), {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(ctx.i18n.t('button.b_yes', { dot: ctx.user.agreement ? ' · ' : '' }), 'yes'),
                        Markup.callbackButton(ctx.i18n.t('button.b_no', { dot: !ctx.user.agreement ? ' · ' : '' }), 'no')
                    ],
                    [
                        Markup.callbackButton(ctx.i18n.t('button.back'), 'back:settings')
                    ]
                ]),
                parse_mode: 'HTML'
            });

            return ctx.answerCbQuery();
        }
    } catch (err) {
        console.error(err);
    }
};