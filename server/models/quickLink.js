import mongoose from 'mongoose';

const QuickLinkSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    required: true,
  },
});
console.log(QuickLinkSchema);
export default mongoose.model('QuickLink', QuickLinkSchema);
