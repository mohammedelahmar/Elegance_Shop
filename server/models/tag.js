const TagSchema = new mongoose.Schema({
     name: { type: String, required: true, unique: true, trim: true },
     description: String,
 }, { timestamps: true }); // Removed manual timestamps