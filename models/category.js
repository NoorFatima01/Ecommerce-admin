import mongoose from "mongoose";
import { Schema } from "mongoose";
const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: [
  { type:Object}
  ],
});
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
