import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const imageSchema = new mongoose.Schema({
  images: {type: [String],required: true}
});

const Image = mongoose.models.Image || mongoose.model('image', imageSchema);
export default Image;