'use strict';

const User = require('../../models/User');
const sendLog = require('../common/sendLog');

module.exports = async (data) => {
    try {
        const user = await User.findOne({ id: data.id });

        if (!user) {
            await sendLog({
                type: 'new_user',
                id: data.id,
                name: data.first_name,
                timestamp: new Date(),
            });
            return await new User({ ...data }).save();
        } else {
            return user;
        }
    } catch (err) {
        console.error(err);
    }
};
