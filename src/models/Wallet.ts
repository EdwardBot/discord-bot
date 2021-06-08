import { Schema, model } from "mongoose";

const m = new Schema({
    guildId: {
        type: String,
        requied: true
    },
    userId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    xp: {
        type: Number,
        required: true
    },
    lvl: {
        type: Number,
        required: true
    },
    messages: {
        type: Number,
        required: true
    }
});

export default model(`wallet`, m);
