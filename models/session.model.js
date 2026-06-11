import mongoose from 'mongoose';

const qaSchema = new mongoose.Schema({
  question: String,
  answer: String,
  pinned: { type: Boolean, default: false },
  note: { type: String, default: '' }
});

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  topics: [String],
  experience: { type: String, default: '' },
  description: { type: String, default: '' },
  qna: [qaSchema]
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);