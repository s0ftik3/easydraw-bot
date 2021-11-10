'use strict';

const Markup = require('telegraf/markup');
const updateUserAgreement = require('../scripts/database/updateUserAgreement');

module.exports = () => async (ctx) => {
    try {
        if (ctx.updateType === 'callback_query') {
            const translation = {
                yes: true,
                no: false
            };
            const action = translation[ctx.match];

            if (action === ctx.user.agreement) return ctx.answerCbQuery(ctx.i18n.t('error.already_selected'), true);

            if (action) {
                await updateUserAgreement(ctx.from.id, true);
                ctx.user.agreement = true;
                await ctx.user.save();
            } else {
                await updateUserAgreement(ctx.from.id, false);
                ctx.user.agreement = false;
                await ctx.user.save();
            }

            ctx.editMessageText(ctx.i18n.t('service.change_agreement'), {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(ctx.i18n.t('button.b_yes', { dot: ctx.user.agreement ? ' · ' : '' }), 'yes'),
                        Markup.callbackButton(ctx.i18n.t('button.b_no', { dot: !ctx.user.agreement ? ' · ' : '' }), 'no')
                    ]
                ]),
                parse_mode: 'HTML'
            });

            await ctx.answerCbQuery();
        } else {
            return ctx.replyWithHTML(ctx.i18n.t('service.change_agreement'), {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(ctx.i18n.t('button.b_yes', { dot: ctx.user.agreement ? ' · ' : '' }), 'yes'),
                        Markup.callbackButton(ctx.i18n.t('button.b_no', { dot: !ctx.user.agreement ? ' · ' : '' }), 'no')
                    ]
                ])
            });
        }
    } catch (err) {
        console.error(err);
    }
};