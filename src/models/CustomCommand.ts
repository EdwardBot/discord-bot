import { Schema, model } from "mongoose";

const cModel = new Schema({
    name: {
        type: String,
        requied: true
    },
    guildId: {
        type: String,
        requied: true
    },
    response: {
        type: String,
        required: true
    }
});

export default model(`custom-command`, cModel);

export type CustomCommand = {
    name: string,
    guildId: string,
    response: string
}