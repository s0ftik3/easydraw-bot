'use strict';

module.exports = (ctx, next) => {
    try {
        if (new Date().getTime() / 1000 - (ctx?.message?.date || ctx?.update?.callback_query?.message?.date) < (5 * 60)) {
            return next();
        } else {
            console.info(
                `[${ctx.chat.id}] Ignoring update (${ctx.updateType})`
            );
        }
    } catch (err) {
        console.error(err);
    }
}