const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  deviceType: { type: String, required: true, trim: true },
  room: { type: String, required: true, trim: true },
  brand: { type: String, trim: true },
  model: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 0, default: 1 },
  status: {
    type: String,
    enum: ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'],
    default: 'Đang sử dụng'
  },
  purchaseDate: { type: Date },
  description: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);