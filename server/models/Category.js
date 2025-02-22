     import mongoose from "mongoose";

     const CategorySchema = new mongoose.Schema({
          name: { type: String, required: true, unique: true, trim: true },
          description: String,
          created_at: { type: Date, default: Date.now },
          updated_at: { type: Date, default: Date.now }
      }, { timestamps: true });

     const Category = mongoose.model('Category', CategorySchema);
     export default Category;
      