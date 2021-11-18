const axios = require('axios');
const config = require('../config');
const FormData = require('form-data');
const replyWithError = require('../scripts/common/replyWithError');
const sendLog = require('../scripts/common/sendLog');

module.exports = () => async (ctx) => {
    try {
        if (ctx.updateSubTypes.includes('photo')) {
            await handlePhoto(ctx);
        } else {
            await handleDocument(ctx);
        }
    } catch (err) {
        console.error(err);
    }
}

async function handlePhoto(ctx) {
    try {
        const fileId = ctx.message.photo.reverse()[0].file_id;

        const standbyMessage = await ctx.reply(ctx.i18n.t('service.image_downloading', { type: '🖼' }), {
            parse_mode: 'HTML'
        });
        
        const originalPhoto = await getMedia({ ctx, fileId, messageId: standbyMessage.message_id, type: 'photo' }).catch(err => err);
        const processedPhoto = await processPhoto({ image: originalPhoto, filter: ctx.user.mode }).catch(err => err);

        if (originalPhoto?.code === 6) return replyWithError(ctx, 6);
        if (originalPhoto?.code === 7) return replyWithError(ctx, 7);
        if (processedPhoto?.code === 8) return replyWithError(ctx, 8);

        await ctx.replyWithChatAction('upload_photo');
        await ctx.replyWithPhoto(processedPhoto.url, { 
            reply_to_message_id: ctx.message.message_id
        });
        await ctx.telegram.deleteMessage(ctx.from.id, standbyMessage.message_id);

        if (ctx.user.agreement) {
            await ctx.telegram.sendPhoto(config.gallery, processedPhoto.url);
        }

        sendLog({
            type: 'processed',
            id: ctx.from.id,
            name: ctx.from.first_name.replace(/[<>]/g, ''),
            timestamp: new Date(),
            output: '🖼',
            fileId: fileId,
            url: processedPhoto.url
        });
    } catch (err) {
        replyWithError(ctx, 2);
        console.error(err);
    }
}

async function handleDocument(ctx) {
    try {
        const fileId = ctx.message.document.file_id;

        const mime = ctx.message.document.mime_type;
        const isAcceptable = checkMediaType(mime, ctx);

        if (isAcceptable) {
            const standbyMessage = await ctx.reply(ctx.i18n.t('service.image_downloading', { type: '📄' }), {
                parse_mode: 'HTML'
            });

            const originalPhoto = await getMedia({ ctx, fileId, messageId: standbyMessage.message_id, type: 'document' }).catch(err => err);
            const processedPhoto = await processPhoto({ image: originalPhoto, filter: ctx.user.mode }).catch(err => err);

            if (originalPhoto?.code === 6) return replyWithError(ctx, 6);
            if (originalPhoto?.code === 7) return replyWithError(ctx, 7);
            if (processedPhoto?.code === 8) return replyWithError(ctx, 8);

            await ctx.replyWithChatAction('upload_photo');
            await ctx.replyWithPhoto(processedPhoto.url, { 
                reply_to_message_id: ctx.message.message_id
            });
            await ctx.telegram.deleteMessage(ctx.from.id, standbyMessage.message_id);

            if (ctx.user.agreement) {
                await ctx.telegram.sendPhoto(config.gallery, processedPhoto.url);
            }

            sendLog({
                type: 'processed',
                id: ctx.from.id,
                name: ctx.from.first_name.replace(/[<>]/g, ''),
                timestamp: new Date(),
                output: '📄',
                fileId: fileId,
                url: processedPhoto.url
            });
        } else {
            return replyWithError(ctx, 4);
        }
    } catch (err) {
        replyWithError(ctx, 3);
        console.error(err);
    }
}

function checkMediaType(type, ctx) {
    try {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];

        if (allowedMimeTypes.includes(type)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        replyWithError(ctx, 5);
        console.error(err);
    }
}

async function getMedia(data) {
    return new Promise((resolve, reject) => {
        const downloadUrl = `https://api.telegram.org/bot${config.token}/getFile?file_id=${data.fileId}`;

        axios(downloadUrl)
            .then(async (response) => {
                const file = response.data.result;
                const url = `https://api.telegram.org/file/bot${config.token}/${file.file_path}`;

                if (file.file_size >= 20971520) {
                    reject({ code: 6, error: 'Too big file' });
                    return;
                } else {
                    const imageBuffer = await axios({
                        method: 'GET',
                        url: url,
                        responseType: 'arraybuffer',
                    }).then((response) => Buffer.from(response.data, 'binary'));

                    await data.ctx.telegram.editMessageText(
                        data.ctx.from.id, 
                        data.messageId,
                        0,
                        data.ctx.i18n.t('service.image_downloaded'), 
                        { parse_mode: 'HTML' }
                    ).catch(err => console.error(err));

                    resolve({
                        buffer: imageBuffer,
                        url: url,
                        size: file.file_size
                    });
                }
            })
            .catch((err) => {
                reject({ code: 7, error: 'Failed to download', msg: err });
            });
    });
}

function getRandomId() {
    try {
        const charset =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';

        for (var i = 0; i < 6; i++) {
            id += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return `11111-${id}`;
    } catch (err) {
        console.error(err);
    }
}

async function processPhoto(params) {
    return new Promise((resolve, reject) => {
        const data = new FormData();

        data.append('id', getRandomId());
        data.append('image', params.image.buffer, 'image.jpeg');
        data.append('wm', '0');
        data.append('type', params.filter);

        axios({
            method: 'POST',
            url: config.endpoint,
            headers: {
                ...data.getHeaders(),
            },
            data: data,
        })
            .then((response) => {
                resolve({
                    url: config.image_path + response.data,
                    initial_file_size: params.image.size,
                });
            })
            .catch(() => {
                reject({ code: 8, error: 'Failed to call API. Face was not found' });
            });
    });
}