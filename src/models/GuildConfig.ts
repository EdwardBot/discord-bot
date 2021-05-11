import { Schema, model } from "mongoose";

const cModel = new Schema({
    guildId: {
        type: String,
        requied: true
    },
    joinedAt: {
        type: Number,
        requied: true
    },
    logChannel: {
        type: String
    },
    joinChannel: {
        type: String
    },
    leaveChannel: {
        type: String
    },
    allowLogging: {
        type: Boolean,
        requied: true
    },
    allowWelcome: {
        type: Boolean,
        requied: true
    },
    botAdmins: {
        type: Array,
        requied: true
    },
});

export default model(`guild-config`, cModel);
