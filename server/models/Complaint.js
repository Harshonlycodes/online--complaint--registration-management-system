import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true }, // ✅ UUID from Bolt-compatible User system
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  category: { type: String, default: 'general' },
  adminComment: { type: String, default: '' },
  handlerName: { type: String, default: '' },
  attachment: { type: String, default: null },
}, { timestamps: true }); // adds createdAt and updatedAt

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
