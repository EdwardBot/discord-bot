import { Schema, model } from "mongoose";

const data = new Schema({
    question: {
        type: String,
        requied: true
    },
    messageId: {
        type: String,
        required: true
    },
    yesVotes: {
        type: Array,
        required: true
    },
    noVotes: {
        type: Array,
        required: true
    },
    hasEnded: {
        type: Boolean,
        required: true
    }
});

export default model(`Kick`, data);