'use strict';

const Markup = require('telegraf/markup');

module.exports = () => (ctx) => {
    try {
        return ctx.replyWithHTML(
            ctx.i18n.t('service.greeting', { name: ctx.from.first_name.replace(/[<>]/g, '') }),
            Markup.keyboard([ctx.i18n.t('button.settings')])
            .resize()
            .extra()
        );
    } catch (err) {
        console.error(err);
    }
};