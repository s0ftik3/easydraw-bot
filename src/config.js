module.exports = {
    token: process.env.TOKEN,
    database: process.env.DATABASE,
    channel: process.env.CHANNEL,
    chat: process.env.CHAT,
    endpoint: process.env.ENDPOINT,
    image_path: process.env.IMAGE_PATH,
    gallery: process.env.GALLERY,
    limit: {
        window: 1500,
        limit: 1,
        onLimitExceeded: (ctx) => require('./scripts/common/replyWithError')(ctx, 1),
    },
    handler_timeout: 100,
    button: {
        settings: [
            'Settings', 
            'Настройки'
        ]
    }
};