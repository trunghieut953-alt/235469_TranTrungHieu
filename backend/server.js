require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const deviceRoutes = require('./routes/devices');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date().toISOString() });
});

app.use('/api/devices', deviceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy endpoint' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Đã kết nối MongoDB Atlas');
    app.listen(PORT, () => console.log(`Backend đang chạy ở cổng ${PORT}`));
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });