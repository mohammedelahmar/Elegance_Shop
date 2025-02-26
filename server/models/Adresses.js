import mongoose from "mongoose";
const AdressesSchema = new mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     address: { type: String, required: true },
     city: { type: String, required: true },
     country: { type: String, required: true },
     postal_code: { type: String, required: true },
     phone_number: { type: String, required: true },
     }, { timestamps: true });
     const Adresses = mongoose.model('Adresses', AdressesSchema);
     export default Adresses;