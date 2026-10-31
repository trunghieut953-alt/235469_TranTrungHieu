import { useEffect, useState } from 'react';
import api from './api';
import DeviceList from './components/DeviceList';
import DeviceForm from './components/DeviceForm';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchDevices = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/devices', { params: keyword ? { search: keyword } : {} });
      setDevices(res.data);
    } catch (err) {
      setError('Không tải được danh sách thiết bị. Vui lòng kiểm tra lại kết nối Backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  // Tự động ẩn thông báo thành công sau 3 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDevices(search);
  };

  const handleAdd = () => { 
    setEditing(null); 
    setViewing(null); // Đóng form xem chi tiết nếu đang mở
    setShowForm(true); 
  };
  
  const handleEdit = (d) => { 
    setEditing(d); 
    setViewing(null);
    setShowForm(true); 
  };

  const handleView = (d) => {
    setViewing(d);
    setShowForm(false); // Đóng form sửa/thêm nếu đang mở
  };

  const handleSubmit = async (form) => {
    setError('');
    try {
      if (editing) {
        await api.put(`/api/devices/${editing._id}`, form);
        setMessage('Cập nhật thông tin thiết bị thành công!');
      } else {
        await api.post('/api/devices', form);
        setMessage('Thêm thiết bị mới thành công!');
      }
      setShowForm(false);
      fetchDevices(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thiết bị này không? Hành động này không thể hoàn tác.')) return;
    try {
      await api.delete(`/api/devices/${id}`);
      setMessage('Đã xóa thiết bị thành công!');
      fetchDevices(search);
    } catch (err) {
      setError('Xóa thiết bị thất bại.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
        Hệ Thống Quản Lý Thiết Bị Phòng Học
      </h1>

      {/* Thanh công cụ tìm kiếm và thêm mới */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <input 
            placeholder="Tìm kiếm theo mã, tên, loại, phòng..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ padding: '8px 12px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#6c757d', color: 'white' }}>
            Tìm kiếm
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); fetchDevices(''); }} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
              Xóa bộ lọc
            </button>
          )}
        </form>
        <button type="button" onClick={handleAdd} style={{ padding: '10px 16px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: 'white', fontWeight: 'bold' }}>
          + Thêm thiết bị
        </button>
      </div>

      {/* Vùng hiển thị thông báo */}
      {loading && <p style={{ color: '#6c757d', fontStyle: 'italic' }}>Đang tải dữ liệu...</p>}
      {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
      {message && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}

      {/* Form Thêm/Sửa */}
      {showForm && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fcfcfc', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#34495e' }}>{editing ? 'Cập nhật thông tin thiết bị' : 'Thêm thiết bị mới'}</h3>
          <DeviceForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Form Xem chi tiết */}
      {viewing && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #bee5eb', borderRadius: '8px', backgroundColor: '#d1ecf1', color: '#0c5460' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #bee5eb', paddingBottom: '10px' }}>Chi tiết thiết bị: {viewing.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <p><strong>Mã thiết bị:</strong> {viewing.deviceId}</p>
            <p><strong>Loại:</strong> {viewing.deviceType}</p>
            <p><strong>Phòng học:</strong> {viewing.room}</p>
            <p><strong>Hãng / Model:</strong> {viewing.brand} / {viewing.model}</p>
            <p><strong>Số lượng:</strong> {viewing.quantity}</p>
            <p><strong>Tình trạng:</strong> <span style={{ fontWeight: 'bold', color: viewing.status === 'Hư hỏng' ? 'red' : 'green' }}>{viewing.status}</span></p>
            <p><strong>Ngày tiếp nhận:</strong> {viewing.purchaseDate ? new Date(viewing.purchaseDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
          </div>
          <p><strong>Ghi chú:</strong> {viewing.description || 'Không có ghi chú'}</p>
          <div style={{ textAlign: 'right' }}>
            <button onClick={() => setViewing(null)} style={{ padding: '6px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #0c5460', backgroundColor: 'transparent' }}>Đóng</button>
          </div>
        </div>
      )}

      {/* Danh sách thiết bị */}
      <DeviceList devices={devices} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}