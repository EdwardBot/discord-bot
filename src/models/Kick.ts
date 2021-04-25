import { Schema, model } from "mongoose";

const data = new Schema({
    reason: {
        type: String,
        requied: false
    },
    invite: {
        type: String,
        required: true
    },
    hasRejoined: {
        type: Boolean,
        required: true
    },
    case: {
        type: Number,
        required: true
    },
    moderator: {
        type: String,
        required: true
    },
    member: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    guild: {
        type: String,
        required: true
    }
});

export default model(`Kick`, data);