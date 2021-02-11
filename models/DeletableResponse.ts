import { Schema, model } from "mongoose";

const cModel = new Schema({
    messageId: {
        type: String,
        requied: true
    },
    canClose: {
        type: Array,
        requied: true
    },
    createdAt: {
        type: Number,
        required: true
    }
});

export default model('DeletableMsg', cModel);
