const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// GET /api/devices  (hỗ trợ ?search=)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter = {
        $or: [
          { deviceId: regex },
          { name: regex },
          { deviceType: regex },
          { room: regex }
        ]
      };
    }
    const devices = await Device.find(filter).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// GET /api/devices/:id
router.get('/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.status(200).json(device);
  } catch (err) {
    res.status(400).json({ message: 'ID không hợp lệ', error: err.message });
  }
});

// POST /api/devices
router.post('/', async (req, res) => {
  try {
    const { deviceId, name, deviceType, room, quantity } = req.body;
    if (!deviceId || !name || !deviceType || !room || quantity === undefined) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    const existed = await Device.findOne({ deviceId });
    if (existed) return res.status(409).json({ message: 'Mã thiết bị đã tồn tại' });

    const device = new Device(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: err.message });
  }
});

// PUT /api/devices/:id
router.put('/:id', async (req, res) => {
  try {
    if (req.body.deviceId) {
      const existed = await Device.findOne({ deviceId: req.body.deviceId, _id: { $ne: req.params.id } });
      if (existed) return res.status(409).json({ message: 'Mã thiết bị đã tồn tại' });
    }
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.status(200).json(device);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: err.message });
  }
});

// DELETE /api/devices/:id
router.delete('/:id', async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.status(200).json({ message: 'Đã xóa thiết bị' });
  } catch (err) {
    res.status(400).json({ message: 'ID không hợp lệ', error: err.message });
  }
});

module.exports = router;