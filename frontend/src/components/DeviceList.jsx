export default function DeviceList({ devices = [], onView, onEdit, onDelete }) {
  // Kiểm tra an toàn: Đảm bảo devices luôn là một mảng và có phần tử
  if (!Array.isArray(devices) || devices.length === 0) {
    return <p>Không có thiết bị nào.</p>;
  }

  return (
    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>Mã</th>
          <th>Tên</th>
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
            <td>{d.status}</td>
            <td>
              <button onClick={() => onView(d)}>Xem</button>{' '}
              <button onClick={() => onEdit(d)}>Sửa</button>{' '}
              <button onClick={() => onDelete(d._id)}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}