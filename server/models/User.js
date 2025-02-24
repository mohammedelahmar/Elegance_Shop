import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    Firstname: { type: String, required: true, trim: true },
    Lastname: { type: String, required: true, trim: true },
    sexe: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
}, { timestamps: true }); // Removed manual timestamp fields

const User = mongoose.model('User', UserSchema);
export default User;