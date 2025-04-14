import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
}, { timestamps: true });

const Tag = mongoose.model('Tag', TagSchema);
export default Tag;