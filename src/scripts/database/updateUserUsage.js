'use strict';

const User = require('../../models/User');

module.exports = async (id, fileId, processed) => {
    try {
        await User.updateOne(
            { id },
            {
                $inc: {
                    processed: 1,
                },
                $push: { files: { file_id: fileId, output: processed, timestamp: new Date() } },
            },
            () => {}
        );
    } catch (err) {
        console.error(err);
    }
};
