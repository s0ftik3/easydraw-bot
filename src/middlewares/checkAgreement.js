'use strict';

const Markup = require('telegraf/markup');
const updateUserAgreement = require('../scripts/database/updateUserAgreement');

module.exports = () => {
    return async (ctx, next) => {
        try {
            if (ctx.user.processed >= 1) {
                if (ctx.user.agreement === null) {
                    if (ctx.updateType === 'callback_query') {
                        if (ctx.update.callback_query.data === 'accept') {
                            await updateUserAgreement(ctx.from.id, true);
                            
                            await ctx.editMessageText(ctx.i18n.t('service.agreement_answered'), {
                                parse_mode: 'HTML'
                            });
    
                            await ctx.answerCbQuery();
                        } else {
                            await updateUserAgreement(ctx.from.id, false);
    
                            await ctx.editMessageText(ctx.i18n.t('service.agreement_answered'), {
                                parse_mode: 'HTML'
                            });
    
                            await ctx.answerCbQuery();
                        }
            
                        return next();
                    } else {
                        return ctx.replyWithHTML(ctx.i18n.t('service.agreement'), {
                            reply_markup: Markup.inlineKeyboard([
                                [
                                    Markup.callbackButton(ctx.i18n.t('button.accept'), 'accept'),
                                    Markup.callbackButton(ctx.i18n.t('button.deny'), 'deny')
                                ]
                            ])
                        });
                    }
                } else {
                    return next();
                }
            } else {
                return next();
            }
        } catch (err) {
            console.error(err)
        }
    }
}