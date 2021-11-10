'use strict';

const config = require('../../config');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(config.token);
const moment = require('moment');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true,
});
const updateUserUsage = require('../database/updateUserUsage');

module.exports = async (data) => {
    try {
        switch (data.type) {
            case 'new_user':
                telegram.sendMessage(
                    config.chat,
                    i18n.t('en', 'admin.new_user', {
                        id: data.id,
                        name: data.name,
                        timestamp: moment(data.timestamp).format('ll s'),
                    }),
                    {
                        parse_mode: 'HTML',
                    }
                );
                break;
            case 'processed':
                await updateUserUsage(data.id, data.fileId, data.url);
                telegram.sendMessage(
                    config.chat,
                    i18n.t('en', 'admin.processed', {
                        id: data.id,
                        name: data.name,
                        timestamp: moment(data.timestamp).format('ll s'),
                        type: data.output,
                    }),
                    {
                        parse_mode: 'HTML',
                    }
                );
                break;
            default:
                break;
        }
    } catch (err) {
        console.error(err);
    }
};
