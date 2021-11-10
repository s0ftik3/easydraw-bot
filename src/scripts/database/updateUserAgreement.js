'use strict';

const User = require('../../models/User');

module.exports = async (id, option) => {
    try {
        await User.updateOne(
            { id },
            {
                $set: { agreement: option }
            },
            () => {}
        );
    } catch (err) {
        console.error(err);
    }
};
