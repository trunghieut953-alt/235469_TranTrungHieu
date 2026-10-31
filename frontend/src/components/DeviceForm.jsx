import { useState, useEffect } from 'react';

const STATUS_LIST = ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'];

export default function DeviceForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    deviceId: '', name: '', deviceType: '', room: '', brand: '',
    model: '', quantity: 1, status: 'Đang sử dụng', purchaseDate: '', description: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        // Cắt chuỗi ISO date để lấy đúng định dạng yyyy-MM-dd hiển thị trên input type="date"
        purchaseDate: initialData.purchaseDate ? initialData.purchaseDate.substring(0, 10) : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' };
  const labelStyle = { fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' };
  const groupStyle = { display: 'flex', flexDirection: 'column' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', maxWidth: '600px' }}>
      <div style={groupStyle}>
        <label style={labelStyle}>Mã thiết bị (*)</label>
        <input style={inputStyle} name="deviceId" placeholder="VD: MC01" value={form.deviceId} onChange={handleChange} required disabled={!!initialData} />
      </div>
      
      <div style={groupStyle}>
        <label style={labelStyle}>Tên thiết bị (*)</label>
        <input style={inputStyle} name="name" placeholder="VD: Máy chiếu Panasonic" value={form.name} onChange={handleChange} required />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Loại thiết bị (*)</label>
        <input style={inputStyle} name="deviceType" placeholder="VD: Máy chiếu" value={form.deviceType} onChange={handleChange} required />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Phòng học (*)</label>
        <input style={inputStyle} name="room" placeholder="VD: A101" value={form.room} onChange={handleChange} required />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Hãng sản xuất</label>
        <input style={inputStyle} name="brand" placeholder="VD: Panasonic" value={form.brand} onChange={handleChange} />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Model</label>
        <input style={inputStyle} name="model" placeholder="VD: PT-LB303" value={form.model} onChange={handleChange} />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Số lượng (*)</label>
        <input style={inputStyle} name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Tình trạng</label>
        <select style={inputStyle} name="status" value={form.status} onChange={handleChange}>
          {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Ngày tiếp nhận</label>
        <input style={inputStyle} name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange} />
      </div>

      <div style={{ ...groupStyle, gridColumn: 'span 2' }}>
        <label style={labelStyle}>Ghi chú</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} name="description" placeholder="Mô tả tình trạng hiện tại..." value={form.description} onChange={handleChange} />
      </div>

      <div style={{ display: 'flex', gap: '10px', gridColumn: 'span 2', justifyContent: 'flex-end', marginTop: '10px' }}>
        {onCancel && <button type="button" onClick={onCancel} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>Hủy</button>}
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold' }}>
          {initialData ? 'Lưu thay đổi' : 'Thêm mới'}
        </button>
      </div>
    </form>
  );
}