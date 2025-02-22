import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
     name: { type: String, required: true, trim: true },
     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
     password: { type: String, required: true },
     phone_number: { type: String, required: true, unique: true },
     address: { type: String, required: true },
     role: { type: String, enum: ['client', 'seller', 'admin'], default: 'client' }, // Ensuring role is always valid
     created_at: { type: Date, default: Date.now },
     updated_at: { type: Date, default: Date.now }
 }, { timestamps: true });
 const User = mongoose.model('User', UserSchema);
 export default User;

 