import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user:
    {
        type: Number,
        default: 0
    },
    subscription:
    {
        type: Number,
        default: 0
    },

    views:
    {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
});

export const Stats = mongoose.model("Stats", schema);
