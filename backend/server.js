require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const VALID_STATUSES = ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'];

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  deviceType: { type: String, required: true, trim: true },
  room: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  status: { type: String, required: true, enum: VALID_STATUSES },
  purchaseDate: { type: String, required: true },
  description: { type: String, default: '' }
}, { timestamps: true, collection: 'devices' });

const Device = mongoose.model('Device', deviceSchema);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', dbState: mongoose.connection.readyState });
});

app.get('/api/devices', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { deviceId: regex },
          { name: regex },
          { deviceType: regex },
          { room: regex }
        ]
      };
    }
    const devices = await Device.find(query).sort({ createdAt: -1 });
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thiết bị', error: err.message });
  }
});

app.get('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const device = mongoose.Types.ObjectId.isValid(id)
      ? await Device.findById(id)
      : await Device.findOne({ deviceId: id });
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi truy vấn thiết bị', error: err.message });
  }
});

app.post('/api/devices', async (req, res) => {
  try {
    const { deviceId, name, deviceType, room, brand, model, quantity, status, purchaseDate, description } = req.body;
    if (!deviceId || !name || !deviceType || !room || !brand || !model || quantity === undefined || !status || !purchaseDate) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ các trường thông tin bắt buộc' });
    }
    const existing = await Device.findOne({ deviceId: deviceId.trim() });
    if (existing) return res.status(400).json({ message: 'Mã thiết bị deviceId đã tồn tại' });
    const newDevice = await Device.create({
      deviceId, name, deviceType, room, brand, model,
      quantity: Number(quantity), status, purchaseDate, description
    });
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: err.message });
  }
});

app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { deviceId } = req.body;
    const current = mongoose.Types.ObjectId.isValid(id)
      ? await Device.findById(id)
      : await Device.findOne({ deviceId: id });
    if (!current) return res.status(404).json({ message: 'Không tìm thấy thiết bị cần cập nhật' });
    if (deviceId && deviceId.trim() !== current.deviceId) {
      const duplicate = await Device.findOne({ deviceId: deviceId.trim() });
      if (duplicate) return res.status(400).json({ message: 'Mã thiết bị deviceId mới bị trùng' });
    }
    const updated = await Device.findByIdAndUpdate(
      current._id,
      { ...req.body, quantity: req.body.quantity !== undefined ? Number(req.body.quantity) : current.quantity },
      { new: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi cập nhật thiết bị', error: err.message });
  }
});

app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const target = mongoose.Types.ObjectId.isValid(id)
      ? await Device.findByIdAndDelete(id)
      : await Device.findOneAndDelete({ deviceId: id });
    if (!target) return res.status(404).json({ message: 'Không tìm thấy thiết bị cần xóa' });
    res.status(200).json({ message: 'Đã xóa thiết bị thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa thiết bị', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Đã kết nối MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server đang chạy tại cổng ${PORT}`));
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err.message);
  });
