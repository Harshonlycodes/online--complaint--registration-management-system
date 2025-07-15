import mongoose from 'mongoose';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Complaint from '../models/Complaint.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ▶ GET all complaints (Admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ▶ GET complaints of logged-in user
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ▶ GET single complaint
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Not found' });

    if (complaint.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ▶ POST new complaint
const uploadMiddleware = upload.single('attachment');

router.post('/', authenticateToken, (req, res, next) => {
  uploadMiddleware(req, res, function (err) {
    if (err) {
      console.error('💥 Multer error:', err);
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    console.log('USER FROM TOKEN:', req.user);

    const { title, description, category } = req.body;
    const attachment = req.file ? req.file.filename : null;

    const complaint = new Complaint({
      title,
      description,
      category,
     userId:(req.user.id),
      attachment
    });

    const saved = await complaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint: saved });
  } catch (err) {
    console.error('💥 Final Catch Error:', err);
    res.status(400).json({ message: 'Server error', error: err.message });
  }
});


// ▶ PATCH update complaint (Admin only)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminComment, handlerName } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(adminComment && { adminComment }),
        ...(handlerName && { handlerName }),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Complaint not found' });

    res.json({ message: 'Complaint updated successfully', complaint: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ▶ DELETE complaint (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Complaint not found' });

    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ▶ GET statistics
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });

    res.json({ total, pending, inProgress, resolved });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
