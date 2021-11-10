'use strict';

module.exports = (ctx, code) => {
    try {
        switch (code) {
            case 0:
                ctx.replyWithHTML(ctx.i18n.t('error.default'));
                break;
            case 1:
                const a = () =>
                    ctx.answerCbQuery(ctx.i18n.t('error.limit_exceeded'), true);
                const b = () =>
                    ctx.replyWithHTML(ctx.i18n.t('error.limit_exceeded'));
                ctx.updateType === 'callback_query' ? a() : b();
                break;
            case 2:
                ctx.replyWithHTML(ctx.i18n.t('error.failed_handle_image'));
                break;
            case 3:
                ctx.replyWithHTML(ctx.i18n.t('error.failed_handle_file'));
                break;
            case 4:
                ctx.replyWithHTML(
                    ctx.i18n.t('error.unsupported_file_extension')
                );
                break;
            case 5:
                ctx.replyWithHTML(
                    ctx.i18n.t('error.failed_check_media_extension')
                );
                break;
            case 6:
                ctx.replyWithHTML(ctx.i18n.t('error.media_too_big'));
                break;
            case 7:
                ctx.replyWithHTML(ctx.i18n.t('error.failed_download_tg_media'));
                break;
            case 8:
                ctx.replyWithHTML(ctx.i18n.t('error.face_not_found'));
                break;
            default:
                ctx.replyWithHTML(ctx.i18n.t('error.default'));
                break;
        }
    } catch (err) {
        console.error(err);
    }
};
