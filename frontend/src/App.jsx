import { useState, useEffect } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const INITIAL_FORM = {
  deviceId: '',
  name: '',
  deviceType: '',
  room: '',
  brand: '',
  model: '',
  quantity: 1,
  status: 'Đang sử dụng',
  purchaseDate: new Date().toISOString().split('T')[0],
  description: ''
};

const STATUS_COLORS = {
  'Đang sử dụng': '#16a34a',
  'Hư hỏng': '#dc2626',
  'Đang sửa chữa': '#d97706',
  'Ngừng sử dụng': '#6b7280'
};

export default function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const fetchDevices = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword
        ? `${API_BASE}/api/devices?search=${encodeURIComponent(keyword)}`
        : `${API_BASE}/api/devices`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi tải dữ liệu');
      setDevices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDevices(search);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE}/api/devices/${editingId}` : `${API_BASE}/api/devices`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Thao tác thất bại');
      setMessage(editingId ? 'Cập nhật thiết bị thành công!' : 'Thêm thiết bị mới thành công!');
      setForm(INITIAL_FORM);
      setEditingId(null);
      fetchDevices(search);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (device) => {
    setEditingId(device._id);
    setForm({
      deviceId: device.deviceId,
      name: device.name,
      deviceType: device.deviceType,
      room: device.room,
      brand: device.brand,
      model: device.model,
      quantity: device.quantity,
      status: device.status,
      purchaseDate: device.purchaseDate ? device.purchaseDate.slice(0, 10) : '',
      description: device.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) return;
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/devices/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể xóa thiết bị');
      setMessage('Đã xóa thiết bị thành công!');
      if (selectedDevice && selectedDevice._id === id) setSelectedDevice(null);
      fetchDevices(search);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Quản lý Thiết bị Phòng học</h1>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', marginBottom: '12px' }}>{error}</div>}
      {message && <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', marginBottom: '12px' }}>{message}</div>}

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm theo mã, tên, loại thiết bị hoặc phòng học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Tìm kiếm</button>
        <button type="button" onClick={() => { setSearch(''); fetchDevices(''); }} style={{ padding: '8px 16px' }}>Tải lại</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px' }}>
          <h3>{editingId ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input required placeholder="Mã thiết bị (VD: TB004)" value={form.deviceId} onChange={(e) => setForm({ ...form, deviceId: e.target.value })} />
            <input required placeholder="Tên thiết bị" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required placeholder="Loại thiết bị (VD: Máy chiếu)" value={form.deviceType} onChange={(e) => setForm({ ...form, deviceType: e.target.value })} />
            <input required placeholder="Phòng học (VD: P.A101)" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
            <input required placeholder="Hãng sản xuất" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <input required placeholder="Model thiết bị" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            <input required type="number" min="0" placeholder="Số lượng" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Đang sử dụng">Đang sử dụng</option>
              <option value="Hư hỏng">Hư hỏng</option>
              <option value="Đang sửa chữa">Đang sửa chữa</option>
              <option value="Ngừng sử dụng">Ngừng sử dụng</option>
            </select>
            <input required type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} />
            <textarea placeholder="Mô tả / Ghi chú" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '8px 12px' }}>{editingId ? 'Lưu cập nhật' : 'Thêm mới'}</button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(INITIAL_FORM); }} style={{ padding: '8px 12px' }}>Hủy</button>
              )}
            </div>
          </div>
        </form>

        <div>
          {loading ? <p>Đang tải dữ liệu...</p> : (
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th>Mã TB</th>
                  <th>Tên thiết bị</th>
                  <th>Loại</th>
                  <th>Phòng</th>
                  <th>SL</th>
                  <th>Tình trạng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d) => (
                  <tr key={d._id}>
                    <td>{d.deviceId}</td>
                    <td>{d.name}</td>
                    <td>{d.deviceType}</td>
                    <td>{d.room}</td>
                    <td>{d.quantity}</td>
                    <td>
                      <span style={{ background: STATUS_COLORS[d.status] || '#333', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => setSelectedDevice(d)} style={{ marginRight: '4px' }}>Chi tiết</button>
                      <button onClick={() => handleEdit(d)} style={{ marginRight: '4px' }}>Sửa</button>
                      <button onClick={() => handleDelete(d._id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
                {devices.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không có thiết bị nào</td></tr>
                )}
              </tbody>
            </table>
          )}

          {selectedDevice && (
            <div style={{ marginTop: '16px', padding: '15px', border: '1px solid #2563eb', borderRadius: '6px', background: '#eff6ff' }}>
              <h3>Chi tiết thiết bị: {selectedDevice.name}</h3>
              <p><strong>Mã thiết bị:</strong> {selectedDevice.deviceId} | <strong>Loại:</strong> {selectedDevice.deviceType}</p>
              <p><strong>Phòng học:</strong> {selectedDevice.room} | <strong>Số lượng:</strong> {selectedDevice.quantity}</p>
              <p><strong>Hãng sản xuất:</strong> {selectedDevice.brand} | <strong>Model:</strong> {selectedDevice.model}</p>
              <p><strong>Tình trạng:</strong> {selectedDevice.status} | <strong>Ngày mua:</strong> {selectedDevice.purchaseDate}</p>
              <p><strong>Mô tả:</strong> {selectedDevice.description || 'Không có ghi chú'}</p>
              <button onClick={() => setSelectedDevice(null)}>Đóng chi tiết</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
