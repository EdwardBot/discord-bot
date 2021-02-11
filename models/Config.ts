import { Schema, model } from "mongoose";

const cModel = new Schema({
    key: {
        type: String,
        requied: true
    },
    value: {
        type: String,
        requied: true
    }
});

export default model('config', cModel);
